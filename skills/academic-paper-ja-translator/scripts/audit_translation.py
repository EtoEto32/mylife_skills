#!/usr/bin/env python3
"""対応台帳の機械検査。翻訳の生成・意味の同一性の判定は行わない。"""
import argparse
from collections import Counter
import json
from pathlib import Path


def require(condition, message):
    if not condition:
        raise ValueError(message)


def id_list(value, name):
    require(isinstance(value, list) and all(isinstance(x, str) and x for x in value),
            f"{name}: 空でない文字列の配列が必要")
    return value


def audit(data):
    require(isinstance(data, dict), "台帳はJSONオブジェクトが必要")
    scope = data.get("scope")
    require(isinstance(scope, dict), "scopeが必要")
    require(isinstance(scope.get("selection"), str) and scope["selection"].strip(),
            "scope.selectionに指定範囲を記録する")
    expected = id_list(scope.get("expected_ids"), "scope.expected_ids")
    require(expected and len(expected) == len(set(expected)), "expected_idsが空または重複している")
    units = data.get("units")
    entries = data.get("translations")
    require(isinstance(units, list) and isinstance(entries, list), "unitsとtranslationsは配列が必要")
    source = {}
    for unit in units:
        require(isinstance(unit, dict), "unitsの要素はオブジェクトが必要")
        uid = unit.get("id")
        require(isinstance(uid, str) and uid and uid not in source, "原文IDが空または重複している")
        for field in ("text", "kind", "locator"):
            require(isinstance(unit.get(field), str) and unit[field].strip(), f"{uid}: {field}が必要")
        protected = id_list(unit.get("protected", []), f"{uid}.protected")
        require(all(span in unit["text"] for span in protected), f"{uid}: 保護文字列が原文に存在しない")
        source[uid] = unit
    require(set(expected) <= set(source), "指定範囲に原文一覧にないIDがある")
    errors, unresolved = [], []
    seen = Counter()
    completed = set()
    checked_spans = 0
    for index, entry in enumerate(entries):
        require(isinstance(entry, dict), "translationsの要素はオブジェクトが必要")
        ids = id_list(entry.get("source_ids"), f"translations[{index}].source_ids")
        require(ids and len(ids) == len(set(ids)), f"出力{index}: 原文IDが空または重複している")
        require(set(ids) <= set(source), f"出力{index}: 不明な原文ID")
        status, review = entry.get("status"), entry.get("review")
        require(status in {"translated", "preserved", "unreadable", "pending"}, f"出力{index}: 不明なstatus")
        require(review in {"verified", "unverified"}, f"出力{index}: 不明なreview")
        text = entry.get("target_text")
        require(isinstance(text, str), f"出力{index}: target_textは文字列が必要")
        require(isinstance(entry.get("target_locator"), str) and entry["target_locator"].strip(),
                f"出力{index}: target_locatorが必要")
        seen.update(ids)
        extra = set(ids) - set(expected)
        if extra:
            errors.append(f"指定範囲外の出力: {sorted(extra)}")
        if status in {"pending", "unreadable"} or review == "unverified":
            unresolved.append({"source_ids": ids, "status": status, "review": review})
        if status in {"pending", "unreadable"}:
            if review == "verified":
                errors.append(f"{ids}: 未処理・判読不能を検証済みにしている")
            continue
        if not text.strip():
            errors.append(f"{ids}: 訳文が空")
            continue
        original = "\n\n".join(source[uid]["text"] for uid in ids)
        if status == "preserved" and original != text:
            errors.append(f"{ids}: 原文保持と記録されているが内容が異なる")
        spans = {span for uid in ids for span in source[uid].get("protected", [])}
        for span in sorted(spans):
            checked_spans += 1
            if original.count(span) != text.count(span):
                errors.append(f"{ids}: 保護文字列の個数が不一致: {span!r}")
        if review == "verified":
            completed.update(ids)
    duplicates = sorted(uid for uid, count in seen.items() if count > 1)
    if duplicates:
        errors.append(f"重複して出力した原文ID: {duplicates}")
    missing = [uid for uid in expected if seen[uid] == 0]
    if missing:
        unresolved.append({"missing_source_ids": missing})
    code = 1 if errors else (2 if unresolved else 0)
    return {
        "status": {0: "mechanical-pass", 1: "needs-review", 2: "incomplete"}[code],
        "expected_units": len(expected),
        "completed_and_marked_verified_units": len(completed & set(expected)),
        "protected_spans_checked": checked_spans,
        "errors": errors,
        "unresolved": unresolved,
        "semantic_equivalence_proven": False,
        "limits": "原文一覧の網羅性、意味・訳語・自然さ、最終文書と台帳の一致は別途照合が必要。",
    }, code


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("ledger", type=Path, help="UTF-8 JSONの対応台帳")
    parser.add_argument("--output", type=Path, help="検査結果JSONの保存先")
    args = parser.parse_args()
    try:
        require(not args.output or args.output.resolve() != args.ledger.resolve(), "原文台帳を検査結果で上書きできない")
        data = json.loads(args.ledger.read_text(encoding="utf-8-sig"))
        result, code = audit(data)
    except (OSError, ValueError, TypeError) as exc:
        result, code = {"status": "invalid-ledger", "errors": [str(exc)],
                        "semantic_equivalence_proven": False}, 1
    rendered = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output and args.output.resolve() != args.ledger.resolve():
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered + "\n", encoding="utf-8")
    print(rendered)
    return code


if __name__ == "__main__":
    raise SystemExit(main())

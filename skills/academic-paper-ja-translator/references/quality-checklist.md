# 品質確認と対応台帳

## 意味の確認

指定範囲の各単位を、原文と訳文で直接照合する。

- 主体・対象・主張の強さは同じか。観察、示唆、仮説、実験、証明が入れ替わっていないか。
- 条件、前提、例外、否定の範囲、比較対象、因果関係、概数が保持されているか。
- 著者と先行研究の主張が区別され、補足・解説・要約を混ぜていないか。
- 用語、数値・単位、数式の全要素、図表・式・引用番号、コード、参考文献を照合したか。
- 日本語の主述・修飾が明確か。文を分けて条件の掛かり先や比重が動いていないか。
- タイトル、キャプション、脚注、アルゴリズム、付録も対象一覧と照合したか。

対象一覧は原文を構造化した時点で作る。完成した訳文から逆算したり、対象を消して検査を通したりしない。

## 台帳

長い論文やファイル生成では、作業用フォルダにUTF-8 JSONを保存する。短い依頼で台帳が過剰なら同じ観点を直接確認する。台帳を翻訳本文へ混ぜない。

```json
{
  "scope": {"selection": "Introductionのみ", "expected_ids": ["s1-p1", "s1-eq1"]},
  "units": [
    {"id": "s1-p1", "kind": "paragraph", "locator": "p.2 左段", "text": "The method may reduce latency by 5% [3].", "protected": ["5%", "[3]"]},
    {"id": "s1-eq1", "kind": "equation", "locator": "p.2 式(1)", "text": "E = mc^2", "protected": ["E = mc^2"]}
  ],
  "translations": [
    {"source_ids": ["s1-p1"], "target_text": "この手法は遅延を5%短縮する可能性がある[3]。", "status": "translated", "review": "verified", "target_locator": "Introduction 第1段落"},
    {"source_ids": ["s1-eq1"], "target_text": "E = mc^2", "status": "preserved", "review": "verified", "target_locator": "式(1)"}
  ]
}
```

- `units`は確認済み原文の単位。`kind`にparagraph、heading、caption、table、equation、footnote、code、bibliographyなどを記録する。
- `expected_ids`は訳出・保持が必要な範囲。全文では全単位を含める。部分翻訳では指定範囲だけを入れる。前後の文脈用の単位をunitsに置いても、その範囲外を出力しない。
- `source_ids`で原文に対応付ける。段落を結合する場合は複数IDを1件にまとめる。分割する場合は1件の`target_text`内に複数段落を入れる。同じIDを別の出力へ重複登録しない。
- `status`は`translated`、原文のまま残す`preserved`、`unreadable`、`pending`。`review`は`verified`または`unverified`。原文照合していない訳や判読不能をverifiedにしない。
- `protected`には変えない数値・単位の組、式、コード、参照などの原文の連続文字列を登録する。選択した文字列の検査であり、全数値・全参照の自動列挙ではない。日本語訳する語は含めない。

実行：`python <スキル実体>/scripts/audit_translation.py ledger.json --output audit.json`

終了コードは0が機械検査通過、1が不整合、2が未処理・未検証。形式不正は1。不整合と未処理が共存すれば1を優先する。

## 機械検査の限界

IDの欠落・重複・範囲外、記入した検証状態、登録した保護文字列の数と保持を検査する。同じ文字列を含む誤訳や、原文一覧自体の抜けは検出できない。意味の一致、訳語、日本語の自然さ、最終ファイルと台帳の一致は別途確認する。

未確認は未検証として報告する。`mechanical-pass`は全内容を正しく訳した証明ではない。修正した単位と前後を再照合し、理由なく言い換えを繰り返さない。

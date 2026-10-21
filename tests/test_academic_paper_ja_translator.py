"""対応漏れ・範囲・数値等の機械検査の回帰テスト（標準ライブラリのみ）。"""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'skills/academic-paper-ja-translator/scripts/audit_translation.py'
SPEC = importlib.util.spec_from_file_location('translation_audit', SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def ledger():
    return {
        'scope': {'selection': 'Abstractのみ', 'expected_ids': ['a']},
        'units': [{'id': 'a', 'kind': 'paragraph', 'locator': 'p.1 Abstract',
                   'text': 'Latency may decrease by 5% [3].', 'protected': ['5%', '[3]']}],
        'translations': [{'source_ids': ['a'], 'target_text': '遅延が5%短縮する可能性がある[3]。',
                          'status': 'translated', 'review': 'verified', 'target_locator': '要旨 第1段落'}],
    }


class TranslationAuditTests(unittest.TestCase):
    def test_verified_coverage_is_not_semantic_proof(self):
        result, code = MODULE.audit(ledger())
        self.assertEqual(code, 0)
        self.assertFalse(result['semantic_equivalence_proven'])

    def test_missing_unit_is_incomplete(self):
        data = ledger(); data['translations'] = []
        self.assertEqual(MODULE.audit(data)[1], 2)

    def test_duplicate_mapping_is_rejected(self):
        data = ledger(); data['translations'] *= 2
        self.assertEqual(MODULE.audit(data)[1], 1)

    def test_partial_scope_does_not_allow_extra_translation(self):
        data = ledger()
        data['units'].append({'id': 'b', 'kind': 'paragraph', 'locator': 'p.2', 'text': 'Method.'})
        data['translations'].append({'source_ids': ['b'], 'target_text': '手法。', 'status': 'translated',
                                     'review': 'verified', 'target_locator': '方法'})
        self.assertEqual(MODULE.audit(data)[1], 1)

    def test_changed_number_is_rejected(self):
        data = ledger(); data['translations'][0]['target_text'] = '遅延が6%短縮する可能性がある[3]。'
        self.assertEqual(MODULE.audit(data)[1], 1)

    def test_missing_citation_is_rejected(self):
        data = ledger(); data['translations'][0]['target_text'] = '遅延が5%短縮する可能性がある。'
        self.assertEqual(MODULE.audit(data)[1], 1)

    def test_changed_equation_is_rejected(self):
        data = ledger(); data['units'][0].update(text='E = mc^2', protected=['E = mc^2'])
        data['translations'][0]['target_text'] = 'E = mc^3'
        self.assertEqual(MODULE.audit(data)[1], 1)

    def test_changed_preserved_bibliography_is_rejected(self):
        data = ledger(); data['translations'][0].update(status='preserved')
        self.assertEqual(MODULE.audit(data)[1], 1)

    def test_unreadable_cannot_be_marked_verified(self):
        data = ledger(); data['translations'][0].update(status='unreadable')
        self.assertEqual(MODULE.audit(data)[1], 1)

    def test_unverified_translation_stays_incomplete(self):
        data = ledger(); data['translations'][0]['review'] = 'unverified'
        self.assertEqual(MODULE.audit(data)[1], 2)

    def test_merged_paragraphs_keep_both_ids(self):
        data = ledger(); data['scope']['expected_ids'].append('b')
        data['units'].append({'id': 'b', 'kind': 'paragraph', 'locator': 'p.1 para2', 'text': 'No proof.'})
        data['translations'][0]['source_ids'].append('b')
        data['translations'][0]['target_text'] += '\n\n証明ではない。'
        self.assertEqual(MODULE.audit(data)[1], 0)

    def test_split_japanese_paragraphs_use_one_mapping(self):
        data = ledger(); data['translations'][0]['target_text'] = '遅延が5%短縮する可能性がある。\n\n参照[3]。'
        self.assertEqual(MODULE.audit(data)[1], 0)

    def test_unknown_id_and_status_are_invalid(self):
        for field, value in [('source_ids', ['unknown']), ('status', 'done')]:
            with self.subTest(field=field):
                data = ledger(); data['translations'][0][field] = value
                with self.assertRaises(ValueError): MODULE.audit(data)

    def test_duplicate_source_ids_are_invalid(self):
        data = ledger(); data['units'] *= 2
        with self.assertRaises(ValueError): MODULE.audit(data)

    def test_non_source_protection_is_invalid(self):
        data = ledger(); data['units'][0]['protected'].append('99%')
        with self.assertRaises(ValueError): MODULE.audit(data)

    def test_semantically_wrong_same_numbers_need_manual_review(self):
        data = ledger(); data['translations'][0]['target_text'] = '遅延が5%短縮することが証明された[3]。'
        result, code = MODULE.audit(data)
        self.assertEqual(code, 0)
        self.assertFalse(result['semantic_equivalence_proven'])

    def test_cli_emits_json_and_does_not_overwrite_ledger(self):
        root = SCRIPT.parents[3] / 'tmp'
        root.mkdir(exist_ok=True)
        with tempfile.TemporaryDirectory(dir=root) as folder:
            self.assertTrue(Path(folder).resolve().is_relative_to(root.resolve()))
            path = Path(folder) / 'ledger.json'; path.write_text(json.dumps(ledger()), encoding='utf-8')
            output = Path(folder) / 'audit.json'
            run = subprocess.run([sys.executable, '-X', 'utf8', str(SCRIPT), str(path), '--output', str(output)],
                                 capture_output=True, text=True, encoding='utf-8')
            self.assertEqual(run.returncode, 0, run.stderr)
            self.assertEqual(json.loads(output.read_text('utf-8'))['status'], 'mechanical-pass')
            before = path.read_bytes()
            run = subprocess.run([sys.executable, '-X', 'utf8', str(SCRIPT), str(path), '--output', str(path)],
                                 capture_output=True)
            self.assertEqual(run.returncode, 1)
            self.assertEqual(path.read_bytes(), before)


if __name__ == '__main__':
    unittest.main()

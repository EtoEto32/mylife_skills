# Codex・Claude Code 共通スキル

スキルごとに1つの `SKILL.md` を保守し、CodexとClaude Codeで共有します。
この構成は、このプロジェクト内で使うローカルスキル用です。

## 初期設定・スキル追加後

WindowsのPowerShellで実行します。管理者権限が不要なディレクトリジャンクションを作成します。

```powershell
.\setup-skills.ps1
```

実行ポリシーで拒否される場合は、このスクリプトを確認したうえで次を使います。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup-skills.ps1
```

既存のリンクはそのまま使います。別のファイルやフォルダが同じ場所にある場合は、上書きせず停止します。
ジャンクションはこのPC上の絶対パスを参照するため、別のPCへのコピーやフォルダ移動後はリンクを再設定する必要があります。
Gitでジャンクションを配布することは想定していません。ソースフォルダとこのスクリプトを用意して、PCごとに実行してください。

## 編集する場所

`skills/<スキル名>/SKILL.md` を編集します。既存スキルでは、このパスも元の配布フォルダへのリンクなので、元のファイルが更新されます。
`references/`、`scripts/`、`assets/` も同じフォルダを共有します。
元の配布フォルダを更新すると、両ツールの参照先にも反映されます。上流の更新で自分の編集が上書きされないよう、編集内容は元リポジトリで管理してください。

| スキル | 元のフォルダ |
| --- | --- |
| marp-creator | `classmethod-marp-theme/.claude/skills/marp-creator` |
| slide-story | `minorun-marp-skill/skills/slide-story` |
| slide-design-dark | `minorun-marp-skill/skills/slide-design-dark` |
| slide-figures | `minorun-marp-skill/skills/slide-figures` |
| yomiyasu | `yomiyasu/skills/yomiyasu` |

`satori` には `SKILL.md` がないため、スキルとして登録していません。

## 新しい共通スキル

`skills/<スキル名>/SKILL.md` を作成し、上の設定コマンドを実行します。
本文には両ツールで実行できる手順を書き、専用のツール名や専用変数が必要な手順はツールごとの条件を明記します。

```markdown
---
name: my-skill
description: 何を行うスキルか、どんな依頼で使うか。
---

# My Skill

ここに共通の手順を書く。
```

## 読み込みと呼び出し

Codexは `.agents/skills/<スキル名>`、Claude Codeは `.claude/skills/<スキル名>` から同じ実体を読みます。
`.codex/skills` はこの構成では使用しません。
設定後、このプロジェクトで新しいセッションを開始して一覧を確認してください。

- Codex: `$yomiyasu この文章を読みやすくして`
- Claude Code: `/yomiyasu この文章を読みやすくして`

リンク先のファイルが同じであることと、各ツールでの実際の読み込みは別の確認です。
Claude独自のfrontmatterや実行制御が、Codexでも同じように働くとは限りません。
通常のClaudeチャットやCoworkへのアップロードは、このローカル設定の対象外です。

公式仕様: [Codexのスキル](https://learn.chatgpt.com/docs/build-skills)、[Claude Codeのスキル](https://code.claude.com/docs/en/skills)。

# Codex・Claude Code 共通スキル

スキルごとに1つの `SKILL.md` を保守し、CodexとClaude Codeで共有します。
この構成は、このプロジェクト内で使うローカルスキル用です。

## 共有の仕組み

Codexのプロジェクト用スキルは `.agents/skills/`、Claude Codeのプロジェクト用スキルは `.claude/skills/` に置きます。それぞれの読み込み先から、同じスキルフォルダを参照させます。読み込み先の仕様は、[Codex公式ドキュメント](https://learn.chatgpt.com/docs/build-skills)と[Claude Code公式ドキュメント](https://code.claude.com/docs/en/skills)を参照してください。

このリポジトリでは、Windowsのディレクトリジャンクションを使います。次は `slide-story` の例です。

```text
minorun-marp-skill/skills/slide-story/  ← スキルの実体
  SKILL.md
skills/slide-story/                   ← 実体へのジャンクション
.agents/skills/slide-story/           ← 同じ実体へのジャンクション（Codex）
.claude/skills/slide-story/            ← 同じ実体へのジャンクション（Claude Code）
```

3つの参照先は同じフォルダです。コピーを同期する必要はなく、どの参照先から編集しても実体に反映されます。補助ファイルも共有するため、`SKILL.md` だけでなくスキルフォルダ全体をリンクします。

`skills/` はこのリポジトリ独自の編集・整理用ディレクトリです。ツールによる検出には `.agents/skills/` と `.claude/skills/` を使います。

## 別のPCで使い始める

外部スキルはGitサブモジュールとして登録しています。最初に取得してから、ローカルのリンクを作ります。

```powershell
git clone --recurse-submodules https://github.com/EtoEto32/mylife_skills.git
Set-Location mylife_skills
.\setup-skills.ps1
```

すでに通常の `git clone` で取得した場合は、先に次を実行してください。

```powershell
git submodule update --init --recursive
.\setup-skills.ps1
```

このリポジトリは非公開のため、取得にはアクセス権とGitHubの認証が必要です。

## 初期設定・スキル追加後

WindowsのPowerShellで実行します。管理者権限が不要なディレクトリジャンクションを作成します。

```powershell
.\setup-skills.ps1
```

実行ポリシーで拒否される場合は、このスクリプトを確認したうえで次を使います。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup-skills.ps1
```

既存のリンクはそのまま使います。同じ場所に通常のフォルダがあり、配布元と全ファイルの内容・ディレクトリ構成が一致する場合は、フォルダを退避してからジャンクションに切り替えます。退避先は `.skill-backups/<日時とID>/<元の相対パス>` です。移動後もSHA-256で内容を検証し、元のファイルを残します。退避フォルダはローカル専用で、Gitには追加しません。

内容が異なるフォルダ、別の参照先を指すリンク、内部にリンクを含むフォルダは、自動で置き換えず停止します。独自の変更を配布元の内容で上書きすることはありません。
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

`satori` はリポジトリ直下を単一スキルとして登録していません。上の5スキルに加え、以下の外部スキルも登録しています。

| 配布元 | Codexでの呼び出し名 | 元のフォルダ |
| --- | --- | --- |
| [hideshi/scholarly-agent-skills](https://github.com/hideshi/scholarly-agent-skills) | 日本語版24スキル。翻訳は`academic-paper-translation`、PDF変換は`pdf-paper-ingestion` | `scholarly-agent-skills/skills/ja/<スキル名>` |
| [AIKONG2024/paper-translate-agent-skill](https://github.com/AIKONG2024/paper-translate-agent-skill) | `pdf-translate` | `paper-translate-agent-skill/pdf-translate` |
| [Chael-Chael/zotero-translate-skill](https://github.com/Chael-Chael/zotero-translate-skill) | `zotero-translate` | `zotero-translate-skill/skills/zotero-translate` |
| [toku345/marp-slides](https://github.com/toku345/marp-slides) | `creating-marp-slides` | `marp-slides/.claude/skills/creating-marp-slides` |
| [softaworks/agent-toolkit](https://github.com/softaworks/agent-toolkit) | `marp-slide` | `agent-toolkit/skills/marp-slide` |
| [hora-algebra/interactive-slide](https://github.com/hora-algebra/interactive-slide) | `interactive-slide` | `interactive-slide/plugins/interactive-slide/skills/interactive-slide` |
| [minorun365/agent-builder-skills](https://github.com/minorun365/agent-builder-skills) | AWSのエージェントWebアプリ開発用8スキル（下表） | `agent-builder-skills/skills/<スキル名>` |

7リポジトリはGitサブモジュールとしてクローンしています。Scholarlyは日本語版のみ、agent-toolkitは指定されたMarpスキルのみを登録し、同名の英語版や無関係なスキルは読み込み先に追加しません。既存5スキルと合わせて42スキルをこのプロジェクトで使う構成です。

Agent Builderから登録するスキルは次の8つです。スキルと参照資料の登録であり、AWSへのデプロイや認証設定は実行しません。

| 呼び出し名 | 用途 |
| --- | --- |
| `kb-agent-webapp-cdk` | Webアプリ全体の構成、S3・CloudFrontでの配信 |
| `kb-agentcore-cdk` | AgentCore RuntimeのCDK定義、認証、コンテナ |
| `kb-strands-agentcore` | Strands Agentsのエージェント・ツール・会話履歴 |
| `kb-agentcore-observability` | トレース、メトリクス、監視の調査 |
| `kb-agentcore-identity` | 外部サービスに接続するための認証 |
| `kb-demo-app-auth` | Cognito、Googleログイン、パスキー |
| `kb-frontend-sse` | SSEによる応答のストリーミング |
| `cdkd-deploy` | コミュニティ製CDKDによるCDKのデプロイ |

設定後の次のターンから利用できます。一覧が更新されない場合は、このプロジェクトで新しいチャットを開いてください。呼び出し例:

```text
$pdf-paper-ingestion この論文PDFをMarkdownにして
$academic-paper-translation 原文と日本語訳を段落ごとに並べ、用語集も作って
$pdf-translate このPDFを日本語に翻訳し、レイアウトを保ったPDFにして
$zotero-translate Zoteroのこの論文を日本語に翻訳し、日本語版と対訳版を添付して
$creating-marp-slides この内容からMarp資料を作って
$marp-slide この資料をtechテーマで整えて
$interactive-slide この発表原稿から操作できるHTMLスライドを作って
```

登録先はプロジェクトの`.agents/skills/`です。全プロジェクト共通のユーザースキル領域には追加していません。Windowsでのパス・保存先の扱いはルートの`AGENTS.md`に記載しています。相対参照はジャンクションの見かけの位置ではなく、配布元の実体を基準に解決します。

登録は依存ライブラリのインストールや翻訳実行とは別です。PDF翻訳は各スキルのdoctor/setupや初回実行で専用ランタイムを準備します。Zotero翻訳ではZotero本体と対象の添付PDFが必要で、bridgeの導入・再起動は実際の添付作業時に行います。MarpのPDF/PPTX出力はMarp CLIと対応ブラウザ、interactive-slideの数式・QR・画面検査は対応するNode/Pythonライブラリを使います。APIキーはこの登録作業では設定していません。

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

自作スキルを `skills/` の実フォルダとして作成した場合は、そのフォルダをGitに追加します。外部スキルの `skills/` 内のリンクは `.gitignore` で除外しています。

外部リポジトリから登録対象を増やす場合は、`setup-skills.ps1` の `$sources` にスキル名と実体の相対パスを追加してください。対応する `skills/<スキル名>` のリンクも `.gitignore` に追加します。

## 共通スキルを書くコツ

`name` と `description` を持つYAML frontmatterと、Markdownの手順を基本にします。`description` には、何ができるかに加えて、どんな依頼で使うかを書きます。

本文の参照先は `references/style.md` など、スキルフォルダを基準に示すと移動しやすくなります。個人のPCの絶対パスは共通手順に埋め込まず、必要な実行環境や依存関係を明記してください。

Claude Code固有のfrontmatter、変数、ツール名には依存しすぎないようにします。専用機能が必要なら「Claude Codeの場合」「Codexの場合」と手順を分けます。同じMarkdownを読めても、権限設定や実行制御まで共有されるわけではありません。

## 読み込みと呼び出し

Codexは `.agents/skills/<スキル名>`、Claude Codeは `.claude/skills/<スキル名>` から同じ実体を読みます。
`.codex/skills` はこの構成では使用しません。
設定後、このプロジェクトで新しいセッションを開始して一覧を確認してください。

- Codex: `$yomiyasu この文章を読みやすくして`
- Claude Code: `/yomiyasu この文章を読みやすくして`

リンク先のファイルが同じであることと、各ツールでの実際の読み込みは別の確認です。
Claude独自のfrontmatterや実行制御が、Codexでも同じように働くとは限りません。
通常のClaudeチャットやCoworkへのアップロードは、このローカル設定の対象外です。

## リンクの確認とトラブル対処

次のコマンドで、編集用・Codex用・Claude Code用のリンク先を確認できます。

```powershell
Get-Item -Force skills/slide-story, .agents/skills/slide-story, .claude/skills/slide-story |
    Select-Object FullName, LinkType, Target

Test-Path .agents/skills/slide-story/SKILL.md
Test-Path .claude/skills/slide-story/SKILL.md
```

3つとも `LinkType` が `Junction` で、`Target` が同じ実体を指しているか確認します。`Test-Path` が両方 `True` になったら、両ツールで明示的にスキルを呼び出し、手順を読めるか確認してください。リンクの確認だけでは、ツール側の検出・実行の確認にはなりません。

| 症状 | 確認すること |
| --- | --- |
| `Missing source SKILL.md` | サブモジュールを取得したか、`$sources` のパスが正しいか |
| `Existing path was preserved` / `Different contents were preserved` | 異なる内容のフォルダや別のリンクがないか。既存内容を残し、差分を確認してから競合を解消する |
| PC変更・フォルダ移動後に読めない | `Target` が以前の絶対パスを指していないか。古いリンクを確認して作り直す |
| ファイルはあるがスキルが見つからない | プロジェクトを開く場所、frontmatterの名前・説明、同名スキルの有無を確認し、新しいセッションで試す |

設定スクリプトは、同じ実体を指す既存のリンクを再利用します。内容が完全に一致する通常フォルダだけを退避・リンク化し、別のリンク先への自動付け替えはしません。再実行しても、正常なリンクから新しい退避フォルダは作りません。

yomiyasuは、Codex側に保存されていたv1.1.1の全14ファイルと一致する上流コミット `373356eb874af5184962c88e925ea7eb58450318` を共有元に指定しています。通常フォルダの既存内容を残し、Codex・Claude Code・編集用の3か所から同じ版を参照するためです。

退避とリンク化の回帰テストは `./tests/setup-skills.Tests.ps1` で実行できます。同一内容の退避、再実行時の安定性、独自変更・別のリンク・プロジェクト外のフォルダの保護を確認します。テスト用ファイルは、一時フォルダ内の表示された場所に残します。

## Gitでの保存と更新

リンク自体はPCごとに作成し、Gitでは設定スクリプト、自作スキル、サブモジュールの参照を管理します。PPT、プレビュー画像、検査結果、資料生成用のビルドスクリプトは、現在の `.gitignore` に従って除外します。

既存スキルの実体を編集すると、変更は対応するサブモジュール内に発生します。親リポジトリでコミットするだけでは、内部の変更内容を保存できません。自分のforkなど書き込み可能な取得元を用意し、サブモジュール内でコミット・プッシュした後、親リポジトリで更新された参照をコミット・プッシュします。取得元をforkへ変更した場合は `.gitmodules` も更新してください。

他のPCで親リポジトリの更新を取り込む場合は、サブモジュールも記録されたコミットに合わせます。

```powershell
git pull --ff-only
git submodule update --init --recursive
.\setup-skills.ps1
```

上流の最新版を取り込む操作と、親リポジトリに記録された版を復元する操作は別です。上流を更新する前にサブモジュール内の未保存の編集を確認し、更新後は両ツールでスキルを呼び出して確認してください。

公式仕様: [Codexのスキル](https://learn.chatgpt.com/docs/build-skills)、[Claude Codeのスキル](https://code.claude.com/docs/en/skills)。

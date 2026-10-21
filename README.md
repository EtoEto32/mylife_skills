# Codex・Claude Code 共通スキル

## 概要

CodexとClaude Codeで使うスキルをまとめたリポジトリです。論文の執筆・翻訳、スライド作成、ノート整理、AWSを使った開発などに対応しています。

スキルの実体を1か所に置き、両ツールから同じフォルダを参照します。外部スキルはGitサブモジュール、自作スキルはこのリポジトリ内で管理しています。対象はWindows環境で、このプロジェクトを開いて使う構成です。

## 現在使えるskills

登録しているスキルは50件です。外部スキル49件と、自作の翻訳スキル1件を含みます。以下の名前は`setup-skills.ps1`の登録名です。

### 文章・翻訳・会話のノート化

| スキル名 | 用途 |
| --- | --- |
| `yomiyasu` | 意味を保ちながら、不自然な日本語や直訳調の表現を推敲する |
| `academic-paper-ja-translator` | 英語論文を自然な日本語に翻訳する。原文の主張・条件・数式・引用を保持する自作スキル |
| `make-note` | 会話の内容をMarkdownノートにまとめる。このプロジェクトでは日本語が既定で、保存先は指定がなければ作業先の`Note/` |

配布元は[yomiyasu](https://github.com/nanaism/yomiyasu)と[make-note-skills](https://github.com/birbirbrian/make-note-skills)です。翻訳には`academic-paper-ja-translator`を使います。日本語原稿の推敲には`yomiyasu`を使います。

### 文献調査・論文執筆

| スキル名 | 用途 |
| --- | --- |
| `literature-review-ml` | 機械学習・統計分野の文献を検索・選定し、論点ごとに整理する |
| `literature-search` | 複数の論文データベースで文献を検索する |
| `literature-gap-analysis` | 先行研究で分かっていることと、新たに取り組む課題を整理する |
| `research-plan-workshop` | 研究課題、想定読者、研究を完成とする条件を整理する |
| `paper-writing-onboarding` | 論文執筆の準備、作業の流れ、引用の基本を確認する |
| `pdf-paper-ingestion` | テキストを含む論文PDFから見出しや画像を抽出し、Markdownに整理する |
| `primary-data-integration` | 実験ログや調査データを、個人情報などに配慮して論文に取り込む |
| `source-criticism-gate` | 引用する文献・Webサイト・データの信頼性を確認する |
| `author-publication-versions` | Zenodoに公開した自著論文のバージョンとDOIを確認・記録する |
| `citation-traceability-audit` | 本文の引用、書誌情報、参照文献の実体が対応しているか確認する |
| `claim-evidence-gate` | 論文の主張を、実験データや引用文献がどこまで裏づけているか確認する |
| `counter-argument-tdd` | 想定される反論や反例を整理してから、主張を組み立てる |
| `design-science-research` | デザインサイエンス研究の論文構成と、研究過程の記録を整理する |
| `diachronic-claim-typing` | 概念史や制度史などで、異なる時代を結びつける主張の妥当性を確認する |
| `scholarly-concept-modeling` | 論文で使う概念を定義し、意味の混同を防ぐ |
| `prose-style-guide` | 専門用語の説明や文の長さを整え、読みやすい学術文体で書く |
| `terminology-consistency` | 用語の表記揺れと説明の不足を確認する |
| `reviewer-readability-check` | 読者に伝わりにくい内部記号や、節番号・参照の不整合を確認する |
| `sensitive-expression-guard` | 過度な断定や、誤解につながる表現を確認する |
| `pre-reading-briefing` | 校閲前に、各節の前提・論点・想定反論を整理する |
| `pre-submission-triage` | 投稿前の検査結果を読み、修正や確認が必要な項目を整理する |
| `submission-venue-advisor` | 研究分野や目的に合う投稿先と、投稿時の入力内容を検討する |
| `session-research-handoff` | 研究の進捗、未解決の課題、次の作業を引き継ぐ |
| `friction-driven-skill-improvement` | 執筆中の訂正や手作業を記録し、スキルの改善案にまとめる |

配布元は[literature-review](https://github.com/chenlu-hung/literature-review)と[scholarly-agent-skills](https://github.com/hideshi/scholarly-agent-skills)です。Scholarlyは翻訳を除く日本語版23スキルを登録しています。

### スライド作成

| スキル名 | 用途 |
| --- | --- |
| `marp-creator` | メモの整理から構成を考え、Marpスライドを作る |
| `slide-story` | 登壇・講義スライドの流れ、見出し、発表時間を検討する |
| `slide-design-dark` | 黒地のMarpスライドの余白、配色、表などを整える |
| `slide-figures` | スライドに載せる図・構成図・挿絵を作る |
| `creating-marp-slides` | Marpスライドを作成・修正し、HTML・PDF・PPTXに出力する |
| `marp-slide` | テーマを選んでMarpスライドの見た目を整える |
| `interactive-slide` | 発表資料を、図や操作機能を含むHTMLスライドにする |

配布元は[classmethod-marp-theme](https://github.com/classmethod/classmethod-marp-theme)、[minorun-marp-skill](https://github.com/minorun365/minorun-marp-skill)、[marp-slides](https://github.com/toku345/marp-slides)、[agent-toolkit](https://github.com/softaworks/agent-toolkit)、[interactive-slide](https://github.com/hora-algebra/interactive-slide)です。

### Obsidian

| スキル名 | 用途 |
| --- | --- |
| `obsidian-markdown` | 内部リンク、埋め込み、コールアウトなどを使ったノートを書く |
| `obsidian-bases` | ノートを一覧・絞り込み表示するBasesファイルを作成・編集する |
| `json-canvas` | ノートや図のつながりを表すCanvasファイルを作成・編集する |
| `obsidian-cli` | CLIからノートを検索・作成し、Vaultを操作する |
| `defuddle` | Webページから本文を抽出してMarkdownにする |
| `knap` | JSON・CSVのデータとテンプレートからMarkdownを生成する |

配布元は[obsidian-skills](https://github.com/kepano/obsidian-skills)です。

### AWS・エージェント開発

| スキル名 | 用途 |
| --- | --- |
| `kb-agent-webapp-cdk` | S3・CloudFront・AgentCoreを使うWebアプリ全体を設計する |
| `kb-agentcore-cdk` | AgentCore RuntimeのCDK定義、認証、コンテナ構成を扱う |
| `kb-strands-agentcore` | Strands Agentsでエージェント、ツール、会話履歴を扱う |
| `kb-agentcore-observability` | トレースやメトリクスを設定し、動作を調査する |
| `kb-agentcore-identity` | 外部サービスに接続するための認証を扱う |
| `kb-demo-app-auth` | Cognito、Googleログイン、パスキーを使った認証を構成する |
| `kb-frontend-sse` | SSEによる応答のストリーミングを実装・調査する |
| `cdkd-deploy` | コミュニティ製CDKDでCDKアプリをデプロイ・調査する |

配布元は[agent-builder-skills](https://github.com/minorun365/agent-builder-skills)です。

### 動画・ファイル整理

| スキル名 | 用途 |
| --- | --- |
| `youtube-full` | YouTubeの字幕、検索結果、チャンネル情報、再生リストを取得する |
| `file-organizer` | ファイル構成や重複を調べ、整理案の作成や移動・名前変更を支援する |

配布元は[youtube-skills](https://github.com/artemchuikin/youtube-skills)と[awesome-codex-skills](https://github.com/composio-community/awesome-codex-skills)です。後者から登録しているのは`file-organizer`だけです。

## セットアップ方法

### 初回の取得と登録

WindowsでGitとPowerShellを用意し、次を実行してください。このリポジトリは非公開のため、取得にはアクセス権とGitHubの認証が必要です。

```powershell
git clone --recurse-submodules https://github.com/EtoEto32/mylife_skills.git
Set-Location mylife_skills
.\setup-skills.ps1
```

すでに通常の`git clone`で取得している場合は、リポジトリ内で次を実行してください。

```powershell
git submodule update --init --recursive
.\setup-skills.ps1
```

実行ポリシーで拒否される場合は、スクリプトを確認したうえで次を使います。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\setup-skills.ps1
```

設定後、このプロジェクトで新しいチャットを開いてください。Codexでは`$yomiyasu この文章を読みやすくして`、Claude Codeでは`/yomiyasu この文章を読みやすくして`のように呼び出します。ツールによって一覧に配布元の接頭辞が付く場合は、表示されているスキルを選んでください。

### CodexとClaude Codeで共通化する方法

`setup-skills.ps1`は、Windowsのディレクトリジャンクションを使い、両ツールの読み込み先から同じスキルを参照させます。管理者権限は不要です。`slide-story`の場合は、次の構成になります。

```text
minorun-marp-skill/skills/slide-story/  スキルの実体
skills/slide-story/                   編集・整理用のリンク
.agents/skills/slide-story/           Codex用のリンク
.claude/skills/slide-story/           Claude Code用のリンク
```

リンクは同じフォルダを指します。`SKILL.md`だけでなく、`references/`、`scripts/`、`assets/`も共有するため、コピー同士を同期する必要はありません。自作の`academic-paper-ja-translator`は`skills/`内の実フォルダを共有元にしています。

この設定はプロジェクト内で使うものです。全プロジェクト共通のユーザースキル領域には追加しません。Windowsでのパスや保存先の扱いは`AGENTS.md`に記載しています。スキル内の相対パスは、リンクの見かけの場所ではなく、実体のフォルダを基準に読みます。

既存の正しいリンクは再利用します。通常フォルダの内容が共有元と完全に一致する場合は、`.skill-backups/<日時とID>/<元の相対パス>`へ退避してからリンクに切り替えます。内容が異なるフォルダや別の参照先を指すリンクは上書きせず、処理を止めます。

ジャンクションはPCごとの絶対パスを参照し、Gitには保存しません。別のPCでは設定スクリプトを実行してください。フォルダを移動した場合は、以前の場所を指すリンクを確認し、作り直す必要があります。

### 更新・スキルの追加

リモートの変更を取り込む場合は、次を実行します。サブモジュールは、このリポジトリに記録されたコミットに合わせて取得します。

```powershell
git pull --ff-only
git submodule update --init --recursive
.\setup-skills.ps1
```

自作スキルを追加する場合は、`skills/<スキル名>/SKILL.md`を実フォルダに作成し、設定スクリプトを実行します。外部スキルを追加する場合は、配布元をGitサブモジュールで取得し、`setup-skills.ps1`の`$sources`にスキル名と実体の相対パスを登録してください。`skills/<スキル名>`のリンクは`.gitignore`で除外します。

外部スキルを編集すると、対応するサブモジュール内のファイルが変わります。変更を共有するには、書き込み可能なforkなどでコミット・プッシュし、その後で親リポジトリの参照を更新してください。親リポジトリのコミットだけでは、サブモジュール内の編集内容は保存できません。

### 利用に必要なツール・設定

スキルの登録と、検索・翻訳・資料生成などの実行は別です。必要なツールは、実際に使うスキルの手順に従って準備してください。

| 対象 | 必要なツール・設定 |
| --- | --- |
| `youtube-full` | TranscriptOutのAPIキーを環境変数`TRANSCRIPTOUT_API_KEY`に設定 |
| `obsidian-cli` | 起動中のObsidianとCLI設定 |
| `defuddle`・`knap` | それぞれのCLI。`knap`はNode.js 20以降 |
| `literature-review-ml`のPDF出力 | PandocとXeLaTeX |
| MarpのPDF・PPTX出力 | Marp CLIと対応ブラウザ |
| `interactive-slide` | 数式・QRコード・画面検査に使うNode.js・Pythonライブラリ |
| 論文翻訳のファイル出力 | 出力形式に応じたPDF抽出・組版ツール |

スキルの追加だけでは、APIアカウントの作成や認証、AWSへのデプロイは実行しません。

### 登録の確認

次のコマンドで、編集用・Codex用・Claude Code用のリンク先を確認できます。

```powershell
Get-Item -Force skills/slide-story, .agents/skills/slide-story, .claude/skills/slide-story |
    Select-Object FullName, LinkType, Target

Test-Path .agents/skills/slide-story/SKILL.md
Test-Path .claude/skills/slide-story/SKILL.md
```

3か所の`Target`が同じ実体を指し、両方の`Test-Path`が`True`になれば配置を確認できます。その後、各ツールでスキルを呼び出して確認してください。一覧に出ない場合は、このプロジェクトで新しいチャットを開いてください。配置の確認だけでは、検索やPDF生成などの成功を確認したことにはなりません。

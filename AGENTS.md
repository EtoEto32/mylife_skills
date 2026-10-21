# このプロジェクトの外部スキル

外部スキルはGitサブモジュールに置き、`setup-skills.ps1`で`skills/`、`.agents/skills/`、`.claude/skills/`へジャンクションを作成する。新しい外部スキルの登録先は同スクリプトを正とする。

## Windowsでのパスと実行

- ジャンクション経由で読んだスキルの相対参照は、`setup-skills.ps1`に記載された実体のディレクトリを基準に解決する。`../`をリンクの見かけのパスから辿らない。
- Scholarlyの日本語版は`scholarly-agent-skills/skills/ja/<name>/SKILL.md`を読む。`scripts/`、`config/`、`rules/`、`docs/design/`などの配布物は`scholarly-agent-skills/`が基準。翻訳スキルは登録せず、自作の`academic-paper-ja-translator`を使う。成果物は依頼された作業先へ保存し、サブモジュール内に出力しない。
- `creating-marp-slides`の配布元の設定・テーマ・コマンドは`marp-slides/`を基準に確認する。別のプロジェクトの資料を作る場合は、その作業先の設定・テーマ・出力先を尊重する。
- `marp-slide`の`/mnt/user-data/outputs/`はこのWindows環境では使用せず、ユーザー指定の保存先、指定がなければ作業先の`outputs/`へ保存する。`references/`と`assets/`は`agent-toolkit/skills/marp-slide/`を基準に読む。
- `interactive-slide`のスクリプトは`interactive-slide/plugins/interactive-slide/skills/interactive-slide/scripts/`にある。
- `literature-review-ml`の実体は`literature-review/`。`scripts/`、`references/`、`assets/`は同フォルダを基準に読む。上流の`~/.claude/skills/`やBashの例は、このプロジェクトの実体パスとPowerShellに読み替える。日本語で依頼されたレビューは日本語で作成し、成果物は作業先へ保存する。Claude専用の`TaskCreate`は利用可能な進捗管理手段に読み替える。
- WindowsではPowerShellの構文と実在するPython/Node実行ファイルを使う。シェルの`python`がWindowsAppsの実行エイリアスだけの場合は、Codexの`load_workspace_dependencies`でPythonを探す。Bash専用のコマンドは利用可能なシェルを確認してから実行する。
- 依存関係は利用するスキルの手順に従って初回に準備する。
- `youtube-full`の実体は`youtube-skills/skills/youtube-full/`。利用には`TRANSCRIPTOUT_API_KEY`が必要。スキルの追加だけではアカウント作成・メール認証・API呼び出しを実行しない。
- `file-organizer`の実体は`awesome-codex-skills/file-organizer/`。同リポジトリのほかのスキルは登録しない。ファイル整理は実際に依頼された対象に限り、Bashの例はPowerShellに読み替える。
- Obsidianの6スキルは`obsidian-skills/skills/<name>/`を基準に参照する。`obsidian-cli`は起動中のObsidianとCLI設定、`defuddle`と`knap`はそれぞれのCLIが必要。ノートの保存先は依頼された作業先・Vaultを使う。
- `make-note`の実体は`make-note-skills/skills/make-note/`。このプロジェクトでは、言語の指定がなければ日本語でノートを書く。上流の中国語・英語の二択や`/home/brian/Note/`は使わず、指定の保存先、指定がなければ作業先の`Note/`を使う。ユーザーのテンプレートが指定されていなければ同梱の`references/note-template.md`を使い、見出しは自然な日本語にする。配布者の著者名やVaultパスをユーザーの情報として引き継がない。画像は作業先のノート用アセットフォルダに置く。

スキルの配置確認と、実際の翻訳・PDF生成の成功は別々に報告する。

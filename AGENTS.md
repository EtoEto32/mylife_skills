# このプロジェクトの外部スキル

外部スキルはGitサブモジュールに置き、`setup-skills.ps1`で`skills/`、`.agents/skills/`、`.claude/skills/`へジャンクションを作成する。新しい外部スキルの登録先は同スクリプトを正とする。

## Windowsでのパスと実行

- ジャンクション経由で読んだスキルの相対参照は、`setup-skills.ps1`に記載された実体のディレクトリを基準に解決する。`../`をリンクの見かけのパスから辿らない。
- Scholarlyの日本語版は`scholarly-agent-skills/skills/ja/<name>/SKILL.md`を読む。`scripts/`、`config/`、`rules/`、`docs/design/`などの配布物は`scholarly-agent-skills/`が基準。翻訳設定の既定値は日本語。成果物は依頼された作業先へ保存し、サブモジュール内に出力しない。
- `creating-marp-slides`の配布元の設定・テーマ・コマンドは`marp-slides/`を基準に確認する。別のプロジェクトの資料を作る場合は、その作業先の設定・テーマ・出力先を尊重する。
- `marp-slide`の`/mnt/user-data/outputs/`はこのWindows環境では使用せず、ユーザー指定の保存先、指定がなければ作業先の`outputs/`へ保存する。`references/`と`assets/`は`agent-toolkit/skills/marp-slide/`を基準に読む。
- `pdf-translate`のスクリプトは`paper-translate-agent-skill/pdf-translate/scripts/`、`zotero-translate`は`zotero-translate-skill/skills/zotero-translate/scripts/`、`interactive-slide`は`interactive-slide/plugins/interactive-slide/skills/interactive-slide/scripts/`にある。
- WindowsではPowerShellの構文と実在するPython/Node実行ファイルを使う。シェルの`python`がWindowsAppsの実行エイリアスだけの場合は、Codexの`load_workspace_dependencies`でPythonを探す。Bash専用のコマンドは利用可能なシェルを確認してから実行する。
- 依存関係は利用するスキルの手順に従って初回に準備する。Zoteroのbridge設定は実際のZotero翻訳・添付作業時に行う。

スキルの配置確認と、実際の翻訳・PDF生成・Zotero添付の成功は別々に報告する。

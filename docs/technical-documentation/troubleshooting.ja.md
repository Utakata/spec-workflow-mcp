# トラブルシューティングとFAQ

> **クイックフィックス**: 90%の問題は、まず[一般的な問題](#-common-issues)を確認することで解決します。

## 🚨 一般的な問題

### MCPサーバーが起動しない

**症状**: AIクライアントが接続エラーを表示し、サーバーが応答しない

**最も一般的な原因**:

1. **Node.jsのバージョンが違う**
   ```bash
   # バージョンを確認
   node --version
   # 18.0.0以上であるべき

   # 修正: Node.jsを更新
   # nvmを使用するか、nodejs.orgからダウンロード
   ```

2. **パスの問題**
   ```json
   // ❌ 間違い - 相対パス
   {
     "command": "npx",
     "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "./my-project"]
   }

   // ✅ 正解 - 絶対パス
   {
     "command": "npx",
     "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/full/path/to/project"]
   }
   ```

3. **NPXキャッシュの問題**
   ```bash
   # npxキャッシュをクリア
   npm cache clean --force
   npx clear-npx-cache
   ```

**クイックフィックス**:
```bash
# サーバーを手動でテスト
cd /your/project/path
npx -y @pimzino/spec-workflow-mcp@latest --help

# これが機能する場合、AIクライアントの設定を確認
```

---

### ダッシュボードが読み込まれない

**症状**: ダッシュボードのURLが404を返す、接続が拒否される

**解決策**:

1. **ダッシュボードのステータスを確認**
   ```bash
   # ダッシュボードが実行中か確認
   netstat -tulpn | grep :3456
   # またはプロセスを確認
   ps aux | grep spec-workflow
   ```

2. **ダッシュボードの手動起動**
   ```bash
   # ダッシュボードを個別に起動
   cd /your/project
   npx -y @pimzino/spec-workflow-mcp@latest --dashboard
   ```

3. **ポートの競合**
   ```bash
   # 別のポートを試す
   npx -y @pimzino/spec-workflow-mcp@latest --dashboard --port 8080
   ```

4. **セッションファイルの問題**
   ```bash
   # 古いセッションを削除
   rm -f .spec-workflow/session.json
   ```

---

### 承認システムが機能しない

**症状**: 承認が「保留中」のまま、ボタンが機能しない

**デバッグ手順**:

1. **承認ファイルを確認**
   ```bash
   ls -la .spec-workflow/approvals/
   # 承認JSONファイルが表示されるべき
   ```

2. **ブラウザコンソールのエラー**
   - ブラウザの開発者ツールを開く（F12）
   - コンソールタブでJavaScriptエラーを確認
   - ネットワークタブで失敗したリクエストを確認

3. **WebSocket接続**
   ```javascript
   // ブラウザコンソールで
   console.log('WebSocket state:', WebSocket.CONNECTING);
   // アクティブな接続が表示されるべき
   ```

4. **ブラウザキャッシュのクリア**
   - ハードリフレッシュ（Ctrl+Shift+R）
   - ダッシュボードドメインのlocalStorage/Cookieをクリア

---

### ファイル権限エラー

**症状**: "EACCES"、"Permission denied"エラー

**解決策**:

1. **ディレクトリ権限を確認**
   ```bash
   # プロジェクトの権限を確認
   ls -la /path/to/project

   # 権限を修正
   chmod -R 755 /path/to/project
   ```

2. **`.spec-workflow/`ディレクトリ**
   ```bash
   # 必要に応じて手動でディレクトリを作成
   mkdir -p .spec-workflow/specs .spec-workflow/steering .spec-workflow/approvals

   # 権限を修正
   chmod -R 755 .spec-workflow/
   ```

3. **Windows固有の問題**
   ```powershell
   # 管理者として実行
   # またはフォルダのプロパティ → セキュリティタブを確認
   ```

---

### ツールが空の結果を返す

**症状**: `spec-list`がスペックを表示しない、コンテキストツールが空を返す

**デバッグ**:

1. **ファイル構造を確認**
   ```bash
   tree .spec-workflow/
   # specs/、steering/などが表示されるべき
   ```

2. **ファイル内容を確認**
   ```bash
   # スペックファイルが存在し、内容があるか確認
   find .spec-workflow/specs -name "*.md" -exec ls -la {} \;
   ```

3. **パス解決の問題**
   ```bash
   # 絶対パスでテスト
   pwd
   # 出力をツール呼び出しで使用
   ```

## 🔧 高度なデバッグ

### MCPプロトコルのデバッグ

**デバッグログの有効化**:
```bash
# デバッグ環境変数を設定
DEBUG=spec-workflow-mcp* npm run dev

# または本番環境で
DEBUG=spec-workflow-mcp* node dist/index.js
```

**MCPメッセージの確認**:
```json
// AIクライアントのログでこれらを探す
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "spec-workflow-guide"
  }
}
```

### ダッシュボードバックエンドのデバッグ

**サーバーログ**:
```bash
# 詳細ログで起動
npm run dev -- --verbose

# Fastifyのログを確認
# WebSocket接続メッセージを探す
```

**APIテスト**:
```bash
# APIエンドポイントを直接テスト
curl http://localhost:3456/api/test
curl http://localhost:3456/api/specs
```

### ファイルシステムのデバッグ

**ファイルウォッチャーの問題**:
```bash
# chokidarが正しく監視しているか確認
# ログでファイル変更イベントを探す

# 手動でファイルを変更してテスト
echo "test" >> .spec-workflow/specs/test-spec/requirements.md
# ファイルウォッチャーがトリガーされるべき
```

**クロスプラットフォームのパスの問題**:
```javascript
// パス解決をデバッグ
const path = require('path');
console.log('Resolved:', path.resolve('/your/project'));
console.log('Platform:', process.platform);
```

## 🐛 エラーメッセージと解決策

### `Tool execution failed: ENOENT`

**意味**: ファイルまたはディレクトリが見つからない

**解決策**:
1. `.spec-workflow/`ディレクトリが存在するか確認
2. スペック名のスペルを確認
3. ツール呼び出しで絶対パスを使用

### `WORKFLOW VIOLATION: Cannot create design.md`

**意味**: ドキュメントを順序外で作成しようとしている

**解決策**: ワークフローの順序に従う:
1. 最初にrequirements.mdを作成
2. 承認を得る
3. 次にdesign.mdを作成

### `Approval not found or still pending`

**意味**: 存在しないか、まだ承認されていない承認を削除しようとしている

**解決策**:
1. 最初に承認ステータスを確認
2. 削除前に承認が承認済みであることを待つ
3. クリーンアップが成功するまで次に進まない

### `Port X is already in use`

**意味**: ダッシュボードのポートが使用中

**解決策**:
```bash
# ポートを使用しているプロセスを強制終了
lsof -ti:3456 | xargs kill -9

# または別のポートを使用
--port 8080
```

### `Session file corrupted`

**意味**: session.jsonのJSONが無効

**解決策**:
```bash
# 削除して再作成
rm .spec-workflow/session.json
# MCPサーバーを再起動
```

## ❓ よくある質問

### Q: MCP設定で相対パスを使用できますか？

**A**: 一部のMCPクライアントは相対パスを正しく解決できない場合があります。常に絶対パスを使用してください：
```json
{
  "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/full/path/to/project"]
}
```

### Q: すべてをリセットして最初から始めるには？

**A**: ワークフローディレクトリを削除します：
```bash
rm -rf .spec-workflow/
# MCPサーバーが自動的に再作成します
```

### Q: 複数のAIクライアントが同じプロジェクトを使用できますか？

**A**: はい、ただしプロジェクトごとにダッシュボードは1つです。複数のMCPクライアントが接続できますが、同じ承認ワークフローを共有します。

### Q: なぜ承認リクエストにはダッシュボード/VSCodeの承認が必要なのですか？

**A**: これはAIの暴走を防ぐためです。システムは品質と制御を維持するために、ドキュメントの承認に人間の監視を必要とします。

### Q: テンプレートをカスタマイズできますか？

**A**: ツールを介して直接はできません。テンプレートはサーバーに組み込まれています。ただし、作成後に生成されたドキュメントを変更することはできます。

### Q: 仕様書をバックアップするには？

**A**: ワークフロー全体は`.spec-workflow/`にあります：
```bash
# バックアップを作成
tar -czf spec-backup.tar.gz .spec-workflow/

# バックアップを復元
tar -xzf spec-backup.tar.gz
```

### Q: ファイルを直接変更するとどうなりますか？

**A**: ファイルウォッチャーが変更を検出し、ダッシュボードを自動的に更新します。ただし、直接の変更はワークフローの状態を壊す可能性があります。

### Q: MCPサーバーなしでダッシュボードを実行できますか？

**A**: はい、ダッシュボードのみモードを使用します：
```bash
npx -y @pimzino/spec-workflow-mcp@latest --dashboard
```

### Q: 最新バージョンに更新するには？

**A**: NPXは`@latest`タグで自動的に最新版を使用します。明示的な更新の場合：
```bash
npm cache clean --force
npx -y @pimzino/spec-workflow-mcp@latest --help
```

## 🔧 技術的なデバッグ

### MCPプロトコルのデバッグ

**MCP通信の理解**:
```json
// AIクライアントはこのようなツール呼び出しを送信します：
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "spec-workflow-guide",
    "arguments": {}
  }
}

// MCPサーバーは以下で応答します：
{
  "jsonrpc": "2.0",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "完全なワークフローガイドのコンテンツ..."
      }
    ]
  }
}
```

**デバッグ環境変数**:
```bash
# MCPサーバーのデバッグログを有効化
DEBUG=spec-workflow-mcp* npm run dev

# ダッシュボードのデバッグログを有効化
DEBUG=dashboard:* npm run dev:dashboard

# 完全なデバッグログ
DEBUG=* npm run dev
```

### メモリとパフォーマンスの問題

**メモリ使用量の監視**:
```bash
# Node.jsプロセスのメモリ使用量を確認
ps aux | grep "spec-workflow-mcp"

# メモリ増加を監視
watch -n 5 "ps -p $(pgrep -f spec-workflow) -o pid,ppid,cmd,%mem,%cpu"

# ファイルディスクリプタの使用量を確認
lsof -p $(pgrep -f spec-workflow) | wc -l
```

**パフォーマンスのボトルネック**:
```typescript
// 一般的なパフォーマンスの問題と解決策
interface PerformanceIssues {
  slowContextLoading: {
    cause: "大きなマークダウンファイル (>200KB)";
    solution: "大きなドキュメントを分割し、テンプレートを効率的に使用する";
  };

  dashboardLag: {
    cause: "多すぎるファイルウォッチャー、大きなプロジェクト";
    solution: ".spec-workflow/ディレクトリのサイズを制限し、古いファイルをクリーンアップする";
  };

  memoryLeaks: {
    cause: "キャッシュされないファイル読み込み、保持されたコンテキスト";
    solution: "MCPサーバーを再起動し、キャッシュ設定を確認する";
  };
}
```

### テンプレートとコンテキストの問題

**テンプレート読み込みのデバッグ**:
```bash
# テンプレートファイルが存在し、読み取り可能か確認
ls -la src/markdown/templates/
find src/markdown/templates -name "*.md" -exec wc -c {} \;

# テンプレートコンテンツが破損していないか確認
for template in src/markdown/templates/*.md; do
  echo "=== $template ==="
  head -5 "$template"
done
```

**コンテキスト読み込みの失敗**:
```typescript
// コンテキスト読み込みの問題をデバッグ
// コードベースでこれらのファイルパスを確認：

1. "PathUtils.getSpecPath()が正しいパスを返すか確認";
2. ".spec-workflow/ディレクトリのファイル権限を確認";
3. "スペックディレクトリ構造が期待通りか確認";
4. "マークダウンファイルが破損していないか、空でないか検証";
```

## 🔍 診断コマンド

### ヘルスチェック スクリプト
```bash
#!/bin/bash
echo "=== Spec Workflow MCP 診断 ==="

echo "1. Node.js バージョン:"
node --version

echo -e "\n2. プロジェクト構造:"
if [ -d ".spec-workflow" ]; then
    echo "✅ .spec-workflow/ ディレクトリが存在します"
    tree .spec-workflow/ || ls -la .spec-workflow/
else
    echo "❌ .spec-workflow/ ディレクトリがありません"
fi

echo -e "\n3. NPX キャッシュ:"
npx -y @pimzino/spec-workflow-mcp@latest --help > /dev/null && echo "✅ MCP サーバーが読み込まれます" || echo "❌ MCP サーバーが失敗します"

echo -e "\n4. 権限:"
ls -la .spec-workflow/ 2>/dev/null || echo "❌ .spec-workflow/ を読み取れません"

echo -e "\n5. ポートの可用性:"
netstat -tulpn | grep :3456 > /dev/null && echo "❌ ポート 3456 は使用中です" || echo "✅ ポート 3456 は利用可能です"

echo -e "\n=== 診断終了 ==="
```

### ログ収集
```bash
# 関連するすべてのログを収集
mkdir -p debug-logs
cp .spec-workflow/session.json debug-logs/ 2>/dev/null
find .spec-workflow/approvals -name "*.json" -exec cp {} debug-logs/ \; 2>/dev/null
echo "ログを debug-logs/ に収集しました"
```

## 🆘 ヘルプの入手

### 問題を報告する前に

1. **上記の診断スクリプトを試す**
2. **このトラブルシューティングガイドを確認する**
3. **既存のGitHub Issuesを検索する**
4. **最小限の再現ケースでテストする**

### バグレポートの作成

この情報を含めてください：
```
**環境:**
- OS: [Windows/macOS/Linux + バージョン]
- Node.js: [node --version のバージョン]
- NPM: [npm --version のバージョン]
- MCPクライアント: [Claude Desktop/Cursor/など]

**設定:**
[あなたのMCPサーバー設定]

**再現手順:**
1. [最初のステップ]
2. [2番目のステップ]
3. [...など]

**期待される動作:**
[期待される動作]

**実際の動作:**
[実際に起こったこと]

**エラーメッセージ:**
[完全なエラーメッセージ/スタックトレース]

**診断出力:**
[上記の診断スクリプトの出力]
```

### コミュニティサポート

- **GitHub Issues**: [リポジトリIssues](https://github.com/Pimzino/spec-workflow-mcp/issues)
- **ドキュメント**: [技術ドキュメント](README.md)
- **例**: [APIリファレンス](api-reference.md)

---

**最終更新日**: 2024年12月 | **次へ**: [貢献ガイドライン →](contributing.md)

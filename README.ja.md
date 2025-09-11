# Spec Workflow MCP

[![npm version](https://img.shields.io/npm/v/@pimzino/spec-workflow-mcp)](https://www.npmjs.com/package/@pimzino/spec-workflow-mcp)
[![VSCode Extension](https://badgen.net/vs-marketplace/v/Pimzino.spec-workflow-mcp)](https://marketplace.visualstudio.com/items?itemName=Pimzino.spec-workflow-mcp)

AI支援ソフトウェア開発のための構造化されたスペック駆動開発ワークフローツールを提供するModel Context Protocol (MCP)サーバーです。リアルタイムのWebダッシュボードとVSCode拡張機能を備え、開発環境で直接プロジェクトの進捗を監視・管理できます。

<a href="https://glama.ai/mcp/servers/@Pimzino/spec-workflow-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@Pimzino/spec-workflow-mcp/badge" alt="Spec Workflow MCP server" />
</a>

## 📺 ショーケース

### 🔄 承認システムの動作
<a href="https://www.youtube.com/watch?v=C-uEa3mfxd0" target="_blank">
  <img src="https://img.youtube.com/vi/C-uEa3mfxd0/maxresdefault.jpg" alt="承認システムデモ" width="600">
</a>

*承認システムの動作をご覧ください：ドキュメントの作成、ダッシュボードを介した承認依頼、フィードバックの提供、修正の追跡。*

### 📊 ダッシュボードとスペック管理
<a href="https://www.youtube.com/watch?v=g9qfvjLUWf8" target="_blank">
  <img src="https://img.youtube.com/vi/g9qfvjLUWf8/maxresdefault.jpg" alt="ダッシュボードデモ" width="600">
</a>

*リアルタイムダッシュボードを体験：スペックの表示、進捗の追跡、ドキュメントのナビゲーション、開発ワークフローの監視。*

---

## ☕ このプロジェクトを支援する

<a href="https://buymeacoffee.com/Pimzino" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

---

## 特徴

- **構造化された開発ワークフロー** - 順次的なスペック作成（要件 → 設計 → タスク）
- **リアルタイムWebダッシュボード** - スペック、タスク、進捗をライブアップデートで監視
- **VSCode拡張機能** - VSCodeで作業する開発者向けの統合サイドバーダッシュボード
- **ドキュメント管理** - ダッシュボードまたは拡張機能からすべてのスペックドキュメントを表示・管理
- **アーカイブシステム** - アクティブなプロジェクトを整理するための完了したスペックの整理
- **タスク進捗追跡** - 視覚的な進捗バーと詳細なタスクステータス
- **承認ワークフロー** - 承認、拒否、修正依頼を含む完全な承認プロセス
- **ステアリングドキュメント** - プロジェクトのビジョン、技術的決定、構造ガイダンス
- **サウンド通知** - 承認とタスク完了のための設定可能な音声アラート
- **バグワークフロー** - 完全なバグ報告と解決追跡
- **テンプレートシステム** - すべてのドキュメントタイプに対応した構築済みテンプレート
- **クロスプラットフォーム** - Windows、macOS、Linuxで動作

## クイックスタート

1. **AIツール設定に追加**（以下のMCPクライアント設定を参照）：
   ```json
   {
     "mcpServers": {
       "spec-workflow": {
         "command": "npx",
         "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project"]
       }
     }
   }
   ```

   **ダッシュボード自動起動付き**（MCPサーバーでダッシュボードを自動的に開く）：
   ```json
   {
     "mcpServers": {
       "spec-workflow": {
         "command": "npx",
         "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project", "--AutoStartDashboard"]
       }
     }
   }
   ```

   **カスタムポート付き**:
   ```json
   {
     "mcpServers": {
       "spec-workflow": {
         "command": "npx",
         "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project", "--AutoStartDashboard", "--port", "3456"]
       }
     }
   }
   ```

   **注意:** プロジェクトへのパスなしでも使用できますが、一部のMCPクライアントは現在のディレクトリからサーバーを起動しない場合があります。

2. **インターフェースを選択**:

   ### オプションA: Webダッシュボード（**CLIユーザー必須**）
   ```bash
   # ダッシュボードのみモード（エフェメラルポートを使用）
   npx -y @pimzino/spec-workflow-mcp@latest /path/to/your/project --dashboard

   # カスタムポート付きダッシュボードのみ
   npx -y @pimzino/spec-workflow-mcp@latest /path/to/your/project --dashboard --port 3000

   # 利用可能なすべてのオプションを表示
   npx -y @pimzino/spec-workflow-mcp@latest --help
   ```

   **コマンドラインオプション:**
   - `--help` - 包括的な使用情報と例を表示
   - `--dashboard` - ダッシュボードのみモードを実行（MCPサーバーなし）
   - `--AutoStartDashboard` - MCPサーバーでダッシュボードを自動起動
   - `--port <number>` - ダッシュボードポートを指定（1024-65535）。`--dashboard`と`--AutoStartDashboard`の両方で動作

   ### オプションB: VSCode拡張機能（**VSCodeユーザー推奨**）

   VSCodeマーケットプレイスから**[Spec Workflow MCP拡張機能](https://marketplace.visualstudio.com/items?itemName=Pimzino.spec-workflow-mcp)**をインストールします：

   1. `.spec-workflow/`を含むプロジェクトディレクトリでVSCodeを開きます
   2. 拡張機能はVSCode内でダッシュボード機能を自動的に提供します
   3. アクティビティバーのスペックワークフローアイコンからアクセス
   4. **別のダッシュボードは不要** - すべてがIDE内で実行されます

   **拡張機能の特長:**
   - リアルタイムアップデート付きの統合サイドバーダッシュボード
   - 完了したスペックを整理するためのアーカイブシステム
   - VSCodeネイティブダイアログによる完全な承認ワークフロー
   - 承認と完了のためのサウンド通知
   - 承認とコメントのためのエディタコンテキストメニューアクション

   **重要:** CLIユーザーにはWebダッシュボードが必須です。VSCodeユーザーには、拡張機能が別のWebダッシュボードの必要性を置き換え、IDEで直接同じ機能を提供します。

## 使用方法

会話の中で`spec-workflow`またはMCPサーバーに付けた名前を言及するだけで、AIが自動的に完全なワークフローを処理するか、以下のプロンプト例を使用できます：

### スペックの作成
- **"ユーザー認証のスペックを作成"** - その機能の完全なスペックワークフローを作成
- **"payment-systemというスペックを作成"** - 要件 → 設計 → タスクの完全な構築
- **"@prdのスペックを作成"** - 既存のPRDから完全なスペックワークフローを作成
- **"ショッピングカートのスペックを作成 - カートへの追加、数量更新、チェックアウト統合を含む"** - 詳細な機能スペック

### 情報の取得
- **"スペックを一覧表示"** - すべてのスペックとその現在のステータスを表示
- **"ユーザー認証の進捗を表示"** - 詳細な進捗情報を表示

### 実装
- **"スペックuser-authのタスク1.2を実行"** - スペックから特定のタスクを実行
- **ダッシュボードからプロンプトをコピー** - ダッシュボードのタスクリストの「プロンプトをコピー」ボタンを使用

エージェントは承認ワークフロー、タスク管理を自動的に処理し、各フェーズをガイドします。

## MCPクライアント設定

<details>
<summary><strong>Augment Code</strong></summary>

Augment設定で構成：
```json
{
  "mcpServers": {
    "spec-workflow": {
      "command": "npx",
      "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project"]
    }
  }
}
```
</details>

<details>
<summary><strong>Claude Code CLI</strong></summary>

MCP設定に追加：
```bash
claude mcp add spec-workflow npx @pimzino/spec-workflow-mcp@latest /path/to/your/project
```
<strong> 注意: </strong> Windowsでは、コマンドを`cmd.exe /c "npx -y @pimzino/spec-workflow-mcp@latest /path/to/your/project"`でラップする必要がある場合があります。
</details>

<details>
<summary><strong>Claude Desktop</strong></summary>

`claude_desktop_config.json`に追加：
```json
{
  "mcpServers": {
    "spec-workflow": {
      "command": "npx",
      "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project"]
    }
  }
}
```

またはダッシュボード自動起動付き：
```json
{
  "mcpServers": {
    "spec-workflow": {
      "command": "npx",
      "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project", "--AutoStartDashboard"]
    }
  }
}
```
</details>

<details>
<summary><strong>Cline/Claude Dev</strong></summary>

MCPサーバー設定に追加：
```json
{
  "mcpServers": {
    "spec-workflow": {
      "command": "npx",
      "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project"]
    }
  }
}
```
</details>

<details>
<summary><strong>Continue IDE Extension</strong></summary>

Continue設定に追加：
```json
{
  "mcpServers": {
    "spec-workflow": {
      "command": "npx",
      "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project"]
    }
  }
}
```
</details>

<details>
<summary><strong>Cursor IDE</strong></summary>

Cursor設定（`settings.json`）に追加：
```json
{
  "mcpServers": {
    "spec-workflow": {
      "command": "npx",
      "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project"]
    }
  }
}
```
</details>

<details>
<summary><strong>OpenCode</strong></summary>

`opencode.json`設定ファイル（グローバル`~/.config/opencode/opencode.json`またはプロジェクト固有）に追加：
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "spec-workflow": {
      "type": "local",
      "command": ["npx", "-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/your/project"],
      "enabled": true
    }
  }
}
```
</details>

> **注意:** `/path/to/your/project`を、スペックワークフローを操作したい実際のプロジェクトディレクトリのパスに置き換えてください。

## 利用可能なツール

### ワークフローガイド
- `spec-workflow-guide` - スペック駆動ワークフロープロセスの完全なガイド
- `steering-guide` - プロジェクトステアリングドキュメント作成のためのガイド

### スペック管理
- `create-spec-doc` - スペックドキュメントの作成/更新（要件、設計、タスク）
- `spec-list` - ステータス情報付きのすべてのスペックを一覧表示
- `spec-status` - 特定のスペックの詳細なステータスを取得
- `manage-tasks` - スペック実装のための包括的なタスク管理

### コンテキストとテンプレート
- `get-template-context` - すべてのドキュメントタイプのマークダウンテンプレートを取得
- `get-steering-context` - プロジェクトステアリングのコンテキストとガイダンスを取得
- `get-spec-context` - 特定のスペックのコンテキストを取得

### ステアリングドキュメント
- `create-steering-doc` - プロジェクトステアリングドキュメントの作成（製品、技術、構造）

### 承認システム
- `request-approval` - ドキュメントのユーザー承認を依頼
- `get-approval-status` - 承認ステータスを確認
- `delete-approval` - 完了した承認をクリーンアップ

## ユーザーインターフェース

### Webダッシュボード

WebダッシュボードはCLIユーザー向けの別サービスです。各プロジェクトには、エフェメラルポートで実行される専用のダッシュボードがあります。ダッシュボードは以下を提供します：

- **ライブプロジェクト概要** - スペックと進捗のリアルタイム更新
- **ドキュメントビューア** - 要件、設計、タスクドキュメントの閲覧
- **タスク進捗追跡** - 視覚的な進捗バーとタスクステータス
- **ステアリングドキュメント** - プロジェクトガイダンスへのクイックアクセス
- **ダークモード** - 読みやすさ向上のための自動有効化

#### ダッシュボードの機能
- **スペックカード** - ステータスインジケーター付きの各スペックの概要
- **ドキュメントナビゲーション** - 要件、設計、タスク間の切り替え
- **タスク管理** - タスクの進捗表示と実装プロンプトのコピー
- **リアルタイム更新** - ライブプロジェクトステータスのためのWebSocket接続

### VSCode拡張機能

VSCode拡張機能は、IDE内で直接すべてのダッシュボード機能を提供します：

- **サイドバー統合** - アクティビティバーからすべてにアクセス
- **アーカイブ管理** - アクティブとアーカイブされたスペックの切り替え
- **ネイティブダイアログ** - すべてのアクションに対するVSCodeネイティブ確認ダイアログ
- **エディタ統合** - 承認とコメントのためのコンテキストメニューアクション
- **サウンド通知** - 設定可能な音声アラート
- **外部依存なし** - VSCode内で完全に動作

#### VSCodeユーザー向けの拡張機能の利点
- **単一環境** - ブラウザとIDEを切り替える必要なし
- **ネイティブ体験** - VSCodeのネイティブUIコンポーネントを使用
- **より良い統合** - コンテキストメニューアクションとエディタ統合
- **簡素化された設定** - 別のダッシュボードサービスは不要

## ワークフロープロセス

### 1. プロジェクト設定（推奨）
```
steering-guide → create-steering-doc (product, tech, structure)
```
プロジェクト開発をガイドするための基礎となるドキュメントを作成します。

### 2. 機能開発
```
spec-workflow-guide → create-spec-doc → [review] → implementation
```
順次プロセス：要件 → 設計 → タスク → 実装

### 3. 実装サポート
- 詳細な実装コンテキストのために`get-spec-context`を使用
- タスク完了を追跡するために`manage-tasks`を使用
- Webダッシュボードを介して進捗を監視

## ファイル構造

```
your-project/
  .spec-workflow/
    steering/
      product.md        # 製品ビジョンと目標
      tech.md          # 技術的決定
      structure.md     # プロジェクト構造ガイド
    specs/
      {spec-name}/
        requirements.md # 何を構築する必要があるか
        design.md      # どのように構築されるか
        tasks.md       # 実装の分解
    approval/
      {spec-name}/
        {document-id}.json # 承認ステータスの追跡
```

## 開発

```bash
# 依存関係のインストール
npm install

# プロジェクトのビルド
npm run build

# 開発モードでの実行（自動リロード付き）
npm run dev

# 本番サーバーの起動
npm start

# ビルド成果物のクリーンアップ
npm run clean
```

## トラブルシューティング

### 一般的な問題

1. **ダッシュボードが起動しない**
   - ダッシュボードサービスを開始する際に`--dashboard`フラグを使用していることを確認してください
   - ダッシュボードはMCPサーバーとは別に開始する必要があります
   - ダッシュボードのURLとエラーメッセージについてコンソール出力を確認してください
   - `--port`を使用している場合、ポート番号が有効（1024-65535）で、他のアプリケーションで使用されていないことを確認してください

2. **承認が機能しない**
   - ダッシュボードがMCPサーバーと並行して実行されていることを確認してください
   - ドキュメントの承認とタスクの追跡にはダッシュボードが必要です
   - 両方のサービスが同じプロジェクトディレクトリを指していることを確認してください

3. **MCPサーバーが接続しない**
   - 設定のファイルパスが正しいことを確認してください
   - プロジェクトが`npm run build`でビルドされていることを確認してください
   - Node.jsがシステムPATHで利用可能であることを確認してください

4. **ポートの競合**
   - 「ポートは既に使用されています」というエラーが表示された場合は、`--port <different-number>`で別のポートを試してください
   - `netstat -an | find ":3000"`（Windows）または`lsof -i :3000`（macOS/Linux）を使用して、ポートを使用しているものを確認してください
   - `--port`パラメータを省略すると、利用可能なエフェメラルポートが自動的に使用されます

5. **ダッシュボードが更新されない**
   - ダッシュボードはリアルタイム更新のためにWebSocketを使用します
   - 接続が失われた場合はブラウザをリフレッシュしてください
   - JavaScriptエラーについてコンソールを確認してください

### ヘルプの入手

- 既知の問題については[Issues](../../issues)ページを確認してください
- 提供されたテンプレートを使用して新しいIssueを作成してください
- ステップバイステップの手順については、ツール内のワークフローガイドを使用してください

## ライセンス

GPL-3.0

## スター履歴

<a href="https://www.star-history.com/#Pimzino/spec-workflow-mcp&Timeline">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Pimzino/spec-workflow-mcp&type=Timeline&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Pimzino/spec-workflow-mcp&type=Timeline" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Pimzino/spec-workflow-mcp&type=Timeline" />
 </picture>
</a>

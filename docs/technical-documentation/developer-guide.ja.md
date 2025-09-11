# 開発者ワークフローガイド

> **クイックスタート**: クローン → `npm install` → `npm run dev` → ビルド開始！

## 🚀 開発セットアップ

### 前提条件
```bash
# 必須
node >= 18.0.0
npm >= 9.0.0

# オプション（VS Code拡張機能用）
VS Code >= 1.74.0
```

### 初期セットアップ
```bash
# リポジトリをクローン
git clone <repository-url>
cd spec-workflow-mcp

# 依存関係をインストール
npm install

# VS Code拡張機能の依存関係をインストール（オプション）
cd vscode-extension
npm install
cd ..

# セットアップを検証するためにすべてをビルド
npm run build
```

### 開発コマンド
```bash
# 開発モードでMCPサーバーを起動
npm run dev

# 開発モードでダッシュボードを起動
npm run dev:dashboard

# 本番用にビルド
npm run build

# ビルド成果物をクリーンアップ
npm run clean

# テストを実行（利用可能な場合）
npm test
```

## 🛠️ 開発ワークフロー

### 新しいMCPツールの追加

#### 1. ツール定義の作成
```bash
# 新しいツールファイルを作成
touch src/tools/my-new-tool.ts
```

```typescript
// src/tools/my-new-tool.ts
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';

export const myNewToolTool: Tool = {
  name: 'my-new-tool',
  description: `このツールが何をするかの簡単な説明。

# 手順
このツールをいつ、どのように使用するかの明確な手順。`,
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: {
        type: 'string',
        description: 'プロジェクトルートへの絶対パス'
      },
      // 他のパラメータを追加
      param1: {
        type: 'string',
        description: 'パラメータの説明'
      }
    },
    required: ['projectPath']
  }
};

export async function myNewToolHandler(
  args: any,
  context: ToolContext
): Promise<ToolResponse> {
  const { projectPath, param1 } = args;

  try {
    // ここに実装

    return {
      success: true,
      message: 'ツールが正常に実行されました',
      data: {
        // レスポンスデータ
      },
      nextSteps: [
        'ユーザーが次に行うべきこと',
        '追加のガイダンス'
      ]
    };
  } catch (error: any) {
    return {
      success: false,
      message: `ツールの失敗: ${error.message}`,
      nextSteps: [
        '入力パラメータを確認してください',
        'ファイル権限を確認してください'
      ]
    };
  }
}
```

#### 2. ツールの登録
```typescript
// src/tools/index.ts
import { myNewToolTool, myNewToolHandler } from './my-new-tool.js';

export function registerTools(): Tool[] {
  return [
    // ... 既存のツール
    myNewToolTool
  ];
}

export async function handleToolCall(name: string, args: any, context: ToolContext): Promise<MCPToolResponse> {
  switch (name) {
    // ... 既存のケース
    case 'my-new-tool':
      response = await myNewToolHandler(args, context);
      break;
  }
}
```

#### 3. ツールのテスト
```bash
# 開発サーバーを起動
npm run dev

# AIクライアントまたはダッシュボードでテスト
```

#### 4. ドキュメントの追加
```typescript
// api-reference.mdをツールのドキュメントで更新
```

### ダッシュボードの変更

#### フロントエンド開発
```bash
# ダッシュボード開発サーバーを起動
npm run dev:dashboard

# http://localhost:5173 で開く
# 迅速な開発のためのホットリロードが有効
```

#### 新しいページの追加
```typescript
// src/dashboard_frontend/src/modules/pages/MyNewPage.tsx
import React from 'react';

export default function MyNewPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">マイニューページ</h1>
      {/* ページコンテンツ */}
    </div>
  );
}
```

```typescript
// src/dashboard_frontend/src/modules/app/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MyNewPage from '../pages/MyNewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/my-page" element={<MyNewPage />} />
        {/* 他のルート */}
      </Routes>
    </Router>
  );
}
```

#### バックエンドAPIエンドポイントの追加
```typescript
// src/dashboard/server.ts
export class DashboardServer {
  private async setupRoutes() {
    // 新しいエンドポイントを追加
    this.app.get('/api/my-endpoint', async (request, reply) => {
      try {
        const data = await this.getMyData();
        reply.send({ success: true, data });
      } catch (error) {
        reply.status(500).send({ success: false, error: error.message });
      }
    });
  }

  private async getMyData() {
    // 実装
  }
}
```

### VS Code拡張機能の操作

#### 開発セットアップ
```bash
cd vscode-extension
npm install

# VS Codeで開く
code .

# F5キーを押して拡張機能開発ホストを起動
```

#### 拡張機能の構造
```
vscode-extension/
├── src/
│   ├── extension.ts           # メイン拡張機能エントリ
│   ├── extension/
│   │   ├── providers/         # ビュープロバイダー
│   │   ├── services/          # ビジネスロジック
│   │   └── utils/            # ヘルパー関数
│   └── webview/              # Webviewコンポーネント
├── package.json              # 拡張機能マニフェスト
└── README.md                # 拡張機能ドキュメント
```

#### 新しいコマンドの追加
```typescript
// src/extension.ts
export function activate(context: vscode.ExtensionContext) {
  const myCommand = vscode.commands.registerCommand(
    'spec-workflow.myCommand',
    async () => {
      // コマンド実装
      vscode.window.showInformationMessage('マイコマンドが実行されました！');
    }
  );

  context.subscriptions.push(myCommand);
}
```

```json
// package.json
{
  "contributes": {
    "commands": [
      {
        "command": "spec-workflow.myCommand",
        "title": "マイコマンド",
        "category": "Spec Workflow"
      }
    ]
  }
}
```

## 🧪 テスト戦略

### ユニットテスト（将来）
```bash
# テスト構造（実装予定）
src/
├── __tests__/
│   ├── tools/
│   ├── core/
│   └── dashboard/
```

### 統合テスト
```bash
# 手動テストワークフロー
1. MCPサーバーを起動: npm run dev
2. AIクライアントを接続
3. ツールワークフローをテスト
4. ダッシュボードの更新を確認
```

### ダッシュボードテスト
```bash
# 開発モードでダッシュボードを起動
npm run dev:dashboard

# テストシナリオ
1. 仕様書を作成
2. 承認ワークフロー
3. リアルタイム更新
4. ファイル監視
```

## 📁 プロジェクト構造

### コアMCPサーバー
```
src/
├── core/                     # コアビジネスロジック
│   ├── archive-service.ts    # スペックのアーカイブ
│   ├── parser.ts            # スペック解析
│   ├── path-utils.ts        # クロスプラットフォームパス
│   ├── session-manager.ts   # セッショントラッキング
│   └── task-parser.ts       # タスク管理
├── tools/                   # MCPツール実装
│   ├── index.ts            # ツールレジストリ
│   ├── spec-*.ts           # スペック管理ツール
│   ├── create-*.ts         # ドキュメント作成
│   ├── get-*.ts            # コンテキスト読み込み
│   ├── manage-*.ts         # ステータス管理
│   └── *-approval.ts       # 承認ワークフロー
├── dashboard/              # ダッシュボードバックエンド
│   ├── server.ts          # Fastifyサーバー
│   ├── approval-storage.ts # 承認の永続化
│   ├── parser.ts          # ダッシュボード固有の解析
│   ├── watcher.ts         # ファイルシステム監視
│   └── utils.ts           # ダッシュボードユーティリティ
├── markdown/              # テンプレートシステム
│   └── templates/         # ドキュメントテンプレート
├── server.ts             # メインMCPサーバー
├── index.ts              # CLIエントリポイント
└── types.ts              # TypeScript定義
```

### ダッシュボードフロントエンド
```
src/dashboard_frontend/src/
├── modules/
│   ├── api/              # API通信
│   ├── app/              # メインアプリコンポーネント
│   ├── approvals/        # 承認UIコンポーネント
│   ├── editor/           # マークダウン編集
│   ├── markdown/         # マークダウンレンダリング
│   ├── modals/           # モーダルダイアログ
│   ├── notifications/    # トースト通知
│   ├── pages/            # メインページコンポーネント
│   ├── theme/            # スタイリングとテーマ
│   └── ws/               # WebSocket統合
├── main.tsx              # Reactエントリポイント
└── App.tsx               # ルートコンポーネント
```

## 🔧 開発ベストプラクティス

### ツール開発ガイドライン

#### 1. 入力検証
```typescript
// 常に入力を検証する
export async function myToolHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  const { projectPath, requiredParam } = args;

  if (!projectPath) {
    return {
      success: false,
      message: 'projectPathは必須です',
      nextSteps: ['プロジェクトルートへの絶対パスを提供してください']
    };
  }

  if (!requiredParam) {
    return {
      success: false,
      message: 'requiredParamは必須です',
      nextSteps: ['必須パラメータを提供してください']
    };
  }

  // 実装を続ける
}
```

#### 2. エラーハンドリング
```typescript
try {
  // ツール実装
} catch (error: any) {
  return {
    success: false,
    message: `操作に失敗しました: ${error.message}`,
    nextSteps: [
      '入力パラメータを確認してください',
      'ファイル権限を確認してください',
      '問題が解決しない場合はサポートに連絡してください'
    ]
  };
}
```

#### 3. 一貫したレスポンスフォーマット
```typescript
interface ToolResponse {
  success: boolean;
  message: string;           // 人間が読めるステータス
  data?: any;               // レスポンスデータ（オプション）
  nextSteps?: string[];     // 次に行うべきこと（オプション）
  projectContext?: {        // プロジェクトコンテキスト（オプション）
    projectPath: string;
    workflowRoot: string;
    dashboardUrl?: string;
  };
}
```

#### 4. パスハンドリング
```typescript
import { PathUtils } from '../core/path-utils.js';

// クロスプラットフォーム互換性のために常にPathUtilsを使用
const specPath = PathUtils.getSpecPath(projectPath, specName);
const relativePath = PathUtils.toUnixPath(filePath);
```

### ダッシュボード開発

#### 1. 状態管理
```typescript
// ローカル状態にはReactフックを使用
const [specs, setSpecs] = useState<SpecData[]>([]);

// リアルタイム更新にはWebSocketを使用
useEffect(() => {
  if (wsMessage?.type === 'specs-updated') {
    setSpecs(wsMessage.data);
  }
}, [wsMessage]);
```

#### 2. API統合
```typescript
// src/dashboard_frontend/src/modules/api/api.tsx
export const api = {
  async getSpecs(): Promise<SpecData[]> {
    const response = await fetch('/api/specs');
    return response.json();
  },

  async updateSpec(specName: string, data: Partial<SpecData>): Promise<void> {
    await fetch(`/api/specs/${specName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};
```

#### 3. コンポーネント構造
```typescript
// TypeScript付きの関数コンポーネント
interface MyComponentProps {
  specs: SpecData[];
  onSpecUpdate: (spec: SpecData) => void;
}

export default function MyComponent({ specs, onSpecUpdate }: MyComponentProps) {
  return (
    <div className="p-4">
      {specs.map(spec => (
        <div key={spec.name} className="mb-2">
          {spec.name}
        </div>
      ))}
    </div>
  );
}
```

## 🐛 デバッグ

### MCPサーバーのデバッグ
```bash
# デバッグログを有効化
DEBUG=spec-workflow-mcp npm run dev

# MCPプロトコルメッセージを確認
# MCPクライアントのデバッグモードを使用
```

### ダッシュボードのデバッグ
```bash
# ブラウザ開発ツール
# ネットワークタブでAPI呼び出しを確認
# コンソールタブでJavaScriptエラーを確認
# ネットワークタブでWebSocket接続を確認
```

### ファイルシステムの問題
```bash
# ファイル権限を確認
ls -la .spec-workflow/

# ディレクトリ構造を確認
tree .spec-workflow/

# ファイル変更を監視
# ファイルウォッチャーのデバッグログを使用
```

## 📦 ビルドとデプロイ

### 本番用ビルド
```bash
# 以前のビルドをクリーンアップ
npm run clean

# すべてをビルド
npm run build

# ビルド出力を確認
ls -la dist/
```

### NPMへの公開
```bash
# package.jsonのバージョンを更新
npm version patch|minor|major

# ビルドして公開
npm run build
npm publish
```

### VS Code拡張機能の公開
```bash
cd vscode-extension

# VSCEをインストール
npm install -g @vscode/vsce

# 拡張機能をパッケージ化
vsce package

# マーケットプレイスに公開
vsce publish
```

---

**次へ**: [コンテキスト管理 →](context-management.md)

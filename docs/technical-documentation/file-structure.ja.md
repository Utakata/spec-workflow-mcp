# ファイル構造と構成

> **クイックリファレンス**: [ディレクトリレイアウト](#-directory-layout) | [ファイル命名規則](#-file-naming) | [パスユーティリティ](#-path-utilities)

## 📁 ディレクトリレイアウト

### プロジェクトルート構造
```
project-root/
├── .spec-workflow/                    # すべてのMCPワークフローデータ
│   ├── specs/                         # 仕様書ドキュメント
│   │   └── feature-name/              # 個々の仕様
│   │       ├── requirements.md        # フェーズ1: 要件
│   │       ├── design.md             # フェーズ2: 設計
│   │       └── tasks.md              # フェーズ3: タスク
│   ├── steering/                      # プロジェクトガイダンスドキュメント
│   │   ├── product.md                # 製品ビジョンと戦略
│   │   ├── tech.md                   # 技術標準
│   │   └── structure.md              # コード構成
│   ├── approvals/                     # 承認ワークフローデータ
│   │   └── spec-name/                # スペックごとの承認
│   │       └── approval-id.json      # 個々の承認データ
│   ├── archive/                       # 完了/アーカイブ済みスペック
│   │   └── specs/                    # アーカイブ済み仕様書ドキュメント
│   └── session.json                  # アクティブなダッシュボードセッション
├── [あなたの既存のプロジェクトファイル]     # 実際のプロジェクト
├── package.json                      # プロジェクトの依存関係
└── README.md                         # プロジェクトのドキュメント
```

### MCPサーバーソース構造

**コア実装ファイル** (コードベース分析から確認された場所):

| ファイルパス | 目的 | 主要な特徴 |
|-----------|---------|--------------|
| `src/server.ts:74-85` | MCPサーバーの初期化 | ツール登録、ダッシュボード統合 |
| `src/core/path-utils.ts:12-35` | クロスプラットフォームパス | Windows/Unixパスハンドリング |
| `src/core/session-manager.ts:15-40` | ダッシュボードセッション追跡 | URL管理、接続状態 |
| `src/dashboard/approval-storage.ts:20-45` | 人間による承認システム | JSONファイル永続化 |
| `src/dashboard/server.ts:54` | 外部HTTP呼び出し | NPMバージョンチェック（唯一の外部呼び出し） |

**テンプレートシステム** (静的コンテンツ、AI生成なし):
```
src/
├── core/                             # コアビジネスロジック
│   ├── archive-service.ts            # スペックのアーカイブ機能
│   ├── parser.ts                     # スペックの解析と分析
│   ├── path-utils.ts                # クロスプラットフォームのパスハンドリング
│   ├── session-manager.ts           # ダッシュボードセッション追跡
│   └── task-parser.ts               # タスク管理と解析
├── tools/                           # MCPツール実装
│   ├── index.ts                     # ツールレジストリとディスパッチャ
│   ├── spec-workflow-guide.ts       # ワークフロー手順
│   ├── steering-guide.ts            # ステアリングドキュメント手順
│   ├── create-spec-doc.ts           # 仕様書ドキュメント作成
│   ├── create-steering-doc.ts       # ステアリングドキュメント作成
│   ├── get-spec-context.ts          # スペックコンテキストの読み込み
│   ├── get-steering-context.ts      # ステアリングコンテキストの読み込み
│   ├── get-template-context.ts      # テンプレートの読み込み
│   ├── spec-list.ts                 # 全仕様書の一覧表示
│   ├── spec-status.ts               # スペックステータスの取得
│   ├── manage-tasks.ts              # タスク管理
│   ├── refresh-tasks.ts             # タスクステータスのリフレッシュ
│   ├── request-approval.ts          # 承認リクエストの作成
│   ├── get-approval-status.ts       # 承認ステータスの確認
│   └── delete-approval.ts           # 承認のクリーンアップ
├── dashboard/                       # ダッシュボードバックエンド
│   ├── server.ts                    # Fastify Webサーバー
│   ├── approval-storage.ts          # 承認の永続化
│   ├── parser.ts                    # ダッシュボード固有の解析
│   ├── watcher.ts                   # ファイルシステム監視
│   ├── utils.ts                     # ダッシュボードユーティリティ
│   └── public/                      # 静的アセット
│       ├── claude-icon.svg          # ライトモードアイコン
│       └── claude-icon-dark.svg     # ダークモードアイコン
├── dashboard_frontend/              # Reactダッシュボードフロントエンド
│   ├── src/
│   │   ├── modules/
│   │   │   ├── api/                 # API通信レイヤー
│   │   │   ├── app/                 # メインアプリケーションコンポーネント
│   │   │   ├── approvals/           # 承認UIコンポーネント
│   │   │   ├── editor/              # マークダウンエディタ
│   │   │   ├── markdown/            # マークダウンレンダリング
│   │   │   ├── modals/              # モーダルダイアログコンポーネント
│   │   │   ├── notifications/       # トースト通知
│   │   │   ├── pages/               # メインページコンポーネント
│   │   │   ├── theme/               # スタイリングとテーマ
│   │   │   └── ws/                  # WebSocket統合
│   │   ├── main.tsx                 # Reactアプリケーションエントリ
│   │   └── App.tsx                  # ルートアプリケーションコンポーネント
│   ├── index.html                   # HTMLテンプレート
│   ├── vite.config.ts               # Viteビルド設定
│   └── tailwind.config.js           # Tailwind CSS設定
├── markdown/                        # ドキュメントテンプレート
│   └── templates/
│       ├── requirements-template.md  # 要件ドキュメントテンプレート
│       ├── design-template.md       # 設計ドキュメントテンプレート
│       ├── tasks-template.md        # タスクドキュメントテンプレート
│       ├── product-template.md      # 製品ビジョンテンプレート
│       ├── tech-template.md         # 技術標準テンプレート
│       └── structure-template.md    # コード構造テンプレート
├── server.ts                       # メインMCPサーバークラス
├── index.ts                        # CLIエントリポイントと引数解析
└── types.ts                        # TypeScript型定義
```

### VS Code拡張機能の構造
```
vscode-extension/
├── src/
│   ├── extension.ts                 # 拡張機能エントリポイント
│   ├── extension/
│   │   ├── providers/               # VS Codeプロバイダー
│   │   │   └── SidebarProvider.ts   # サイドバーWebviewプロバイダー
│   │   ├── services/                # ビジネスロジックサービス
│   │   │   ├── ApprovalCommandService.ts      # 承認コマンド
│   │   │   ├── ApprovalEditorService.ts       # 承認エディタ統合
│   │   │   ├── ArchiveService.ts              # アーカイブ機能
│   │   │   ├── CommentModalService.ts         # コメントモーダルハンドリング
│   │   │   ├── FileWatcher.ts                 # ファイルシステム監視
│   │   │   └── SpecWorkflowService.ts         # メインワークフローサービス
│   │   ├── types.ts                 # 拡張機能の型定義
│   │   └── utils/                   # ユーティリティ関数
│   │       ├── colorUtils.ts        # 色操作
│   │       ├── logger.ts            # ロギング機能
│   │       └── taskParser.ts        # 拡張機能用タスク解析
│   └── webview/                     # Webviewコンポーネント (React)
│       ├── App.tsx                  # メインWebviewアプリケーション
│       ├── components/              # 再利用可能なUIコンポーネント
│       ├── hooks/                   # Reactフック
│       ├── lib/                     # ユーティリティライブラリ
│       └── main.tsx                 # Webviewエントリポイント
├── webview-assets/                  # 静的Webviewアセット
│   └── sounds/                      # 音声通知ファイル
│       ├── approval-pending.wav     # 承認リクエストサウンド
│       └── task-completed.wav       # タスク完了サウンド
├── icons/                          # 拡張機能アイコン
│   ├── activity-bar-icon.svg       # アクティビティバーアイコン
│   └── spec-workflow.svg           # 一般的な拡張機能アイコン
├── package.json                    # 拡張機能マニフェストと依存関係
└── README.md                       # 拡張機能ドキュメント
```

## 📋 ファイル命名規則

### 仕様書名
- **フォーマット**: `kebab-case` (ハイフン区切りの小文字)
- **例**: ✅ `user-authentication`, `payment-flow`, `admin-dashboard`
- **無効**: ❌ `UserAuth`, `payment_flow`, `Admin Dashboard`

### ドキュメントファイル
- **要件**: `requirements.md`
- **設計**: `design.md`
- **タスク**: `tasks.md`
- **製品**: `product.md`
- **技術**: `tech.md`
- **構造**: `structure.md`

### 承認ファイル
- **フォーマット**: `{spec-name}-{document}-{timestamp}.json`
- **例**: `user-auth-requirements-20241215-143022.json`
- **自動生成**: システムが自動的に作成

### セッションファイル
- **セッション**: `session.json` (プロジェクトごとに1ファイル)
- **場所**: `.spec-workflow/session.json`

## 🛠️ パスユーティリティ

### クロスプラットフォームパスハンドリング

システムは`PathUtils`クラスを使用して、Windows、macOS、Linux間で一貫したパスハンドリングを行います：

```typescript
export class PathUtils {
  // ワークフロールートディレクトリを取得
  static getWorkflowRoot(projectPath: string): string {
    return normalize(join(projectPath, '.spec-workflow'));
  }

  // スペックディレクトリパスを取得
  static getSpecPath(projectPath: string, specName: string): string {
    return normalize(join(projectPath, '.spec-workflow', 'specs', specName));
  }

  // ステアリングドキュメントパスを取得
  static getSteeringPath(projectPath: string): string {
    return normalize(join(projectPath, '.spec-workflow', 'steering'));
  }

  // プラットフォーム固有のパスに変換
  static toPlatformPath(path: string): string {
    return path.split('/').join(sep);
  }

  // Unix形式のパスに変換（JSON/API用）
  static toUnixPath(path: string): string {
    return path.split(sep).join('/');
  }
}
```

### 一般的なパス操作

```typescript
// PathUtilsの使用例

// スペックパスを取得
const specPath = PathUtils.getSpecPath('/project', 'user-auth');
// 結果: /project/.spec-workflow/specs/user-auth

// 要件ファイルパスを取得
const reqPath = join(specPath, 'requirements.md');
// 結果: /project/.spec-workflow/specs/user-auth/requirements.md

// APIレスポンス用の相対パスを取得
const relativePath = PathUtils.toUnixPath(reqPath.replace(projectPath, ''));
// 結果: .spec-workflow/specs/user-auth/requirements.md
```

## 📂 ディレクトリの作成と管理

### 自動作成されるディレクトリ

システムは必要に応じてこれらのディレクトリを自動的に作成します：

```typescript
// 初期化中に作成されるディレクトリ
const directories = [
  '.spec-workflow/',
  '.spec-workflow/specs/',
  '.spec-workflow/steering/',
  '.spec-workflow/archive/',
  '.spec-workflow/archive/specs/'
];

// オンデマンドで作成されるディレクトリ
const onDemandDirectories = [
  '.spec-workflow/approvals/',
  '.spec-workflow/approvals/{spec-name}/',
  '.spec-workflow/specs/{spec-name}/'
];
```

### ディレクトリ検証

```typescript
export async function validateProjectPath(projectPath: string): Promise<string> {
  // 絶対パスに解決
  const absolutePath = resolve(projectPath);

  // パスが存在するか確認
  await access(absolutePath, constants.F_OK);

  // ディレクトリであることを確認
  const stats = await stat(absolutePath);
  if (!stats.isDirectory()) {
    throw new Error(`プロジェクトパスはディレクトリではありません: ${absolutePath}`);
  }

  return absolutePath;
}
```

### クリーンアップとメンテナンス

```typescript
// 完了した仕様書をアーカイブ
export class SpecArchiveService {
  async archiveSpec(specName: string): Promise<void> {
    const sourceDir = PathUtils.getSpecPath(this.projectPath, specName);
    const archiveDir = PathUtils.getArchiveSpecPath(this.projectPath, specName);

    // スペックをアーカイブに移動
    await fs.rename(sourceDir, archiveDir);

    // 承認をクリーンアップ
    const approvalsDir = PathUtils.getSpecApprovalPath(this.projectPath, specName);
    await fs.rm(approvalsDir, { recursive: true, force: true });
  }
}
```

## 🔒 ファイル権限とセキュリティ

### 必要な権限

```bash
# 最低限必要な権限
.spec-workflow/           # 755 (rwxr-xr-x)
├── specs/               # 755 (rwxr-xr-x)
├── steering/            # 755 (rwxr-xr-x)
├── approvals/           # 755 (rwxr-xr-x)
└── session.json         # 644 (rw-r--r--)
```

### セキュリティに関する考慮事項

**ファイルアクセス制限**:
- ✅ 読み書き: `.spec-workflow/`ディレクトリ内のみ
- ✅ 読み取り専用: プロジェクトファイル（分析用）
- ❌ 禁止: システムディレクトリ、親ディレクトリトラバーサル

**パストラバーサル防止**:
```typescript
// すべてのパスは正規化および検証される
const safePath = normalize(join(projectPath, '.spec-workflow', userInput));

// パスがプロジェクト内に留まることを確認
if (!safePath.startsWith(projectPath)) {
  throw new Error('パストラバーサルの試みが検出されました');
}
```

## 📊 ストレージに関する考慮事項

### ファイルサイズ制限

| ファイルタイプ | 一般的なサイズ | 最大推奨サイズ |
|-----------|-------------|-----------------|
| 要件 | 5-20 KB | 100 KB |
| 設計 | 10-50 KB | 200 KB |
| タスク | 5-30 KB | 150 KB |
| ステアリングドキュメント | 5-20 KB | 100 KB |
| 承認データ | < 1 KB | 5 KB |
| セッションデータ | < 1 KB | 2 KB |

### ディスク使用量の見積もり

```typescript
// 一般的なプロジェクトのディスク使用量
interface DiskUsage {
  singleSpec: '50-200 KB';      // 全3ドキュメント
  steeringDocs: '20-100 KB';    // 全ステアリングドキュメント
  approvalData: '1-10 KB';      // 承認ワークフローごと
  sessionData: '< 1 KB';        // セッショントラッキング
  totalTypical: '100-500 KB';   // 中小規模のプロジェクト
  totalLarge: '1-5 MB';         // 多数のスペックを持つ大規模プロジェクト
}
```

### クリーンアップ戦略

```bash
# 手動クリーンアップコマンド

# 完了した承認を削除（30日以上経過したもの）
find .spec-workflow/approvals -name "*.json" -mtime +30 -delete

# 古い仕様書をアーカイブ
# (すべてのタスクが完了したスペックをarchive/に移動)

# セッションデータをクリーンアップ
rm -f .spec-workflow/session.json

# 完全リセット（最終手段）
rm -rf .spec-workflow/
```

---

**次へ**: [ダッシュボードシステム →](dashboard.md)

# 貢献ガイドライン

> **ようこそ！** このガイドは、Spec Workflow MCPプロジェクトに効果的に貢献するのに役立ちます。

## 🚀 貢献者向けクイックスタート

### 1. 開発環境のセットアップ
```bash
# リポジトリをフォークしてクローン
git clone https://github.com/your-username/spec-workflow-mcp.git
cd spec-workflow-mcp

# 依存関係のインストール
npm install

# VS Code拡張機能の依存関係をインストール（オプション）
cd vscode-extension
npm install
cd ..

# セットアップを検証するためにすべてをビルド
npm run build
```

### 2. 開発ワークフロー
```bash
# 開発モードでMCPサーバーを起動
npm run dev

# 別のターミナルでダッシュボードを起動
npm run dev:dashboard

# 変更を加える
# 徹底的にテストする
# プルリクエストを作成する
```

## 🎯 貢献方法

### 協力が必要な分野

**🔧 コア機能**
- 新しいMCPツールと機能
- パフォーマンスの最適化
- クロスプラットフォーム互換性の向上

**📱 ダッシュボードとUI**
- 新しいダッシュボード機能
- UI/UXの改善
- アクセシビリティの向上

**📚 ドキュメント**
- コード例とチュートリアル
- APIドキュメントの改善
- 他言語への翻訳

**🧪 テスト**
- ユニットテストのカバレッジ
- 統合テストシナリオ
- 異なるプラットフォームでの手動テスト

**🐛 バグ修正**
- GitHubで報告された問題
- エッジケースとエラーハンドリング
- パフォーマンスのボトルネック

## 📋 貢献の種類

### 1. バグ報告
**Issueを作成する前に**:
- 既存のIssueをまず検索する
- [トラブルシューティングガイド](troubleshooting.md)を試す
- 最新バージョンでテストする

**良いバグ報告のテンプレート**:
```markdown
## バグの説明
問題の簡単な説明

## 環境
- OS: [Windows 11 / macOS 14 / Ubuntu 22.04]
- Node.js: [バージョン]
- MCPクライアント: [Claude Desktop / Cursor / など]

## 再現手順
1. ステップ1
2. ステップ2
3. ステップ3

## 期待される動作
どうなるべきか

## 実際の動作
実際に何が起こるか

## 追加のコンテキスト
- エラーメッセージ
- スクリーンショット
- ログ
```

### 2. 機能リクエスト
**良い機能リクエストのテンプレート**:
```markdown
## 機能の説明
提案する機能の明確な説明

## 解決する問題
これによりどの問題が解決されるか

## 提案された解決策
どのように機能すべきか

## 検討された代替案
検討した他のアプローチ

## 実装のアイデア
これを実装する方法についての考え
```

### 3. コードの貢献

#### プルリクエストのプロセス
1. リポジトリを**フォーク**する
2. 機能ブランチを**作成**する: `git checkout -b feature/my-feature`
3. コーディング標準に従って変更を**加える**
4. 変更を徹底的に**テスト**する
5. 新しい機能を**文書化**する
6. 明確な説明とともにプルリクエストを**提出**する

#### プルリクエストのテンプレート
```markdown
## 説明
変更の簡単な説明

## 変更の種類
- [ ] バグ修正
- [ ] 新機能
- [ ] 破壊的変更
- [ ] ドキュメントの更新

## テスト
- [ ] ユニットテストが合格
- [ ] 手動テストが完了
- [ ] クロスプラットフォームでテスト済み（該当する場合）

## ドキュメント
- [ ] コードが文書化されている
- [ ] READMEが更新されている（必要な場合）
- [ ] APIドキュメントが更新されている（必要な場合）

## チェックリスト
- [ ] コードがスタイルガイドラインに従っている
- [ ] 自己レビューが完了
- [ ] マージコンフリクトなし
```

## 🎨 コーディング標準

### TypeScriptガイドライン

**ファイル構成**:
```typescript
// 1. 外部ライブラリのインポート
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { readFile } from 'fs/promises';

// 2. 内部インポート
import { ToolContext, ToolResponse } from '../types.js';
import { PathUtils } from '../core/path-utils.js';

// 3. 型定義
interface LocalInterface {
  // ...
}

// 4. 定数
const CONSTANTS = {
  // ...
};

// 5. メイン実装
export class MyClass {
  // ...
}
```

**関数構造**:
```typescript
/**
 * この関数が何をするかの簡単な説明
 * @param param1 パラメータの説明
 * @param param2 パラメータの説明
 * @returns 戻り値の説明
 */
export async function myFunction(
  param1: string,
  param2: number
): Promise<MyReturnType> {
  // 入力検証
  if (!param1) {
    throw new Error('param1は必須です');
  }

  try {
    // メインロジック
    const result = await doSomething(param1, param2);
    return result;
  } catch (error: any) {
    // エラーハンドリング
    throw new Error(`操作に失敗しました: ${error.message}`);
  }
}
```

**エラーハンドリングパターン**:
```typescript
// MCPツールのエラーハンドリング
export async function myToolHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  try {
    // 検証
    const { requiredParam } = args;
    if (!requiredParam) {
      return {
        success: false,
        message: 'requiredParamは必須です',
        nextSteps: ['必須パラメータを提供してください']
      };
    }

    // 実装
    const result = await doWork(requiredParam);

    return {
      success: true,
      message: '操作が正常に完了しました',
      data: result,
      nextSteps: ['次に推奨されるアクション']
    };
  } catch (error: any) {
    return {
      success: false,
      message: `操作に失敗しました: ${error.message}`,
      nextSteps: [
        '入力パラメータを確認してください',
        'ファイル権限を確認してください',
        '再試行するか、サポートに連絡してください'
      ]
    };
  }
}
```

### Reactコンポーネントガイドライン

**コンポーネント構造**:
```typescript
// src/dashboard_frontend/src/components/MyComponent.tsx
import React, { useState, useEffect } from 'react';

interface MyComponentProps {
  data: DataType[];
  onAction: (item: DataType) => void;
  className?: string;
}

export default function MyComponent({
  data,
  onAction,
  className = ''
}: MyComponentProps) {
  const [localState, setLocalState] = useState<StateType>({});

  useEffect(() => {
    // 副作用
  }, [data]);

  const handleClick = (item: DataType) => {
    // イベントハンドラ
    onAction(item);
  };

  return (
    <div className={`base-styles ${className}`}>
      {data.map(item => (
        <div key={item.id} onClick={() => handleClick(item)}>
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

**スタイリングガイドライン**:
```typescript
// Tailwind CSSクラスを使用
<div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    タイトル
  </h2>
</div>

// Tailwindで不十分な場合にのみカスタムCSSを使用
// src/modules/theme/theme.cssに追加
```

### ファイルとディレクトリの命名規則

```
// ファイル
kebab-case.ts         ✅ 良い
PascalCase.ts         ❌ 避ける
snake_case.ts         ❌ 避ける

// ディレクトリ
kebab-case/           ✅ 良い
PascalCase/          ❌ 避ける（Reactコンポーネントを除く）
snake_case/          ❌ 避ける

// Reactコンポーネント
MyComponent.tsx       ✅ 良い（コンポーネントはPascalCase）
my-component.tsx      ❌ 避ける

// MCPツール
my-tool.ts           ✅ 良い
myTool.ts            ❌ 避ける
```

## 🧪 テストガイドライン

### 手動テストチェックリスト

**PR提出前**:
- [ ] MCPサーバーがエラーなく起動する
- [ ] ダッシュボードがデータを読み込んで表示する
- [ ] WebSocket接続が機能する
- [ ] ファイル変更が更新をトリガーする
- [ ] 承認ワークフローが機能する
- [ ] クロスプラットフォーム互換性（該当する場合）

**テストシナリオ**:
```bash
# 1. 基本的なMCPサーバー機能
npm run dev
# AIクライアントを接続してツールをテスト

# 2. ダッシュボード機能
npm run dev:dashboard
# すべてのページと機能をテスト

# 3. VS Code拡張機能（変更した場合）
cd vscode-extension
# VS CodeでF5キーを押してテスト

# 4. ビルドプロセス
npm run clean
npm run build
# dist/ の内容を確認

# 5. CLIインターフェース
node dist/index.js --help
node dist/index.js --dashboard
```

### 将来のテストフレームワーク

**ユニットテスト**（計画中）:
```typescript
// テスト構造の例
describe('PathUtils', () => {
  describe('getSpecPath', () => {
    it('should create correct spec path', () => {
      const result = PathUtils.getSpecPath('/project', 'my-spec');
      expect(result).toBe('/project/.spec-workflow/specs/my-spec');
    });

    it('should handle special characters', () => {
      const result = PathUtils.getSpecPath('/project', 'user-auth');
      expect(result).toContain('user-auth');
    });
  });
});
```

## 📖 ドキュメント標準

### コードドキュメント

**JSDocコメント**:
```typescript
/**
 * ワークフローシーケンスに従って新しい仕様書ドキュメントを作成します
 *
 * @param projectPath - プロジェクトルートへの絶対パス
 * @param specName - kebab-caseの機能名（例：'user-authentication'）
 * @param document - 作成するドキュメント: 'requirements' | 'design' | 'tasks'
 * @param content - ドキュメントの完全なマークダウンコンテンツ
 * @returns ファイルパスと次のステップを含むツールレスポンスを解決するPromise
 *
 * @example
 * ```typescript
 * const response = await createSpecDoc({
 *   projectPath: '/my/project',
 *   specName: 'user-auth',
 *   document: 'requirements',
 *   content: '# Requirements\n\n...'
 * });
 * ```
 *
 * @throws {Error} ワークフローの順序に違反した場合（例：要件の前に設計を作成）
 */
export async function createSpecDoc(...): Promise<ToolResponse> {
  // 実装
}
```

**READMEの更新**:
- ユーザー向けの変更については、メインのREADME.mdを更新
- 開発者向けの変更については、技術ドキュメントを更新
- 新機能のコード例を含める

### APIドキュメント

**MCPツールドキュメント**:
```typescript
export const myNewToolTool: Tool = {
  name: 'my-new-tool',
  description: `このツールが何をするかの簡単な説明。

# 手順
いつこのツールを使用し、ワークフローにどのように適合するか。

# パラメータ
- param1: 説明とフォーマット
- param2: 説明と制約

# 使用例
このツールの具体的な使用例。`,
  inputSchema: {
    // JSONスキーマ
  }
};
```

## 🔄 開発ワークフロー

### ブランチ戦略

```bash
# メインブランチ
main                    # 安定版リリースのコード
develop                 # 機能の統合ブランチ

# 機能ブランチ
feature/add-new-tool   # 新機能
bugfix/fix-approval    # バグ修正
docs/update-api        # ドキュメント更新
chore/update-deps      # メンテナンス作業
```

### コミットメッセージのフォーマット

```bash
# フォーマット: type(scope): description

feat(tools): add new spec validation tool
fix(dashboard): resolve WebSocket connection issues
docs(api): update MCP tool documentation
chore(deps): update TypeScript to 5.3.0
refactor(parser): simplify task parsing logic

# タイプ: feat, fix, docs, style, refactor, test, chore
# スコープ: tools, dashboard, core, docs, extension
```

### リリースプロセス

**バージョン管理**:
```bash
# パッチリリース（バグ修正）
npm version patch

# マイナーリリース（新機能）
npm version minor

# メジャーリリース（破壊的変更）
npm version major
```

**リリース前チェックリスト**:
- [ ] すべてのテストが合格
- [ ] ドキュメントが更新済み
- [ ] CHANGELOG.mdが更新済み
- [ ] バージョンが更新済み
- [ ] ビルドが成功
- [ ] 手動テストが完了

## 🤝 コミュニティガイドライン

### 行動規範

**私たちの基準**:
- **敬意を払う** - すべての人に敬意と親切さをもって接する
- **包括的である** - あらゆるバックグラウンドの貢献者を歓迎する
- **建設的である** - 役立つフィードバックと提案を提供する
- **忍耐強くある** - 誰もが学んでいることを忘れない

**許容されない行動**:
- ハラスメントや差別
- 荒らしや扇動的なコメント
- 個人的な攻撃
- 個人情報の公開

### ヘルプの入手

**貢献者向け**:
1. このガイドと関連ドキュメントを**読む**
2. 既存のIssueとディスカッションを**検索する**
3. 一般的な質問は**GitHub Discussionsで尋ねる**
4. 特定の問題については**Issueを作成する**
5. コミュニティチャンネルに参加する（利用可能な場合）

**メンテナー向け**:
- IssueとPRに迅速に対応する
- 建設的なフィードバックを提供する
- 新規参入者が始められるよう手助けする
- 歓迎的な環境を維持する

## 🏆 表彰

### 貢献者

貢献者は以下で表彰されます：
- GitHubの貢献者リスト
- 重要な貢献に対するCHANGELOG.md
- README.mdの謝辞セクション

### 貢献の種類

**すべての貢献を歓迎します**:
- 💻 **コード** - 機能、バグ修正、改善
- 📖 **ドキュメント** - ガイド、例、翻訳
- 🐛 **テスト** - バグ報告、テストケース、QA
- 💡 **アイデア** - 機能リクエスト、設計フィードバック
- 🎨 **デザイン** - UI/UX改善、アイコン、グラフィック
- 📢 **コミュニティ** - 他のユーザーを助ける、情報を広める

---

**Spec Workflow MCPへの貢献に感謝します！** 🎉

どんなに小さな貢献でも、このプロジェクトを皆にとってより良いものにするのに役立ちます。

---

**次へ**: [テストガイド →](testing.md)

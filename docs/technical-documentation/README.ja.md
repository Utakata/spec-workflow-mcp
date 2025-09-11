# 技術文書

> **クイックリファレンス**: 必要な情報へジャンプ → [ツールAPI](api-reference.ja.md) | [アーキテクチャ](architecture.ja.md) | [開発者ガイド](developer-guide.ja.md) | [トラブルシューティング](troubleshooting.ja.md)

## 📋 目次

### コア文書
- **[アーキテクチャ概要](architecture.ja.md)** - システム設計、コンポーネント、データフロー
- **[MCPツールAPIリファレンス](api-reference.ja.md)** - 完全なツール文書と使用例
- **[開発者ワークフローガイド](developer-guide.ja.md)** - ステップバイステップの開発ワークフロー
- **[コンテキスト管理](context-management.ja.md)** - コンテキスト切り替えとキャッシングの仕組み
- **[ファイル構造](file-structure.ja.md)** - プロジェクト構成とディレクトリレイアウト
- **[ダッシュボードシステム](dashboard.ja.md)** - Webダッシュボードとリアルタイム機能
- **[トラブルシューティング & FAQ](troubleshooting.ja.md)** - 一般的な問題と解決策

### クイックスタートガイド
- **[開発環境のセットアップ](setup.ja.md)** - 迅速な立ち上げと実行
- **[コントリビューションガイドライン](contributing.ja.md)** - プロジェクトへの貢献方法
- **[テストガイド](testing.ja.md)** - テストの実行と新規作成

## 🚀 クイックスタート

### AIアシスタント統合用
```json
{
  "mcpServers": {
    "spec-workflow": {
      "command": "npx",
      "args": ["-y", "@pimzino/spec-workflow-mcp@latest", "/path/to/project", "--AutoStartDashboard"]
    }
  }
}
```

### ローカル開発用
```bash
# クローンとセットアップ
git clone <repository-url>
cd spec-workflow-mcp
npm install

# 開発サーバーの起動
npm run dev

# 本番用ビルド
npm run build
```

## 🔍 包括的な能力分析

### 重要な技術的質問への回答

包括的なコードベース分析に基づき、主要な技術的質問に対する明確な回答を以下に示します：

#### **質問1: Webスクレイピングとリサーチ能力**
**回答: 独立したWebスクレイピングは行わず、LLMの組み込みWeb検索を活用**

| 側面 | このMCP | 他のAIエージェント | 拡張の機会 |
|--------|----------|----------------|---------------------|
| **Webスクレイピング** | ❌ 独立した能力なし | ✅ カスタムスクレイパー (Puppeteer, Playwright) | 🔮 構造化スクレイピングツールの追加が可能 |
| **APIリサーチ** | ❌ LLMのWeb検索に依存 | ✅ 直接的なAPI統合 | 🔮 GitHub, Stack Overflow APIの追加が可能 |
| **リサーチキャッシング** | ❌ リサーチの永続性なし | ✅ 高度なキャッシングシステム | 🔮 LLMリサーチ結果のキャッシュが可能 |
| **データソース** | ✅ LLMの広範なトレーニングデータ + リアルタイムWeb | ❌ 設定されたソースに限定 | ✅ 両方の長所を活かす |

#### **質問2: AIコールとコンテキストウィンドウ管理**
**回答: 純粋なMCP - 接続されたLLMのみを使用し、独立したAIコールはなし**

| 側面 | このMCP | 他のAIエージェント | 拡張の機会 |
|--------|----------|----------------|---------------------|
| **AIサービスコール** | ❌ 独立したAIコールなし | ✅ 複数のAIモデル統合 | 🔮 特化型AIサービスの追加が可能 |
| **コンテキスト管理** | ❌ LLMコンテキストの操作なし | ✅ 高度なコンテキスト戦略 | 🔮 コンテキスト最適化の追加が可能 |
| **メモリ管理** | ❌ ファイルベースのみ | ✅ ベクトルデータベース、埋め込み | 🔮 永続メモリの追加が可能 |
| **マルチモデル使用** | ❌ 単一LLM接続 | ✅ GPT-4 + Claude + Gemini | 🔮 モデルルーティングの追加が可能 |

#### **質問3: ドキュメント計画プロセス**
**回答: テンプレートによるLLMインテリジェンス - 独立したAI計画はなし**

| 側面 | このMCP | 他のAIエージェント | 拡張の機会 |
|--------|----------|----------------|---------------------|
| **計画インテリジェンス** | ✅ テンプレートを用いたLLMの推論 | ✅ 専用の計画AI | 🔮 適応型ワークフローの追加が可能 |
| **テンプレートシステム** | ✅ 静的だが包括的 | ❌ 構造化テンプレートがないことが多い | ✅ 構造化の利点 |
| **ワークフロー適応** | ❌ 固定シーケンス | ✅ 動的なワークフロー生成 | 🔮 LLMによるワークフローの追加が可能 |
| **プロジェクト分析** | ✅ LLMがプロジェクトコンテキストを分析 | ✅ 特化型分析ツール | 🔮 詳細なコード分析の追加が可能 |

#### **質問4: 自動レビュープロセス**
**回答: 人間のみの承認システム - 自動AIレビューはなし**

| 側面 | このMCP | 他のAIエージェント | 拡張の機会 |
|--------|----------|----------------|---------------------|
| **レビュー自動化** | ❌ 人間の承認が必要 | ✅ 多段階のAIレビュー | 🔮 オプションのAIゲートの追加が可能 |
| **品質保証** | ✅ LLMの品質 + 人間の監視 | ❌ AIのみ（エラーの可能性） | ✅ 最高の品質管理 |
| **承認ワークフロー** | ✅ ダッシュボード/VS Code統合 | ❌ CLIのみが多い | ✅ 優れたUX |
| **レビューインテリジェンス** | ✅ LLMが改善を提案可能 | ✅ 特化型レビューモデル | 🔮 レビューテンプレートの追加が可能 |

#### **質問5: ベストプラクティス標準**
**回答: LLMの組み込み知識 - 外部標準の取得はなし**

| 側面 | このMCP | 他のAIエージェント | 拡張の機会 |
|--------|----------|----------------|---------------------|
| **標準ソース** | ✅ LLMの広範なトレーニング知識 | ✅ 外部標準API | 🔮 標準統合の追加が可能 |
| **最新性** | ✅ LLMが最新情報をWeb検索可能 | ❌ 静的な設定 | ✅ 常に最新 |
| **カスタマイズ** | ❌ プロジェクト固有の標準なし | ✅ カスタムルールエンジン | 🔮 組織標準の追加が可能 |
| **ベストプラクティス** | ✅ LLMによる業界全体の知識 | ❌ 事前設定に限定 | ✅ 包括的なカバレッジ |

### 競合ポジショニング分析

**他のAIエージェントに対する強み:**
```typescript
interface CompetitiveAdvantages {
  humanOversight: "必須の承認がAIの暴走を防ぐ";
  llmLeverage: "接続されたLLMの全能力を制限なく使用";
  structuredOutput: "テンプレートが一貫性のある専門的な文書を保証";
  realTimeUI: "ダッシュボードとVS Code統合によるシームレスなワークフロー";
  simplicity: "複雑なセットアップやAPIキー管理が不要";
  reliability: "検証とエラー処理を備えた実績のあるワークフローシーケンス";
}
```

**市場リーダーに対する現在の制限:**
```typescript
interface LimitationsAnalysis {
  automationLevel: "完全に自律的なエージェントよりも自動化度が低い";
  integrationEcosystem: "外部サービス統合が限定的";
  multiProject: "エンタープライズ全体のソリューションに対し単一プロジェクトスコープ";
  aiDiversity: "マルチモデルアプローチに対し単一LLM";
  workflowFlexibility: "適応型ワークフローに対し固定シーケンス";
}
```

**特定された拡張の機会:**
```typescript
interface ExpansionRoadmap {
  immediateWins: {
    githubIntegration: "PR作成、Issue同期、コード分析";
    qualityGates: "オプションの自動品質チェック";
    templateDynamism: "プロジェクトタイプに応じたテンプレート選択";
  };

  mediumTerm: {
    multiProjectSupport: "複数プロジェクト用のエンタープライズダッシュボード";
    advancedIntegrations: "Jira, Confluence, Slack通知";
    workflowCustomization: "設定可能なワークフローシーケンス";
  };

  longTerm: {
    aiOrchestration: "マルチエージェント連携機能";
    predictiveAnalytics: "プロジェクト成功予測とリスク分析";
    enterpriseFeatures: "SSO, コンプライアンス, 監査証跡";
  };
}
```

## ⚠️ 技術的制限と能力

### このMCPが「行わない」こと

**独立した外部コールなし**:
- ❌ MCPサーバーによる独立したWebスクレイピングやAPIコールはなし
- ❌ MCPサーバーによる独立した外部リサーチはなし
- ❌ MCPサーバーからAIサービスへの直接コールはなし
- ✅ 接続されたLLMの組み込みWeb検索と知識を活用

**独立したAIサービス統合なし**:
- ❌ OpenAI, Anthropic等の追加AIサービスへのコールはなし
- ❌ 接続されたLLM外での独立したAI処理はなし
- ❌ 独立したAIモデルやサービスはなし
- ✅ MCP接続を介して提供されるLLMのみを使用

**コンテキストウィンドウ管理なし**:
- ❌ AIクライアントのコンテキストウィンドウの拡張や管理はしない
- ❌ 会話履歴やメモリ管理はなし
- ❌ セッションをまたいだAIコンテキストの保持はなし
- ✅ AIクライアントが消費するための構造化されたプロジェクトデータを提供

**人間のみの承認システム**:
- ❌ AIによる自動ドキュメントレビューはなし
- ❌ AIベースの承認推奨はなし
- ❌ 口頭での承認は受け付けない
- ✅ すべての承認にはダッシュボードまたはVS Codeの操作が必要

### このMCPが「得意とする」こと

**LLM組み込み能力の活用**:
- ✅ LLMが知的なコンテンツを埋めるための構造化テンプレートを提供
- ✅ LLMの分析と理解のためのプロジェクトコンテキストを供給
- ✅ LLMがベストプラクティスのために組み込み知識を使用可能に
- ✅ LLMがコンテンツ生成時にWebリサーチを実行可能に

**構造化ワークフローの強制**:
- ✅ スペック駆動開発シーケンスを強制
- ✅ 一貫したLLM出力のためのテンプレートベースのドキュメント構造
- ✅ ワークフローの検証とブロッキング
- ✅ LLM生成コンテンツに対する人間の監視統合

**インテリジェントなプロジェクトデータ管理**:
- ✅ LLM消費のための効率的なコンテキスト読み込み
- ✅ リアルタイムのファイル監視と更新
- ✅ クロスプラットフォームのパス処理
- ✅ LLMが理解できる構造化されたプロジェクト構成

**開発者体験の向上**:
- ✅ LLM生成コンテンツレビュー用のWebダッシュボード
- ✅ VS Code拡張機能の統合
- ✅ リアルタイムのWebSocket更新
- ✅ 包括的なエラー処理

## 🎯 主要コンセプト

### MCPツール
サーバーはスペック駆動開発のために13のMCPツールを提供します:
- **ワークフローツール**: `spec-workflow-guide`, `steering-guide`
- **コンテンツツール**: `create-spec-doc`, `create-steering-doc`, `get-template-context`
- **検索ツール**: `get-spec-context`, `get-steering-context`, `spec-list`
- **ステータスツール**: `spec-status`, `manage-tasks`, `refresh-tasks`
- **承認ツール**: `request-approval`, `get-approval-status`, `delete-approval`

### ファイル構成
```
.spec-workflow/
├── specs/           # 仕様書
├── steering/        # プロジェクトガイダンス文書
├── approvals/       # 承認ワークフローデータ
└── session.json     # アクティブセッショントラッキング
```

### ワークフローフェーズ
1. **要件** → 2. **設計** → 3. **タスク** → 4. **実装**

各フェーズは次に進む前に承認が必要です。

## 🔧 開発ワークフロー

### 新しいMCPツールの追加
1. `src/tools/` にツールファイルを作成
2. ツール定義とハンドラをエクスポート
3. `src/tools/index.ts` に登録
4. APIドキュメントを更新
5. テストを追加

### ダッシュボード開発
```bash
# 開発モードでダッシュボードを起動
npm run dev:dashboard

# ダッシュボードアセットをビルド
npm run build:dashboard
```

### VSCode拡張機能開発
```bash
cd vscode-extension
npm install
npm run compile
# VSCodeでF5を押して拡張機能ホストを起動
```

## 📚 ドキュメント標準

- **コード例**: 常に動作する例を含める
- **エラー処理**: 予期されるエラー条件を文書化
- **パフォーマンス**: パフォーマンスに関する考慮事項を記載
- **セキュリティ**: セキュリティへの影響を強調
- **破壊的変更**: 破壊的変更を明確にマーク

## 🤝 ヘルプ

1. **まず[トラブルシューティングガイド](troubleshooting.ja.md)を確認**
2. **既存の[GitHub Issues](https://github.com/Pimzino/spec-workflow-mcp/issues)を検索**
3. **詳細な再現手順を添えて新しいIssueを作成**
4. **コミュニティに参加**してリアルタイムサポートを受ける

---

## 📊 技術アーキテクチャ概要

### 純粋なMCPサーバー設計
このプロジェクトは、以下の特徴を持つ**純粋なモデルコンテキストプロトコル (MCP) サーバー**を実装しています:

| 側面 | 実装 | 詳細 |
|--------|---------------|----------|
| **AI統合** | 純粋なMCPサーバー | 接続されたLLMの組み込み能力を活用 |
| **Webリサーチ** | LLM組み込み能力 | LLMが組み込み機能を使用してWeb検索を実行 |
| **コンテキスト管理** | ファイルベース構造 | LLMコンテキストウィンドウ管理なし |
| **コンテンツ生成** | テンプレートを用いたLLM駆動 | LLMが組み込み知識と検索を使用してテンプレートを埋める |
| **計画プロセス** | LLM推論 + ワークフロー検証 | LLMがコンテンツを計画し、MCPが構造を強制 |
| **レビューシステム** | 人間による承認のみ | LLM出力に対するダッシュボード/VS Code統合 |
| **ベストプラクティス** | LLM組み込み知識 | LLMがトレーニングから得たベストプラクティスを適用 |
| **外部コール** | NPMバージョンチェックのみ | 他のすべての機能は接続されたLLM経由 |

### 主要ファイルと実装
- **MCPツール**: `src/tools/*.ts` - ワークフロー管理用13ツール
- **テンプレート**: `src/markdown/templates/*.md` - 静的ドキュメント構造
- **承認システム**: `src/dashboard/approval-storage.ts` - 人間のみのレビュー
- **コンテキスト読み込み**: `src/core/*.ts` - ファイルベースのコンテキスト構造化
- **Webダッシュボード**: `src/dashboard_frontend/` - Reactベースの承認UI

### パフォーマンス特性
- **メモリ使用量**: 50KBのテンプレート + スペックコンテキストごとに10-100KB
- **ファイルシステム**: ローカルの`.spec-workflow/`ディレクトリのみ
- **ネットワーク**: ローカルホストのダッシュボード + NPMバージョンチェック
- **スケーリング**: プロジェクトごとに線形、50-100スペックを推奨
- **セキュリティ**: ローカルのみ、外部へのデータ送信なし

## 📊 市場分析と戦略的洞察

### 競合ランドスケープ分析

**カテゴリ1: 自律AIエージェント (例: AutoGPT, LangChain Agents)**
```typescript
interface AutonomousAgents {
  capabilities: {
    webScraping: "高度 - カスタムスクレイパー、API統合";
    aiCalls: "複数モデル、特化型AIサービス";
    automation: "完全自律運用";
    integrations: "広範なサードパーティエコシステム";
  };

  limitations: {
    humanOversight: "限定的またはオプション";
    reliability: "逸脱やエラーの可能性";
    complexity: "複雑なセットアップ、API管理";
    cost: "複数のAIコールのため高コスト";
  };

  differentiator: "完全自動化 vs 人間が誘導する構造化ワークフロー";
}
```

**カテゴリ2: 開発ワークフローツール (例: GitHub Copilot, Cursor)**
```typescript
interface DevelopmentTools {
  capabilities: {
    codeGeneration: "エディタ内で優れている";
    contextAwareness: "コードコンテキストに強い";
    realTimeAssistance: "統合された開発サポート";
    aiPowered: "組み込みLLM能力";
  };

  limitations: {
    workflowStructure: "構造化されたスペックプロセスが限定的";
    documentationFocus: "コード中心でスペック駆動ではない";
    approvalProcess: "正式なレビューワークフローなし";
    projectPlanning: "高レベルの計画が限定的";
  };

  differentiator: "コードファースト vs スペック駆動の開発アプローチ";
}
```

**カテゴリ3: プロジェクト管理 + AI (例: Notion AI, Linear)**
```typescript
interface ProjectManagementAI {
  capabilities: {
    projectTracking: "優れたプロジェクト整理";
    collaboration: "チーム連携機能";
    aiAssistance: "AIによるコンテンツ生成";
    integration: "広範なサードパーティ接続";
  };

  limitations: {
    technicalDepth: "技術仕様への焦点が限定的";
    workflowEnforcement: "柔軟だが強制されない";
    developerWorkflow: "開発者ワークフローに最適化されていない";
    codeIntegration: "コードコンテキスト理解が限定的";
  };

  differentiator: "一般的なプロジェクト管理 vs 開発者特化ワークフロー";
}
```

### 戦略的市場ポジション

**Spec-Workflow-MCPのユニークなポジション:**
```typescript
interface MarketPosition {
  blueOcean: {
    category: "LLM強化型構造化開発ワークフロー";
    uniqueValue: "強制されたスペック駆動プロセスと人間が監督するLLMインテリジェンス";
    targetUser: "AI支援による構造化プロセスを必要とする開発チーム";
  };

  competitiveAdvantages: {
    llmLeverage: "追加のAPIコストなしでLLMの全能力を活用";
    humanOversight: "必須の承認によりAIのエラーを防止";
    structuredProcess: "実績のある開発方法論を強制";
    simplicity: "複雑なセットアップやAPIキー管理が不要";
    realTimeUI: "ダッシュボードによる優れたユーザー体験";
  };

  marketOpportunities: {
    enterpriseAdoption: "人間の管理下でAIの利点を享受したい企業";
    consultingFirms: "クライアントプロジェクト全体で標準化されたプロセス";
    startups: "オーバーヘッドなしの構造化開発";
    education: "適切な開発ワークフローの教育";
  };
}
```

### 拡張戦略に関する洞察

**フェーズ1: コアの強みを活用**
```typescript
interface Phase1Strategy {
  buildOnStrengths: {
    enhanceHumanOversight: "高度な承認ワークフロー、レビューテンプレート";
    improveStructure: "動的テンプレート、適応型ワークフロー";
    expandLLMUsage: "より良いコンテキスト活用、よりスマートな提案";
  };

  addressGaps: {
    basicIntegrations: "GitHub, GitLab, Bitbucket接続";
    qualityGates: "人間によるレビュー前のオプションの自動チェック";
    teamFeatures: "複数開発者の連携";
  };
}
```

**フェーズ2: 戦略的差別化**
```typescript
interface Phase2Strategy {
  uniqueCapabilities: {
    hybridIntelligence: "LLM自動化と人間の監視の長所を両立";
    contextMastery: "優れたプロジェクトコンテキスト理解";
    processExcellence: "業界をリードする構造化ワークフロー";
  };

  competitiveFeatures: {
    multiModelSupport: "複数のLLMプロバイダーをサポート";
    enterpriseFeatures: "SSO, コンプライアンス, 監査証跡";
    aiOrchestration: "監視を維持しつつのマルチエージェント連携";
  };
}
```

### クリエイターへの戦略的推奨事項

**当面の機会 (0-6ヶ月):**
1. **GitHub統合**: LLMを活用してPR作成、コードベース分析
2. **品質テンプレート**: プロジェクトタイプ検出によるスマートなテンプレート
3. **チーム連携**: 複数開発者の承認ワークフロー
4. **パフォーマンス分析**: スペックからデリバリーまでの成功率を追跡

**中期的な差別化要因 (6-18ヶ月):**
1. **ハイブリッドAIワークフロー**: 人間の監視を伴うオプションの自動ゲート
2. **エンタープライズダッシュボード**: マルチプロジェクト管理インターフェース
3. **高度な統合**: Jira, Slack, Confluence, CI/CDパイプライン
4. **予測分析**: LLMの洞察を用いたプロジェクトリスク分析

**長期的ビジョン (18ヶ月以上):**
1. **AIオーケストレーションプラットフォーム**: 人間の監視を伴うマルチエージェント連携
2. **業界テンプレート**: 様々なドメイン向けの特化型ワークフロー
3. **コンプライアンス統合**: SOX, GDPR, HIPAAワークフローテンプレート
4. **教育プラットフォーム**: 大規模な構造化開発の教育

### 市場検証に関する洞察

**この分析は、Spec-Workflow-MCPがユニークな市場ポジションを占めていることを示しています:**
- ✅ **未開拓市場**: AI強化による構造化開発ワークフロー
- ✅ **明確な差別化**: 人間の監視 + LLMの能力の組み合わせ
- ✅ **拡張の可能性**: 機能強化のための複数の明確なパス
- ✅ **戦略的優位性**: 競合他社が模倣困難な実績のあるワークフロー方法論

**最終更新**: 2024年12月 | **バージョン**: 0.0.23

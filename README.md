<<<<<<< HEAD
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


# OTHELLO 🔴⚫

Docker化されたNext.js + TypeScriptで作成したオセロゲーム

## 🎮 ゲーム特徴

- **完全なオセロルール実装**: 石の配置、裏返し、勝敗判定
- **TypeScript完全対応**: 型安全性を重視した実装  
- **リアルタイムスコア表示**: 黒と白の石の数をリアルタイム更新
- **有効手のハイライト**: 置ける場所が黄色でハイライト表示
- **Docker完全対応**: 環境に依存しない開発・実行環境

## 🛠 技術スタック

- **Frontend**: Next.js 14.2.6, React 18, TypeScript 5
- **Styling**: Tailwind CSS
- **Container**: Docker, Docker Compose
- **Node.js**: 18-alpine

## 🚀 クイックスタート

### 前提条件
- Docker
- Docker Compose

### 1. リポジトリをクローン
```bash
git clone https://github.com/YOURUSERNAME/OTHELLO.git
cd OTHELLO
```

### 2. Dockerで起動
```bash
# コンテナをビルド・起動
docker-compose up --build

# バックグラウンドで実行する場合
docker-compose up --build -d
```

### 3. ブラウザでアクセス
```
http://localhost:3001
```

### 4. 停止
```bash
# 停止
docker-compose down

# 完全にクリーンアップ
docker-compose down --rmi all --volumes
```

## 📁 プロジェクト構造

```
OTHELLO/
├── app/
│   └── page.tsx          # メインゲームコンポーネント
├── public/               # 静的ファイル
├── Dockerfile           # Docker設定
├── docker-compose.yml   # Docker Compose設定
├── package.json         # 依存関係
├── tsconfig.json        # TypeScript設定
├── tailwind.config.js   # Tailwind設定
└── README.md           # このファイル
```

## 🎯 ゲームルール

1. **黒から開始**: 黒石が先手
2. **有効手**: 相手の石を挟める場所のみ配置可能
3. **石の裏返し**: 配置により挟まれた石は自分の色に変わる
4. **ターン制**: 有効手がない場合は自動的にパス
5. **勝利条件**: 石の数が多い方が勝利

## 🔧 開発

### ローカル開発（Docker使用）
```bash
# 開発モードで起動
docker-compose up --build

# ファイル変更は自動で反映されます
```

### ローカル開発（Docker不使用）
```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:3000 にアクセス
```

## 📝 今後の改善予定

- [ ] AIプレイヤーの実装
- [ ] 手の履歴表示機能
- [ ] アニメーション効果の追加
- [ ] オンライン対戦機能
- [ ] レスポンシブデザインの最適化

## 🤝 貢献

プルリクエストやイシューの報告を歓迎します！

## 📄 ライセンス


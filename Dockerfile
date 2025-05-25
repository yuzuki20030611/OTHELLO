# nodeのバージョンをDockerHubのimageから取得して使用している
# alpine = 軽量版Linux（ファイルサイズが小さくて高速）
FROM node:18-alpine

# 作業ディレクトリをappディレクトリ配下に指定
# コンテナ内で「/app」フォルダを作成し、そこで作業する
WORKDIR /app

# packageのバージョンを使用したいため、コンテナにコピー
# package.jsonとpackage-lock.json（*が両方にマッチ）をコピー
# 先にこれだけコピーすることで、Dockerのキャッシュ機能を活用
# （コードが変わってもpackage.jsonが同じなら、npm installを再実行しない）
COPY package*.json ./
# 依存関係のエラーが出ないようにnpm installを実行
# node_modulesフォルダが作成され、必要なライブラリがインストールされる
RUN npm install

# 今の環境（ソースコード）をそのままコンテナにコピー
# 「.」= 現在のディレクトリのすべてのファイル
# 最後の「.」= コンテナ内の現在位置（/app）にコピー
COPY . .

# Next.jsアプリケーションをプロダクション用にビルド
# .nextフォルダが作成され、最適化されたファイルが生成される
# 「imageをイメージ構築」→「アプリをビルド」が正確
RUN npm run build

# コンテナのポート番号を指定
# 「このコンテナは3001番ポートを使います」とDockerに伝える
# 実際のポート開放はdocker-compose.ymlで行う
EXPOSE 3001

# 作成したアプリケーションを実行、かつ、ポート番号を3001に変更
# npm start = Next.jsのプロダクションサーバーを起動
# -- = npmコマンドの引数とNext.jsの引数を分ける
# -p 3001 = Next.jsを3001番ポートで起動
CMD ["npm", "start", "--", "-p", "3001"]
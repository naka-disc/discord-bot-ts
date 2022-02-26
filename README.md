# discord-bot-ts
DiscordのBotをTypeScriptで作成するリポジトリ。


# 準備
```sh
# モジュールインストール
npm install
# DBマイグレーション
./node_modules/.bin/ts-node node_modules/.bin/typeorm migration:run
# デバッグ実行
npm run debug
```


## TypeORMコマンド集
```sh
# マイグレーション状況確認
./node_modules/.bin/ts-node node_modules/.bin/typeorm migration:show
```
```sh
# マイグレーション実行
./node_modules/.bin/ts-node node_modules/.bin/typeorm migration:run
```
```sh
# Entityからマイグレーション作成
./node_modules/.bin/ts-node node_modules/.bin/typeorm migration:generate -n EntityName
```

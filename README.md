# discord-bot-typescript
- DiscordのBotをTypeScriptで作成するリポジトリ。


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
npm run typeorm migration:show
```
```sh
# マイグレーション実行
npm run typeorm migration:run
```
```sh
# Entityからマイグレーション作成
npm run typeorm migration:generate -n EntityName
```

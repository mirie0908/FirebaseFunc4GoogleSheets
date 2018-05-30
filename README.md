## 概要
- クライアント側からRESTfulなAPIでトリガされ動作し、Google sheet APIを使ってGoogle Sheetに、受け取った情報（氏名）を書き込むnode.jsコード
- 本node.jsコードは、Google firebase Functions 上にデプロイ。（サーバレス）

## 構成
```         
                  REST API
[ クライアント側 ] ----------->   [ node.js (index.js) ]  ------ GoogleSheet API ---> [ Google sheet ]
                  　トリガ      --------------------------
                              [Google firebase Functions]
```

## REST API
- METHOD              ：　GET
- URL(APIエンドポイント）： https://us-central1-automatic-rock-204313.cloudfunctions.net/googlesheets
- パラメタ　　　　　　　　:  name （Sheetに追記する氏名の文字列）

- hogehogeさんをSheetに登録するときの REST APIのコール：
```
GET https://us-central1-automatic-rock-204313.cloudfunctions.net/googlesheets?name=hogehoge とコールする
```

- curlコマンドをクライアント側として、以下のcurlコマンドで実行する：
```
curl -s -G -d name=hogehoge "https://us-central1-automatic-rock-204313.cloudfunctions.net/googlesheets"
```


# Getting started

## コードスニペットの挿入

以下の `<script>` タグを最初に `slash7` にアクセスする前(たとえば `</head>` の直前など)に書きます。
`[YOUR TRACKING CODE]` にはあなたのプロジェクト用に発行された tracking code を入れてください。

````
<script type="text/javascript">
var slash7=slash7||[];!function(){var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=("https:"===document.location.protocol?"https":"http")+"://d9nbmxmbhbtmj.cloudfront.net/v1/slash7.min.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);for(var c=function(a){return function(){slash7.push([a].concat(Array.prototype.slice.call(arguments,0)))}},d=["init","identify","trackPageLoad","track","register"],e=0;e<d.length;e++)slash7[d[e]]=c(d[e])}();
slash7.init("[YOUR TRACKING CODE]");
</script>
````

サブドメインに対してトラッキングを行いたい場合は、上記 `slash7.init()` の第二引数に `domain` を指定してください。

````
// www.example.com と test.example.com の両方をトラッキングしたい場合
slash7.init("[YOUR TRACKING CODE]", {domain: "example.com"});
````

### サンプリング設定

ユーザベースのサンプリングを実施したい場合は、上記 `slash7.init()` の第二引数に `samplingRate` を指定してください。
`samplingRate` の値は 0 から 1 の間の数字を指定します。
0を指定したときはどのユーザも記録しません（`track()`、`trackPageLoad()` 呼び出し時にイベントが送信されません）。
1を指定したときは全ユーザを記録します。
例えば 0.3 を指定したときは、全ユーザのおおよそ3割にあたるユーザを記録します。

````
// 3割のユーザを記録したい場合
slash7.init("[YOUR TRACKING CODE]", {samplingRate: 0.3});
````

`domain` と `samplingRate` は同時に指定することができます。

````
// domain と samplingRate を同時に指定する場合
slash7.init("[YOUR TRACKING CODE]", {domain: "example.com", samplingRate: 0.3});
````

## イベントの送信

イベントの送信は `slash7.track()` で行います。
例えば `page_load` イベントを送信するには次のようにします。

````
slash7.track("page_load");
````

### イベントパラメータ

イベントパラメータは `slash7.track()` の第二引き数で指定します。
例えば `url` をイベントパラメータとして指定してイベントを送信するには次のようにします。

````
slash7.track("page_load", {url: window.location.href});
````

### ページロードイベント送信

`slash7.trackPageLoad()` はWebページのロードを表すイベントを送信します。
この関数は以下の情報を引き数にして `slash7.track()` を呼び出したときと同じ効果があります。

* イベント名: `page_load`
* イベントパラメータ
    * `domain`: ページのドメイン
    * `path`: ページのパス
    * `query`: ページのクエリ部分
    * `referer`: リファラ
    * `referer_domain`: リファラのドメイン
    * `platform`: `window.navigator.platform`
    * `user_agent`: `window.navigator.userAgent`

注意: `slash7.trackPageLoad()` は 2013年11月6日に追加されました。
追加に伴い本文書冒頭のコードスニペットが変更されています。
2013年11月6日以前にコードスニペットを導入されたお客様は、本文書冒頭に掲載しているコードスニペットに更新してください。

### 課金イベント

課金イベントでは課金に関する情報を `slash7.track()` の第三引き数で指定します。
各 key の値については
[Event log format](https://p-lucky.atlassian.net/wiki/display/PUB/Event+log+format)
の Payment part を参照します。

`_items` 内要素の `_name` を明示的に指定しない場合には `_item_id` の値が用いられます。
`_total_price` を明示的に指定しない場合には `_items` の各要素の `_price * _num` の合計値が用いられます。

````
slash7.track(
    "payment",
    null,
    {
        _transact_id: "transaction012345",
        _items: [
            {
                 _item_id: "ITEM_A",
                 _price: 1000,
                 _num: 1
            }
        ]
    }
);
````

イベントパラメータを指定しない場合には、第二引き数に `null` を渡します。

## ユーザIDの指定

ユーザIDを JavaScript から指定することができます。

初回はユーザIDがランダムに生成され、cookieに保存されます。
そのため、異なるブラウザやコンピュータからアクセスした場合、同一ユーザでも異なるユーザIDで記録されます。
またバックエンドでもログを記録している場合、ランダムに生成されたユーザIDとバックエンドで記録しているアプリケーションのユーザIDを照合することは困難です。
ユーザIDを JavaScript から指定することで、指定したユーザIDを cookie に保存します。
以降のイベント送信では保存されたユーザIDが使用されます。

ユーザIDを指定するには `slash7.identify()` を使います。

````
slash7.identify("user012345");
````

## ユーザ属性

ユーザ属性は `slash7.register()` で指定します。
指定されたユーザ属性は、次のイベント送信時にサーバへ送付されます。
イベントを送付しなかった場合、指定したユーザ属性は失われるので注意してください。

例えば userAgent, platform をユーザ属性として指定し、イベントを送付するには以下のようにします。

````
slash7.register({
    userAgent: window.navigator.userAgent,
    platform: window.navigator.platform
});
slash7.track("page_load");
````

## リンククリックを追跡する際の注意点

リンククリックを `slash7.track()` で追跡しようとした場合、イベントが送信されないことがあります。一見良さそうな以下のコードを見てください(jQuery を利用している前提です)。

````
// イベントが送信されないことがあるコード。 
// <a id="link" href="http://example.com"> というリンクのクリックを追跡したい。
$("#link").click(function() {
  slash7.track("click");
});
````

`slash7.track()` は非同期に実行されます。
関数を呼び出した時点でイベントの送信を開始しますが、送信が完了する前にブラウザが次のページへ移動することがあります。
このときイベントは SLASH-7 に送信されない可能性があります。

ページの移動を少し遅らせることで問題を大きく改善できます。
以下のようにページの移動を少し遅らせます。

````
$("#link").click(function(event) {
  var _this = this;
  event.preventDefault();  // クリックによるページ移動を取り消す。
  setTimeout(function() {  // 300ms 後に改めてページ移動する。
    document.location.href = _this.href;
  }, 300);
  slash7.track("click");
});
````

### フォームの送信を追跡する

フォーム送信を追跡する場合にも同様にイベントが送信されないことがあります。
以下のようにすることで問題を改善することができます。

````
// <form id="form" action="http://example.com"> というフォームの送信を追跡したい
$("#form").submit(function(event) {
  var _this = this;
  event.preventDefault();  // フォーム送信を取り消す。
  $(":input", this).attr("disabled", true);  // 入力を無効にする。
  // 300ms 後に改めてフォーム送信する。
  setTimeout(function() {
    _this.submit();
  }, 300);
  slash7.track("submit");
});
````



# Getting started

## コードスニペットの挿入

以下のコードを body tag を閉じる直前 (`</body>` の直前) に書きます。
`slash7.init()` にはあなたのプロジェクト用に発行された tracking code を渡してください。

````
var slash7=slash7||[];
(function(){var a=document.createElement("script");a.type="text/javascript";a.async=!0;a.src=("https:"===document.location.protocol?"https":"http")+"://d9nbmxmbhbtmj.cloudfront.net/v1/tracker.min.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b);for(var a=function(a){return function(){slash7.push([a].concat(Array.prototype.slice.call(arguments,0)))}},b=["init","identify","track","setUserAttribute","register"],c=0;c<b.length;c++)slash7[b[c]]=a(b[c])})();
slash7.init("[YOUR TRACKING CODE]");
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

例えば userAgent, platform をユーザ属性として指定するには以下のようにします。

````
slash7.register({
    userAgent: window.navigator.userAgent,
    platform: window.navigator.platform
});
````


(function (window, namespace, undefined) {
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }

    var $doc = window.document,
        prefix = "_s7.",
        secure = $doc.location.protocol === 'https';

    var config = {
        timeoutMs: 2 * 365 * 24 * 60 * 60 * 1000,
        path: "/"
    };


    function Cookie() {
    }

    Cookie.getDomainFragment = function () {
        return ($doc.domain && $doc.domain !== "localhost") ? ';domain=' + $doc.domain : '';
    };

    Cookie.set = function (name, value) {
        var cookieName = getCookieName(name);
        var kvFragment = cookieName + "=" + window.encodeURIComponent(value);

        var expireMs = config.timeoutMs;
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + expireMs);
        var expiresFragment = ";expires=" + expireDate.toGMTString();

        var pathFragment = ';path=' + config.path;
        var secureFragment = secure ? ';secure' : '';
        var cookieStr = kvFragment + expiresFragment + pathFragment + this.getDomainFragment() + secureFragment;
        $doc.cookie = cookieStr;
    };

    Cookie.get = function (name) {
        var cookieName = getCookieName(name);
        var pattern = new RegExp('(^|;)[ ]*' + cookieName + '=([^;]*)'),
            match = pattern.exec($doc.cookie);
        if (match) {
            return window.decodeURIComponent(match[2]);
        } else {
            return undefined;
        }
    };

    function getCookieName(baseName) {
        return prefix + baseName;
    }

    $ns.Cookie = Cookie;
}(this, "slash7"));

(function (window, namespace, undefined) {
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }

    var $doc = window.document;

    var config = {
        timeoutMs: 2 * 365 * 24 * 60 * 60 * 1000,
        prefix: "_s7.",
        path: "/"
    };

    function Cookie() {
    }

    Cookie.getDomain = function () {
        return $doc.domain;
    };

    Cookie.getKvFragment = function (name, value) {
        var cookieName = getCookieName(name);
        return cookieName + "=" + window.encodeURIComponent(value);
    };

    Cookie.getDomainFragment = function () {
        var domain = this.getDomain();
        return (domain && domain !== "localhost") ? ';domain=' + domain : '';
    };

    Cookie.getExpiresFragment = function () {
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + config.timeoutMs);
        return ";expires=" + expireDate.toGMTString();
    };

    Cookie.set = function (name, value) {
        var pathFragment = ';path=' + config.path;
        var secureFragment = $ns.Network.isSecure ? ';secure' : '';
        var cookieStr = this.getKvFragment(name, value) + this.getExpiresFragment() + pathFragment +
            this.getDomainFragment() + secureFragment;
        this.setCookie(cookieStr);
    };

    Cookie.get = function (name) {
        var cookieName = getCookieName(name);
        var pattern = new RegExp('(^|;)[ ]*' + cookieName + '=([^;]*)'),
            match = pattern.exec(this.getCookie());
        if (match) {
            return window.decodeURIComponent(match[2]);
        } else {
            return undefined;
        }
    };

    Cookie.getCookie = function () {
        return $doc.cookie;
    };

    Cookie.setCookie = function (cookieString) {
        $doc.cookie = cookieString;
    };

    function getCookieName(baseName) {
        return config.prefix + baseName;
    }

    $ns.Cookie = Cookie;
}(this, "slash7"));

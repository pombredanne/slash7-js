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

    Cookie.setDomain = function (domain) {
      config.domain = domain;
    };

    Cookie.getDomain = function () {
        return config.domain || $doc.domain;
    };

    Cookie.getKvFragment = function (name, value) {
        var cookieName = getCookieName(name);
        return cookieName + "=" + window.encodeURIComponent(value) + ":" + this.getDomain();
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
        var cookieStr = this.getKvFragment(name, value) + this.getExpiresFragment() + pathFragment +
            this.getDomainFragment();
        this.setCookie(cookieStr);
    };

    Cookie.get = function (name) {
        var cookieName = getCookieName(name);
        var cookie = this.getCookie();
        var p1 = '(^|;)[ ]*' + cookieName + '=([^;]*)',
            patternWithDomain = new RegExp(p1 + ':' + this.getDomain()),
            patternWithoutDomain = new RegExp(p1),
            match = patternWithDomain.exec(cookie) || patternWithoutDomain.exec(cookie);
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

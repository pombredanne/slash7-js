(function(window, namespace, undefined){
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }

    var cookieName = "u";

    /**
     * Generate new uid.
     */
    function genUid() {
        var now = new Date();
        // TODO randomize more
        return $ns.hash(
            (window.navigator.userAgent || '') +
                (window.navigator.platform || '') +
                now.getTime()
        ).slice(0, 16);
    }

    function User(uidType, uid, visitCount) {
        if (uidType && uid) {
            this.uidType = uidType;
            this.uid = uid;
        } else {
            this.uidType = "cookie";
            this.uid = genUid();
        }
        this.visitCount = parseInt(visitCount, 10) || 0;
        this.unsentUserAttribute = {};
    }

    var $m = User.prototype;

    $m.identify = function(userId) {
        this.uidType = "app";
        this.uid = userId;
        this.save();
    };

    $m.setUserAttribute = function(name, value) {
        if (name && name[0] !== "_") {
            this.unsentUserAttribute[name] = value;
        }
    };

    $m.popUserAttribute = function() {
        var result = this.unsentUserAttribute;
        this.unsentUserAttribute = {};
        return result;
    };

    $m.cookieString = function() {
        return this.uidType + "." + this.uid + "." + this.visitCount;
    };

    $m.save = function() {
        $ns.Cookie.set(cookieName, this.cookieString());
    };

    $m.incVisit = function() {
        this.visitCount += 1;
        this.save();
    };

    User.fromCookieString = function(str) {
        if (!str) {
            return undefined;
        }
        var ary = str.split(".");
        return new User(ary[0], ary[1], ary[2]);
    };

    User.loadCookie = function() {
        return this.fromCookieString($ns.Cookie.get(cookieName));
    };

    User.get = function() {
        var user = this.loadCookie();
        if (!user) {
            user = new User();
            user.save();
        }
        return user;
    };

    $ns.User = User;
}(this, "slash7"));

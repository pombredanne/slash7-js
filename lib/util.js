(function (window, namespace, undefined) {
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }

    $ns.util = {
        isElement: function (obj) {
            return !!(obj && obj.nodeType === 1);
        },
        isArray: Array.isArray || function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        isObject: function (obj) {
            return obj === Object(obj);
        },
        isString: function (obj) {
            return Object.prototype.toString.call(obj) === '[object String]';
        },
        isFunction: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Function]';
        },
        isNumber: function (obj) {
            return Object.prototype.toString.call(obj) === '[object Number]';
        },
        dup: function (obj) {
            // works, but low performance
            return $ns.json.parse($ns.json.stringify(obj));
        },
        valueRequired: function (obj, keys) {
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (!obj[key]) {
                    throw "Missing " + key + " in " + $ns.json.stringify(obj);
                }
            }
        }
    };
}(this, "slash7"));

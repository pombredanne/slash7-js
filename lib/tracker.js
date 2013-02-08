(function (window, namespace, undefined) {
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }


    function Tracker(code, options) {
        this.network = new $ns.Network(code, options.server);
        this.user = $ns.User.get();
    }

    var $m = Tracker.prototype;
    $m.track = function (eventName, params) {
        var dataObj = this.user.popUserAttribute();
        dataObj._app_user_id_type = this.user.uidType;
        dataObj._app_user_id = this.user.uid;
        dataObj._event_name = eventName;
        if (params) {
            dataObj._event_params = params;
        }
        this.network.send(dataObj);
    };

    function track(eventName, params) {
        $ns.tracker.track(eventName, params);
    }

    function init(code, options) {
        $ns.tracker = new Tracker(code, options);
        $ns.tracker.user.incVisit();
    }

    function identify(userId) {
        $ns.tracker.user.identify(userId);
    }

    function setUserAttribute(name, value) {
        $ns.tracker.user.setUserAttribute(name, value);
    }

    function register(attrs) {
        for (var attr in attrs) {
            setUserAttribute(attr, attrs[attr]);
        }
    }

    $ns.init = init;
    $ns.track = track;
    $ns.identify = identify;
    $ns.setUserAttribute = setUserAttribute;
    $ns.register = register;

    function apply() {
        var i, f, parameterArray;

        for (i = 0; i < arguments.length; i += 1) {
            parameterArray = arguments[i];
            f = parameterArray.shift();

            if ($ns.util.isString(f)) {
                $ns[f].apply($ns, parameterArray);
            } else {
                f.apply($ns, parameterArray);
            }
        }
    }

    // Wait for finishing defining $ns
    setTimeout(function() {
        for (var i = 0; i < $ns.length; i++) {
            apply($ns[i]);
        }
    }, 0);

}(this, "slash7"));

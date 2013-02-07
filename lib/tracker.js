(function(window, namespace, undefined){
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }

    function Tracker(code, baseUrl) {
        this.network = new $ns.Network(code, baseUrl);
        this.user = $ns.User.get();
    }

    var $m = Tracker.prototype;
    $m.track = function(eventName, params) {
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

    function init(code, baseUrl) {
        $ns.tracker = new Tracker(code, baseUrl);
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

}(this, "slash7"));

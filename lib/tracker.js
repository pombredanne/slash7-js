(function (window, namespace, undefined) {
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }

    function Tracker(code, options) {
        options = options || {};
        this.network = new $ns.Network(code, options.server);

        if (options.domain) {
          $ns.Cookie.setDomain(
              (options.domain.indexOf(".") === 0) ? options.domain : ("." + options.domain)
          );
        }
        this.user = $ns.User.get();
    }

    var $m = Tracker.prototype;
    $m.track = function (eventName, params, payment) {
        var dataObj = this.buildEvent(eventName, params, payment);
        this.network.send(dataObj);
    };

    $m.buildEvent = function (eventName, params, payment) {
        var dataObj = this.user.popUserAttribute();
        dataObj._app_user_id_type = this.user.uidType;
        dataObj._app_user_id = this.user.uid;
        dataObj._event_name = eventName;
        if (params) {
            dataObj._event_params = params;
        }
        if (payment) {
            var fixedPayment = Tracker.fixupPayment(payment);
            var paymentKeys = ['_transact_id', '_items', '_total_price'];
            for (var i = 0; i < paymentKeys.length; i++) {
                var key = paymentKeys[i];
                dataObj[key] = fixedPayment[key];
            }
        }
        return dataObj;
    };

    Tracker.fixupPayment = function (payment) {
        payment = $ns.util.dup(payment);
        $ns.util.valueRequired(payment, ['_transact_id', '_items']);
        if (payment._items.length < 1) {
            throw "_items should contain 1 or more items";
        }
        var priceSum = 0;
        for (var i = 0; i < payment._items.length; i++) {
            var item = payment._items[i];
            $ns.util.valueRequired(item, ['_item_id', '_price', '_num']);
            if (!item._name) {
                item._name = item._item_id;
            }
            priceSum += item._price * item._num;
        }
        if (!payment._total_price) {
            payment._total_price = priceSum;
        }
        return payment;
    };

    function track(eventName, params, payment) {
        $ns.tracker.track(eventName, params, payment);
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

    $ns.Tracker = Tracker;
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

    for (var i = 0; i < $ns.length; i++) {
        apply($ns[i]);
    }

}(this, "slash7"));

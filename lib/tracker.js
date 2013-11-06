(function (window, namespace, undefined) {
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }

    /**
     * Tracker
     * @constructor
     */
    function Tracker(code, options) {
        var domainWithDot, samplingRate;
        options = options || {};
        this.network = new $ns.Network(code, options.server);

        if (options.domain) {
            if (options.domain.charAt(0) === ".") {
                domainWithDot = options.domain;
            } else {
                domainWithDot = "." + options.domain;
            }
            $ns.Cookie.setDomain(domainWithDot);
        }

        // set samplingRate
        if (typeof options.samplingRate === 'number') {
            samplingRate = options.samplingRate;
        } else {
            samplingRate = 1;
        }
        this.setSamplingRate(samplingRate);

        this.user = $ns.User.get();
    }

    var $m = Tracker.prototype;
    $m.track = function (eventName, params, payment) {
        var dataObj = this.buildEvent(eventName, params, payment);
        if (this.shouldSample()) {
            this.network.send(dataObj);
        }
    };

    /**
     * Whether user's events should be recorded.
     * It always returns true when sampling rate is 1.
     * It always returns false when sampling rate is 0.
     */
    $m.shouldSample = function () {
        var granularity = 1000;
        // [0, granularity)
        var userVal =  Math.abs(this.user.hash()) % granularity;
        // [0, granularity]
        var samplingRange = this.samplingRate * granularity;
        return userVal < samplingRange;
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

    /**
     * Set sampling rate.
     * Sampling will be done by users basis.
     *
     * @param rate {number} sampling rate: [0, 1].
     *    0 means no user will be recorded.
     *    1 means all users will be recorded.
     */
    $m.setSamplingRate = function (rate) {
        if (rate < 0 || rate > 1) {
            throw 'setSamplingRate(): rate must be between [0, 1]';
        }
        this.samplingRate = rate;
    };

    /**
     * Track page_load event.
     */
    $m.trackPageLoad = function () {
        var refererDomain, refererA;
        if (window.document.referrer && window.document.referrer.indexOf("://") > 0) {
            refererA = window.document.createElement('a');
            refererA.href = window.document.referrer;
            refererDomain = refererA.hostname;
        } else {
            refererDomain = "";
        }

        var query, searchWithoutQ;
        if (window.location.search) {
            searchWithoutQ = window.location.search.substr(1);
            try {
                query = window.decodeURIComponent(searchWithoutQ);
            } catch (e) {
                // fail to decode. Use raw string.
                query = searchWithoutQ;
            }
        } else {
            query = "";
        }

        this.track(
            'page_load',
            {
                domain: window.location.hostname,
                path: window.location.pathname,
                query: query,
                referer: window.document.referrer,
                referer_domain: refererDomain,
                platform: window.navigator.platform,
                user_agent: window.navigator.userAgent
            }
        );
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

    function trackPageLoad() {
        $ns.tracker.trackPageLoad();
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

    // expose to slash7
    $ns.Tracker = Tracker;
    $ns.init = init;
    $ns.trackPageLoad = trackPageLoad;
    $ns.track = track;
    $ns.identify = identify;
    $ns.setUserAttribute = setUserAttribute;
    $ns.register = register;
    $ns.version = "1.1.0";

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

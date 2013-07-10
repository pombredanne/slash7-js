(function ($ns) {
    var tracker, code = "THE_CODE";
    module("Tracker", {
        setup: function () {
            tracker = new $ns.Tracker(code);
        }
    });

    test("constructor", function () {
        equal(tracker.network.code, code);
        equal(tracker.network.baseUrl, "http://tracker.slash-7.com");
        ok(tracker.user);

        tracker = new $ns.Tracker(code, {server: "example.com"});
        equal(tracker.network.code, code);
        equal(tracker.network.baseUrl, "http://example.com");
        ok(tracker.user);
    });

    test("init()", function () {
        $ns.init(code);
        ok($ns.tracker);
    });

    test("init() with domain", function () {
        $ns.init(code, { domain: ".example.com"});
        ok($ns.tracker);
        equal($ns.Cookie.getDomain(), ".example.com");
    });

    test("track()", function () {
        expect(0);
        $ns.init(code);
        var mock = sinon.mock($ns.tracker);
        mock.expects("track").once();
        $ns.track("event1");
        mock.verify();
    });

    test("register()", function () {
        expect(0);
        $ns.init(code);
        var mock = sinon.mock($ns.tracker.user);
        mock.expects("setUserAttribute").exactly(3);
        $ns.register({
            attr1: "abc",
            attr2: "def",
            attr3: "ghi"
        });
        mock.verify();
    });

    test("identify()", function () {
        expect(0);
        $ns.init(code);
        var mock = sinon.mock($ns.tracker.user);
        mock.expects("identify").once();
        $ns.identify("user01234");
        mock.verify();
    });

    test(".fixupPayment()", function () {
        var fixed;

        function assertException(payment) {
            raises(function () {
                $ns.Tracker.fixupPayment(payment)
            });
        }

        assertException({});
        assertException({_transact_id: 'abc'});
        assertException({_transact_id: 'abc', _items: []});
        assertException({_transact_id: 'abc', _items: [
            {_item_id: 'abc'}
        ]});
        assertException({_transact_id: 'abc', _items: [
            {_item_id: 'abc', _price: 10}
        ]});

        // _total_price and _name will be completed
        fixed = $ns.Tracker.fixupPayment({_transact_id: 'abc', _items: [
            {_item_id: 'abc', _price: 10, _num: 3}
        ]});
        deepEqual(fixed, {_transact_id: 'abc', _total_price: 30, _items: [
            {_item_id: 'abc', _name: 'abc', _price: 10, _num: 3}
        ]});

        // _total_price is not overwritten
        fixed = $ns.Tracker.fixupPayment({_transact_id: 'abc', _total_price: 25, _items: [
            {_item_id: 'abc', _price: 10, _num: 3}
        ]});
        deepEqual(fixed, {_transact_id: 'abc', _total_price: 25, _items: [
            {_item_id: 'abc', _name: 'abc', _price: 10, _num: 3}
        ]});

        // _name is not overwritten
        fixed = $ns.Tracker.fixupPayment({_transact_id: 'abc', _items: [
            {_item_id: 'abc', _name: 'my name', _price: 10, _num: 3}
        ]});
        deepEqual(fixed, {_transact_id: 'abc', _total_price: 30, _items: [
            {_item_id: 'abc', _name: 'my name', _price: 10, _num: 3}
        ]});
    });

    test('#track()', function () {
        var mock = sinon.mock(tracker.network);
        mock.expects('send').once();
        tracker.track('event');
        mock.verify();
        expect(0);
    });

    test('#track() with params', function () {
        var mock = sinon.mock(tracker.network);
        mock.expects('send').once();
        tracker.track('event', {p1: 'v1', p2: 'v2'});
        mock.verify();
        expect(0);
    });

    test('#track() with payment', function () {
        var mock = sinon.mock(tracker.network);
        mock.expects('send').once();
        tracker.track('event', null, {
            _transact_id: "transaction012345",
            _items: [
                {
                    _item_id: "ITEM_A",
                    _price: 1000,
                    _num: 1
                }
            ]
        });
        mock.verify();
        expect(0);
    });

    test('#track() with param and payment', function () {
        var mock = sinon.mock(tracker.network);
        mock.expects('send').once();
        tracker.track('event', {p1: 'v1', p2: 'v2'}, {
            _transact_id: "transaction012345",
            _items: [
                {
                    _item_id: "ITEM_A",
                    _price: 1000,
                    _num: 1
                }
            ]
        });
        mock.verify();
        expect(0);
    });

    test('#buildEvent()', function () {
        var event = tracker.buildEvent('event', {p1: 'v1', p2: 'v2'}, {
            _transact_id: "transaction012345",
            _items: [
                {
                    _item_id: "ITEM_A",
                    _price: 1000,
                    _num: 1
                }
            ]
        });
        deepEqual(event, {
            _app_user_id: tracker.user.uid,
            _app_user_id_type: tracker.user.uidType,
            _event_name: 'event',
            _event_params: {p1: 'v1', p2: 'v2'},
            _transact_id: "transaction012345",
            _items: [
                {
                    _item_id: "ITEM_A",
                    _name: 'ITEM_A',
                    _price: 1000,
                    _num: 1
                }
            ],
            _total_price: 1000
        });
    });

}(slash7));

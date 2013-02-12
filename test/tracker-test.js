(function ($ns) {
    var code = "THE_CODE";
    module("Tracker");

    test("constructor", function () {
        var tracker = new $ns.Tracker(code);
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

    test("track()", function () {
        expect(0);
        $ns.init(code);
        var mock = sinon.mock($ns.tracker);
        mock.expects("track").once();
        $ns.track("event1")
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
}(slash7));

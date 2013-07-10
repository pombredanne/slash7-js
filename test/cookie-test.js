(function ($ns) {
    var domainStub, mock;
    module("Cookie", {
        setup: function () {
            domainStub = sinon.stub($ns.Cookie, "getDomain");
            mock = sinon.mock($ns.Cookie);
        },
        teardown: function () {
            domainStub.restore();
            mock.restore();
        }
    });

    test("getDomainFragment() for localhost returns empty string", function () {
        domainStub.returns("localhost");
        equal($ns.Cookie.getDomainFragment(), "");
    });

    test("getDomainFragment() for example.com returns example.com", function () {
        domainStub.returns("example.com");
        equal($ns.Cookie.getDomainFragment(), ";domain=example.com");
    });

    test("getDomainFragment() returns config.domain", function () {
        $ns.Cookie.setDomain(".example.com");
        domainStub.restore();
        equal($ns.Cookie.getDomainFragment(), ";domain=.example.com");
    });

    test("getExpiresFragment()", function () {
        var expires = $ns.Cookie.getExpiresFragment();
        var re = /^;expires=\w{3}, \d{1,2} \w{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/;
        ok(re.test(expires));
    });

    test("getKvFragment()", function () {
        domainStub.returns("example.com");
        equal($ns.Cookie.getKvFragment("key", "value"), "_s7.key=value:example.com");
        equal($ns.Cookie.getKvFragment("key", "=#,;"), "_s7.key=%3D%23%2C%3B:example.com");
    });

    test("set()", function() {
        domainStub.returns("example.com");
        expect(0);
        mock.expects("setCookie").withArgs(sinon.match(/^_s7.key=value:example.com;expires=/)).once();
        $ns.Cookie.set("key", "value");
        mock.verify();
    });

    test("get()", function() {
        domainStub.returns("example.com");
        mock.expects("getCookie").returns("abc=def;_s7.key=value:example.com;xyz=123").once();
        equal($ns.Cookie.get("key"), "value");
        mock.verify();
    });

    test("get()", function() {
        mock.expects("getCookie").returns("abc=def;_s7.xyz=123").once();
        equal($ns.Cookie.get("xyz"), "123");
        mock.verify();
    });

    test("get()", function() {
        domainStub.returns("example.com");
        mock.expects("getCookie").returns("abc=def;_s7.key=value1;_s7.key=value2:example.com;xyz=123").once();
        equal($ns.Cookie.get("key"), "value2");
        mock.expects("getCookie").returns("abc=def;_s7.key=value1:example.com;_s7.key=value2;xyz=123").once();
        equal($ns.Cookie.get("key"), "value1");
        mock.verify();
    });

    test("get()", function() {
        mock.expects("getCookie").returns("abc=def;xyz=123").once();
        equal($ns.Cookie.get("key"), undefined);
        mock.verify();
    });
}(slash7))

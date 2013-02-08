(function () {
    module("User");

    test("fromCookieString", function () {
        var u = slash7.User.fromCookieString("1.web.abc.123");
        equal(u.uidType, "web");
        equal(u.uid, "abc");
        equal(u.visitCount, 123);
    });

    test("cookieString", function () {
        var u = new slash7.User("web", "abc", 123);
        equal(u.cookieString(), "1.web.abc.123");
    });

    test("get new", function () {
        var stub = sinon.stub(slash7.Cookie, "get");
        var u = slash7.User.get();
        equal(u.uid.length, 16);
        equal(u.visitCount, 0);
        stub.restore();
    });

    test("get cookie", function () {
        var stub = sinon.stub(slash7.Cookie, "get").returns("1.web.abc.123");
        var u = slash7.User.get();
        equal(u.uid, "abc");
        equal(u.visitCount, 123);
        stub.restore();
    });

    test("setUserAttribute", function () {
        var u = slash7.User.get();
        u.setUserAttribute("abc", "def");
        deepEqual(u.unsentUserAttribute, {"abc": "def"});
    });

    test("setUserAttribute _var", function () {
        var u = slash7.User.get();
        u.setUserAttribute("_abc", "def");
        deepEqual(u.unsentUserAttribute, {});
    })

    test("identify", function () {
        var u = slash7.User.get();
        u.identify("user0123");
        equal(u.uidType, "app");
        equal(u.uid, "user0123");
    });
}());

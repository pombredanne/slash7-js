(function(){
    module("User");

    test("fromCookieString", function() {
        var u = slash7.User.fromCookieString("web.abc.123");
        equal(u.uidType, "web");
        equal(u.uid, "abc");
        equal(u.visitCount, 123);
    });

    test("cookieString", function(){
        var u = new slash7.User("web", "abc", 123);
        equal(u.cookieString(), "web.abc.123");
    });

    test("get new", function(){
        var stub = sinon.stub(slash7.Cookie, "get");
        var u =slash7.User.get();
        equal(u.uid.length, 16);
        equal(u.visitCount, 0);
        stub.restore();
    });

    test("get cookie", function(){
        var stub = sinon.stub(slash7.Cookie, "get").returns("web.abc.123");
        var u = slash7.User.get();
        equal(u.uid, "abc");
        equal(u.visitCount, 123);
        stub.restore();
    });

}());

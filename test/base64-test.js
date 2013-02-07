(function ($ns) {
    module("Base64");

    test("encode", function () {
        var encoded = $ns.Base64.encode("abcde")
        equal(encoded, "YWJjZGU=")
        equal($ns.Base64.decode(encoded), "abcde")
    });

    test("encodeURI", function () {
        var encoded = $ns.Base64.encodeURI("abcde")
        equal(encoded, "YWJjZGU")
        equal($ns.Base64.decode(encoded), "abcde")
    });
}(slash7));

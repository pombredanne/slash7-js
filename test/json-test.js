(function ($ns) {
    module("JSON");

    test("stringify", function () {
        equal($ns.json.stringify({a: 123}), '{"a":123}')
    });
}(slash7));

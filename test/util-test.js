(function ($ns) {
    module("Util");

    test('dup', function() {
        var obj = {a: {b: 1, c: "def"}};
        var dupped = $ns.util.dup(obj);
        notStrictEqual(obj, dupped);
        deepEqual(obj, dupped);
    });

    test('escapeRegExpMeta', function() {
      var str = "$^\\/()|?+*[]{}.-";
      equal($ns.util.escapeRegExp(str) , "\\$\\^\\\\\\/\\(\\)\\|\\?\\+\\*\\[\\]\\{\\}\\.\\-");
    });
}(slash7));

(function(window, namespace, undefined) {
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }

    /** deep clone object */
    function dup(obj) {
        return $ns.json.parse($ns.json.stringify(obj));
    }

    $ns.dup = dup;
}(this, "slash7"));

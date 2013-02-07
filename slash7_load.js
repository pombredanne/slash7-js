var slash7 = slash7 || [];

slash7.load = function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = ('https:' === document.location.protocol ? 'https' : 'http') +
        '://cdn.slash-7.com/v1/tracker.min.js';
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
    var methodFactory = function (type) {
        return function () {
            slash7.push([type].concat(Array.prototype.slice.call(arguments, 0)));
        };
    };
    var methods = ['init', 'identify', 'track', 'setUserAttribute', 'register'];
    for (var i = 0; i < methods.length; i++) {
        slash7[methods[i]] = methodFactory(methods[i]);
    }
};
slash7.load();

// compress with http://closure-compiler.appspot.com/ , optimization level Simple
var slash7 = slash7 || [];
(function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = ('https:' === document.location.protocol ? 'https' : 'http') +
        '://d9nbmxmbhbtmj.cloudfront.net/v1/slash7.min.js';
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
    var methodFactory = function (type) {
        return function () {
            slash7.push([type].concat(Array.prototype.slice.call(arguments, 0)));
        };
    };
    var methods = ['init', 'identify', 'track', 'register'];
    for (var i = 0; i < methods.length; i++) {
        slash7[methods[i]] = methodFactory(methods[i]);
    }
}());

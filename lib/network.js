(function (window, namespace, undefined) {
    var $ns = window[namespace];
    if (!$ns) {
        $ns = {};
        window[namespace] = $ns;
    }

    var baseUrl = "http://tracker-staging-int.slash-7.com";

    var encodeObj = function (dataObj) {
        return $ns.Base64.encodeURI($ns.json.stringify(dataObj))
    };


    function Network(code) {
        this.code = code;
    }

    // prototype alias to define methods
    var $m = Network.prototype;

    $m.trackEndpoint = function () {
        return "/track/" + this.code;
    };

    $m.trackUrl = function () {
        return baseUrl + this.trackEndpoint();
    };

    $m.getImage = function (dataObj) {
        // TODO implement here
        /*
         var img = new Image(1, 1);
         img.onload = function () {
         };
         img.src = ""
         */
    };

    /**
     * Get xhr or null
     */
    $m.xhr = function () {
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new window.XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
        }
        return xhr;
    };

    /**
     * Send an object to SLASH-7.
     */
    $m.send = function (dataObj) {
        var self = this;
        try {
            var xhr = this.xhr();
            if (xhr !== null) {
                xhr.open("POST", this.trackUrl(), true);
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status !== 200) {
                        self.getImage(dataObj);
                    }
                };
                xhr.setRequestHeader(
                    "Content-Type",
                    'application/x-www-form-urlencoded; charset=UTF-8'
                );
                xhr.send("data=" + encodeObj(dataObj));
            } else {
                this.getImage(dataObj)
            }
        } catch (e) {
            this.getImage(dataObj)
        }
    };
    $ns.Network = Network;
}(this, "s7tr"));
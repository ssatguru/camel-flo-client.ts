define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RuntimeService = (function () {
        function RuntimeService($http, $q, $timeout, $log) {
            this.$http = $http;
            this.$q = $q;
            this.$timeout = $timeout;
            this.$log = $log;
        }
        RuntimeService.prototype.deployFlo = function (flowString) {
            console.log('deployFlo');
            console.log(flowString);
            this.$http.get('/url/start').then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.log(response);
            });
        };
        RuntimeService.prototype.saveFlo = function () {
            console.log('saveFlo');
        };
        RuntimeService.prototype.saveFloAs = function () {
            console.log('saveFloAs');
        };
        return RuntimeService;
    }());
    exports.RuntimeService = RuntimeService;
});

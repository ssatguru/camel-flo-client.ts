/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import * as angular from "angular";

export class RuntimeService {

    private $http: angular.IHttpService;
    private $q: angular.IQService;
    private $timeout: angular.ITimeoutService;
    private $log: angular.ILogService;
   
    constructor($http: angular.IHttpService, $q: angular.IQService, $timeout: angular.ITimeoutService, $log: angular.ILogService) {
        this.$http = $http;
        this.$q = $q;
        this.$timeout = $timeout;
        this.$log = $log;
    }

    public deployFlo(flowString: String) {
        console.log('deployFlo');
        console.log(flowString);
        this.$http.get('/url/start').then(
            function successCallback(response) {
                console.log(response);
            },
            function errorCallback(response) {
                console.log(response);
            });
    }

    public saveFlo() {
        console.log('saveFlo');
    }

    public saveFloAs() {
        console.log('saveFloAs');
    }

}


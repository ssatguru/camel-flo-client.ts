define(["require", "exports", "angular", "./MetamodelService", "./RenderService", "./EditorService", "./RuntimeService"], function (require, exports, angular, MetamodelService_1, RenderService_1, EditorService_1, RuntimeService_1) {
    "use strict";
    var CamelFloClient = (function () {
        function CamelFloClient() {
        }
        CamelFloClient.start = function () {
            var app = angular.module('floSampleApp', ['spring.flo']);
            app.service('SampleMetamodelService', ['$http', '$q', '$timeout', '$log', 'MetamodelUtils', MetamodelService_1.MetamodelService]);
            app.service('SampleRenderService', ['$log', RenderService_1.RenderService]);
            app.service('SampleEditorService', ['$log', EditorService_1.EditorService]);
            app.service('SampleRuntimeService', ['$http', '$q', '$timeout', '$log', RuntimeService_1.RuntimeService]);
            angular.bootstrap(document, ['floSampleApp']);
        };
        return CamelFloClient;
    }());
    return CamelFloClient;
});

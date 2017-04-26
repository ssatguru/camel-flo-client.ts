define(["require", "exports", "./GraphToText", "./TextToGraph", "json5", "text!metamodel-sample.json"], function (require, exports, GraphToText_1, TextToGraph_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MetamodelService = (function () {
        function MetamodelService($http, $q, $timeout, $log, metamodelUtils) {
            this.$http = $http;
            MetamodelService.$q = $q;
            this.$timeout = $timeout;
            this.$log = $log;
            MetamodelService.metamodelUtils = metamodelUtils;
            this.grpToText = new GraphToText_1.GraphToText();
        }
        MetamodelService.createMetadata = function (entry) {
            var props = {};
            if (Array.isArray(entry.properties)) {
                entry.properties.forEach(function (property) {
                    if (!property.id) {
                        property.id = property.name;
                    }
                    props[property.id] = property;
                });
            }
            entry.properties = props;
            return {
                name: entry.name,
                group: entry.group,
                icon: entry.icon,
                constraints: entry.constraints,
                description: entry.description,
                metadata: entry.metadata,
                properties: entry.properties,
                get: function (property) {
                    var deferred = MetamodelService.$q.defer();
                    if (entry.hasOwnProperty(property)) {
                        deferred.resolve(entry[property]);
                    }
                    else {
                        deferred.reject();
                    }
                    return deferred.promise;
                }
            };
        };
        MetamodelService.prototype.load = function () {
            var metamodelData = JSON5.parse(require('text!metamodel-sample.json'));
            var deferred = MetamodelService.$q.defer();
            var newData = {};
            metamodelData.forEach(function (data) {
                var metadata = MetamodelService.createMetadata(data);
                if (!newData[metadata.group]) {
                    newData[metadata.group] = {};
                }
                newData[metadata.group][metadata.name] = metadata;
            });
            this.metamodel = newData;
            deferred.resolve(this.metamodel);
            this.request = deferred.promise;
            return this.request;
        };
        MetamodelService.prototype.graphToText = function (flo, definition) {
            definition.text = this.grpToText.convert(flo.getGraph());
        };
        MetamodelService.prototype.textToGraph = function (flo, definition) {
            flo.getGraph().clear();
            this.load().then(function (metamodel) {
                TextToGraph_1.TextToGraph.convert(definition.text, flo, metamodel, MetamodelService.metamodelUtils);
                flo.performLayout();
                flo.fitToPage();
            });
        };
        return MetamodelService;
    }());
    exports.MetamodelService = MetamodelService;
});


import { GraphToText } from "./GraphToText";
import { TextToGraph } from "./TextToGraph";
import * as angular from "angular";
import "json5";
import "text!metamodel-sample.json" ;

export class MetamodelService {
    
    private $http: angular.IHttpService;
    private  $q: angular.IQService;
    private $timeout: angular.ITimeoutService;
    private $log: angular.ILogService;
    private  metamodelUtils;
    private metamodel;

    // Internally stored metamodel load promise
    private request;
    
    private grpToText:GraphToText;
    
    constructor($http, $q, $timeout, $log, metamodelUtils) {
        this.$http = $http;
        this.$q = $q;
        this.$timeout = $timeout;
        this.$log = $log;
        this.metamodelUtils = metamodelUtils;
       this.grpToText = new GraphToText();
    }

    /**
     * Helper that goes from basic JSON to a lazy getter structure. Useful when the
     * metamodel is 'cheap' to build. If it is costly to discover the actual properties
     * the getter may be more complex (e.g. make a REST request).
     */
    private createMetadata(entry) {
        var that=this;
        var props = {};
        if (Array.isArray(entry.properties)) {
            entry.properties.forEach(function(property) {
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
            get: function(property) {
                var deferred = that.$q.defer();
                if (entry.hasOwnProperty(property)) {
                    deferred.resolve(entry[property]);
                } else {
                    deferred.reject();
                }
                return deferred.promise;
            }
        };
    }

    public load() {
        // COULDDO: to cache the result here, check result before doing this processing
        // and simply return it if it is set. If doing that may want to override refresh
        // in this service
        var that = this;
        var metamodelData = JSON5.parse(require('text!metamodel-sample.json'));
        var deferred = this.$q.defer();
        var newData = {};
        metamodelData.forEach(function(data) {
            var metadata = that.createMetadata(data);
            if (!newData[metadata.group]) {
                newData[metadata.group] = {};
            }
            newData[metadata.group][metadata.name] = metadata;
        });
        this.metamodel = newData;
        deferred.resolve(this.metamodel);
        this.request = deferred.promise;
        return this.request;
    }

    public graphToText(flo, definition) {
        definition.text = this.grpToText.convert(flo.getGraph());
    }

    public textToGraph(flo, definition) {
        var that=this;
        // TODO perhaps push these flo operations into the 'caller' to make this simpler
        flo.getGraph().clear();
        this.load().then(function(metamodel) {
            TextToGraph.convert(definition.text, flo, metamodel, that.metamodelUtils);
            flo.performLayout();
            flo.fitToPage();
        });
    }





}



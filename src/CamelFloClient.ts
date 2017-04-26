import * as angular from "angular";
import {MetamodelService} from "./MetamodelService";
import {RenderService} from "./RenderService";
import {EditorService} from "./EditorService";
import {RuntimeService} from "./RuntimeService";

class CamelFloClient{
    
    public static start(){
            let  app = angular.module('floSampleApp', ['spring.flo']);
            
            app.service('SampleMetamodelService',['$http', '$q', '$timeout', '$log', 'MetamodelUtils', MetamodelService]);
            app.service('SampleRenderService', ['$log',RenderService]);
            app.service('SampleEditorService', ['$log',EditorService]);
            app.service('SampleRuntimeService',['$http', '$q', '$timeout', '$log',RuntimeService]);
            
            angular.bootstrap(document, ['floSampleApp']);

    }
    
}

export = CamelFloClient;



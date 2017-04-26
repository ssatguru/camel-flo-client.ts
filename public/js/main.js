/*
 * Copyright 2016 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author Alex Boyko
 * @author Andy Clement
 */
requirejs.config({
    baseUrl: 'js',
    paths: {
        joint: '/bower_components/jointjs/dist/joint.min',
        backbone: '/bower_components/backbone/backbone-min',
        domReady: '/bower_components/domReady/domReady',
        angular: '/bower_components/angular/angular',
        jquery: '/bower_components/jquery/dist/jquery.min',
        bootstrap: '/bower_components/bootstrap/dist/js/bootstrap.min',
        lodash: '/bower_components/lodash/lodash.min', // lodash.compat
        dagre: '/bower_components/dagre/dist/dagre.core.min',
        graphlib: '/bower_components/graphlib/dist/graphlib.core.min',
        text: '/bower_components/text/text',
        /* flo :     '/bower_components/spring-flo/dist/spring-flo.min',*/
        flo: '/lib/spring-flo/spring-flo',
        json5: '/bower_components/json5/lib/json5'
    },
    map: {
        '*': {
            // Backbone requires underscore. This forces requireJS to load lodash instead:
            'underscore': 'lodash'
        }
    },
    packages: [
        {
            name: 'codemirror',
            location: '../lib/codemirror',
            main: 'lib/codemirror'
        }
    ],
    shim: {
        angular: {
            deps: ['bootstrap'],
            exports: 'angular'
        },
        bootstrap: {
            deps: ['jquery']
        },
        graphlib: {
            deps: ['underscore']
        },
        dagre: {
            deps: ['graphlib', 'underscore']
        },
        joint: {
            deps: ['jquery', 'underscore', 'backbone'],
        },
        underscore: {
            exports: '_'
        },
        flo: {
            deps: ['angular', 'jquery', 'joint', 'underscore']
        }
    }
});

requirejs(["CamelFloClient","flo"],function(CamelFloClient){
        CamelFloClient.start();
});
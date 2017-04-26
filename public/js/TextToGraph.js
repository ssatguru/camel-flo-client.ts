define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TextToGraph = (function () {
        function TextToGraph() {
        }
        TextToGraph.convert = function (input, flo, metamodel, metamodelUtils) {
            var trimmed = input.trim();
            if (trimmed.length === 0) {
                return;
            }
            var lines = trimmed.split('\n');
            for (var l = 0; l < lines.length; l++) {
                var line = lines[l];
                var elements = line.split('>');
                var lastNode = null;
                for (var e = 0; e < elements.length; e++) {
                    var element = elements[e].trim();
                    var startOfProps = element.indexOf(' ');
                    var name = element;
                    var properties = {};
                    if (startOfProps !== -1) {
                        name = element.substring(0, startOfProps);
                        var propValues = element.substring(startOfProps + 1).trim().split(' ');
                        for (var p = 0; p < propValues.length; p++) {
                            var propValue = propValues[p].trim();
                            if (propValue.length === 0) {
                                continue;
                            }
                            var equalsIndex = propValue.indexOf('=');
                            var key = propValue.substring(2, equalsIndex);
                            var value = propValue.substring(equalsIndex + 1);
                            properties[key] = value;
                        }
                    }
                    var group = metamodelUtils.matchGroup(metamodel, name, 1, 1);
                    var newNode = flo.createNode(metamodelUtils.getMetadata(metamodel, name, group), properties);
                    newNode.attr('.label/text', name);
                    if (lastNode) {
                        flo.createLink({ 'id': lastNode.id, 'selector': '.output-port' }, { 'id': newNode.id, 'selector': '.input-port' });
                    }
                    lastNode = newNode;
                }
            }
        };
        ;
        return TextToGraph;
    }());
    exports.TextToGraph = TextToGraph;
});

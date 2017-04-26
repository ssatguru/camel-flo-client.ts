define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GraphToText = (function () {
        function GraphToText() {
        }
        GraphToText.nextLink = function () {
            var indegree = Number.MAX_VALUE;
            var currentBest;
            for (var id in GraphToText.linksToVisit) {
                var link = GraphToText.g.getCell(id);
                var source = GraphToText.g.getCell(link.get('source').id);
                var currentInDegree = GraphToText.nodesInDegrees[source.get('id')];
                if (currentInDegree === 0) {
                    return GraphToText.visit(link);
                }
                else if (indegree > currentInDegree) {
                    indegree = currentInDegree;
                    currentBest = link;
                }
            }
            if (currentBest) {
                return GraphToText.visit(currentBest);
            }
        };
        GraphToText.visit = function (e) {
            if (e.isLink()) {
                delete GraphToText.linksToVisit[e.get('id')];
                GraphToText.nodesInDegrees[e.get('target').id]--;
                GraphToText.numberOfLinksToVisit--;
            }
            else {
                delete GraphToText.nodesToVisit[e.get('id')];
                GraphToText.numberOfNodesToVisit--;
            }
            return e;
        };
        GraphToText.init = function (graph) {
            GraphToText.numberOfLinksToVisit = 0;
            GraphToText.numberOfNodesToVisit = 0;
            GraphToText.linksToVisit = {};
            GraphToText.nodesToVisit = {};
            GraphToText.nodesInDegrees = {};
            GraphToText.g = graph;
            GraphToText.g.getElements().forEach(function (element) {
                if (element.attr('metadata/name')) {
                    GraphToText.nodesToVisit[element.get('id')] = element;
                    var indegree = 0;
                    GraphToText.g.getConnectedLinks(element, { inbound: true }).forEach(function (link) {
                        if (link.get('source') && link.get('source').id && GraphToText.g.getCell(link.get('source').id) &&
                            GraphToText.g.getCell(link.get('source').id).attr('metadata/name')) {
                            GraphToText.linksToVisit[link.get('id')] = link;
                            GraphToText.numberOfLinksToVisit++;
                            indegree++;
                        }
                    });
                    GraphToText.nodesInDegrees[element.get('id')] = indegree;
                    GraphToText.numberOfNodesToVisit++;
                }
            });
        };
        GraphToText.chainToText = function (link) {
            var text = '';
            var source = GraphToText.g.getCell(link.get('source').id);
            text += GraphToText.nodeToText(source, true);
            while (link) {
                var target = GraphToText.g.getCell(link.get('target').id);
                text += ' > ';
                text += GraphToText.nodeToText(target, false);
                link = null;
                var outgoingLinks = GraphToText.g.getConnectedLinks(target, { outbound: true });
                for (var i = 0; i < outgoingLinks.length && !link; i++) {
                    if (GraphToText.linksToVisit[outgoingLinks[i].get('id')]) {
                        source = target;
                        link = GraphToText.visit(outgoingLinks[i]);
                    }
                }
            }
            return text;
        };
        GraphToText.nodeToText = function (element, junk) {
            var text = '';
            var props = element.attr('props');
            if (!element) {
                return;
            }
            text += element.attr('metadata/name');
            if (props) {
                Object.keys(props).forEach(function (propertyName) {
                    text += ' --' + propertyName + '=' + props[propertyName];
                });
            }
            GraphToText.visit(element);
            return text;
        };
        GraphToText.appendChainText = function (text, chainText) {
            if (chainText) {
                if (text) {
                    text += '\n';
                }
                text += chainText;
            }
            return text;
        };
        GraphToText.convert = function (g) {
            var text = '';
            var chainText;
            var id;
            GraphToText.init(g);
            while (GraphToText.numberOfLinksToVisit) {
                chainText = GraphToText.chainToText(GraphToText.nextLink());
                text = GraphToText.appendChainText(text, chainText);
            }
            for (id in GraphToText.nodesToVisit) {
                chainText = GraphToText.nodeToText(GraphToText.nodesToVisit[id], true);
                text = GraphToText.appendChainText(text, chainText);
            }
            return text;
        };
        ;
        return GraphToText;
    }());
    exports.GraphToText = GraphToText;
});

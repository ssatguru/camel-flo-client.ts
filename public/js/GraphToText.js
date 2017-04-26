define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GraphToText = (function () {
        function GraphToText() {
        }
        GraphToText.prototype.nextLink = function () {
            var indegree = Number.MAX_VALUE;
            var currentBest;
            for (var id in this.linksToVisit) {
                var link = this.g.getCell(id);
                var source = this.g.getCell(link.get('source').id);
                var currentInDegree = this.nodesInDegrees[source.get('id')];
                if (currentInDegree === 0) {
                    return this.visit(link);
                }
                else if (indegree > currentInDegree) {
                    indegree = currentInDegree;
                    currentBest = link;
                }
            }
            if (currentBest) {
                return this.visit(currentBest);
            }
        };
        GraphToText.prototype.visit = function (e) {
            if (e.isLink()) {
                delete this.linksToVisit[e.get('id')];
                this.nodesInDegrees[e.get('target').id]--;
                this.numberOfLinksToVisit--;
            }
            else {
                delete this.nodesToVisit[e.get('id')];
                this.numberOfNodesToVisit--;
            }
            return e;
        };
        GraphToText.prototype.init = function (graph) {
            var that = this;
            this.numberOfLinksToVisit = 0;
            this.numberOfNodesToVisit = 0;
            this.linksToVisit = {};
            this.nodesToVisit = {};
            this.nodesInDegrees = {};
            this.g = graph;
            this.g.getElements().forEach(function (element) {
                if (element.attr('metadata/name')) {
                    that.nodesToVisit[element.get('id')] = element;
                    var indegree = 0;
                    that.g.getConnectedLinks(element, { inbound: true }).forEach(function (link) {
                        if (link.get('source') && link.get('source').id && that.g.getCell(link.get('source').id) &&
                            that.g.getCell(link.get('source').id).attr('metadata/name')) {
                            that.linksToVisit[link.get('id')] = link;
                            that.numberOfLinksToVisit++;
                            indegree++;
                        }
                    });
                    that.nodesInDegrees[element.get('id')] = indegree;
                    that.numberOfNodesToVisit++;
                }
            });
        };
        GraphToText.prototype.chainToText = function (link) {
            var text = '';
            var source = this.g.getCell(link.get('source').id);
            text += this.nodeToText(source, true);
            while (link) {
                var target = this.g.getCell(link.get('target').id);
                text += ' > ';
                text += this.nodeToText(target, false);
                link = null;
                var outgoingLinks = this.g.getConnectedLinks(target, { outbound: true });
                for (var i = 0; i < outgoingLinks.length && !link; i++) {
                    if (this.linksToVisit[outgoingLinks[i].get('id')]) {
                        source = target;
                        link = this.visit(outgoingLinks[i]);
                    }
                }
            }
            return text;
        };
        GraphToText.prototype.nodeToText = function (element, junk) {
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
            this.visit(element);
            return text;
        };
        GraphToText.prototype.appendChainText = function (text, chainText) {
            if (chainText) {
                if (text) {
                    text += '\n';
                }
                text += chainText;
            }
            return text;
        };
        GraphToText.prototype.convert = function (g) {
            var text = '';
            var chainText;
            var id;
            this.init(g);
            while (this.numberOfLinksToVisit) {
                chainText = this.chainToText(this.nextLink());
                text = this.appendChainText(text, chainText);
            }
            for (id in this.nodesToVisit) {
                chainText = this.nodeToText(this.nodesToVisit[id], true);
                text = this.appendChainText(text, chainText);
            }
            return text;
        };
        ;
        return GraphToText;
    }());
    exports.GraphToText = GraphToText;
});

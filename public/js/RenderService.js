define(["require", "exports", "joint", "dagre"], function (require, exports, joint, dagre) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RenderService = (function () {
        function RenderService($log) {
            this.HANDLE_ICON_MAP = {
                'remove': 'icons/delete.svg',
            };
            this.DECORATION_ICON_MAP = {
                'error': 'icons/error.svg'
            };
            this.$log = $log;
        }
        RenderService.prototype.createHandle = function (kind) {
            return new joint.shapes.flo.ErrorDecoration({
                size: { width: 10, height: 10 },
                attrs: {
                    'image': {
                        'xlink:href': this.HANDLE_ICON_MAP[kind]
                    }
                }
            });
        };
        RenderService.prototype.createDecoration = function (kind) {
            return new joint.shapes.flo.ErrorDecoration({
                size: { width: 16, height: 16 },
                attrs: {
                    'image': {
                        'xlink:href': this.DECORATION_ICON_MAP[kind]
                    }
                }
            });
        };
        RenderService.prototype.createNode = function () {
            return new joint.shapes.flo.Node();
        };
        RenderService.prototype.initializeNewNode = function (node, context) {
            var metadata = node.attr('metadata');
            if (metadata) {
                node.attr('.label/text', node.attr('metadata/name'));
                if (node.attr('metadata/constraints/maxIncomingLinksNumber') === 0) {
                    node.attr('.input-port/display', 'none');
                }
                if (node.attr('metadata/constraints/maxOutgoingLinksNumber') === 0) {
                    node.attr('.output-port/display', 'none');
                }
            }
        };
        RenderService.prototype.createLink = function () {
            var link = new joint.shapes.flo.Link(joint.util.deepSupplement({
                smooth: true,
                attrs: {
                    '.': {},
                    '.connection': { 'stroke-width': 3, 'stroke': 'black', 'stroke-linecap': 'round' },
                    '.marker-arrowheads': { display: 'none' },
                    '.tool-options': { display: 'none' }
                },
            }, joint.shapes.flo.Link.prototype.defaults));
            return link;
        };
        RenderService.prototype.isSemanticProperty = function (propertyPath) {
            return propertyPath === '.label/text';
        };
        RenderService.prototype.refreshVisuals = function (element, changedPropertyPath) {
        };
        RenderService.prototype.layout = function (paper) {
            var graph = paper.model;
            var i;
            var g = new dagre.graphlib.Graph();
            g.setGraph({});
            g.setDefaultEdgeLabel(function () { return {}; });
            var nodes = graph.getElements();
            for (i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node.get('type') === joint.shapes.flo.NODE_TYPE) {
                    g.setNode(node.id, node.get('size'));
                }
            }
            var links = graph.getLinks();
            for (i = 0; i < links.length; i++) {
                var link = links[i];
                if (link.get('type') === joint.shapes.flo.LINK_TYPE) {
                    var options = {
                        minlen: 1.5
                    };
                    g.setEdge(link.get('source').id, link.get('target').id, options);
                    link.set('vertices', []);
                }
            }
            g.graph().rankdir = 'LR';
            dagre.layout(g);
            g.nodes().forEach(function (v) {
                var node = graph.getCell(v);
                if (node) {
                    var bbox = node.getBBox();
                    node.translate(g.node(v).x - bbox.x, g.node(v).y - bbox.y);
                }
            });
        };
        RenderService.prototype.getLinkAnchorPoint = function (linkView, view, magnet, reference) {
            if (magnet) {
                var type = magnet.getAttribute('type');
                var bbox = joint.V(magnet).bbox(false, linkView.paper.viewport);
                var rect = joint.g.rect(bbox);
                if (type === 'input') {
                    return joint.g.point(rect.x, rect.y + rect.height / 2);
                }
                else {
                    return joint.g.point(rect.x + rect.width, rect.y + rect.height / 2);
                }
            }
            else {
                this.$log.debug('No magnet!');
                return reference;
            }
        };
        return RenderService;
    }());
    exports.RenderService = RenderService;
});

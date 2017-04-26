/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class GraphToText{
    // Graph
	 static g;
	
	// Number of Links left to visit
	 static numberOfLinksToVisit;
	
	// Number of nodes left to visit
	 static numberOfNodesToVisit;
	
	// Map of links left to visit indexed by id
	 static linksToVisit;
	
	// Map of nodes left to visit indexed by id
	 static nodesToVisit;
	
	// Map of nodes incoming non-visited links degrees index by node id
	 static nodesInDegrees;
	
	// Priority:
	// 1. find links whose source has no other links pointing at it
	// 2. find links whose source has already been processed (not currently needed in sample DSL since
	//    can't create graphs like that due to metamodel constraints)
	// 3. find remaining links
	private static nextLink() {
            var indegree = Number.MAX_VALUE;
		var currentBest;
		for (var id in GraphToText.linksToVisit) {
			var link = GraphToText.g.getCell(id);
			var source = GraphToText.g.getCell(link.get('source').id);
			var currentInDegree = GraphToText.nodesInDegrees[source.get('id')];
			if (currentInDegree === 0) {
				return GraphToText.visit(link);
			} else if (indegree > currentInDegree) {
				indegree = currentInDegree;
				currentBest = link;
			}
		}
		if (currentBest) {
			return GraphToText.visit(currentBest);
		}
	}
	
	private static visit(e) {
		if (e.isLink()) {
			delete GraphToText.linksToVisit[e.get('id')];
			GraphToText.nodesInDegrees[e.get('target').id]--;
			GraphToText.numberOfLinksToVisit--;
		} else {
			delete GraphToText.nodesToVisit[e.get('id')];
			GraphToText.numberOfNodesToVisit--;
		}
		return e;
	}
	
	private static init(graph) {
		GraphToText.numberOfLinksToVisit = 0;
		GraphToText.numberOfNodesToVisit = 0;
		GraphToText.linksToVisit = {};
		GraphToText.nodesToVisit = {};
		GraphToText.nodesInDegrees = {};
		GraphToText.g = graph;
		GraphToText.g.getElements().forEach(function(element) {
			if (element.attr('metadata/name')) { // is it a node?
				GraphToText.nodesToVisit[element.get('id')] = element;
				var indegree = 0;
				GraphToText.g.getConnectedLinks(element, {inbound: true}).forEach(function(link) {
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
	}
	
	/**
	 * Starts at a link and proceeds down a chain. Converts each node to
	 * text and then joins them with a ' > '. 
	 */
	private static chainToText(link) {
		var text = '';
		var source = GraphToText.g.getCell(link.get('source').id);
		text += GraphToText.nodeToText(source, true);
		while (link) {
			var target = GraphToText.g.getCell(link.get('target').id);
			text += ' > ';
			text += GraphToText.nodeToText(target, false);
			
			// Find next not visited link to follow
			link = null;
			var outgoingLinks = GraphToText.g.getConnectedLinks(target, {outbound: true});
			for (var i = 0; i < outgoingLinks.length && !link; i++) {
				if (GraphToText.linksToVisit[outgoingLinks[i].get('id')]) {
					source = target;
					link = GraphToText.visit(outgoingLinks[i]);
				}
			}
		}
		return text;
	}
	
	/**
	 * Very basic format. From a node to the text:
	 * "name --key=value --key=value"
	 */
	private static nodeToText(element,junk) {
		var text = '';
		var props = element.attr('props');
		if (!element) {
			return;
		}
		text += element.attr('metadata/name');
		if (props) {
			Object.keys(props).forEach(function(propertyName) {
				text += ' --' + propertyName + '=' + props[propertyName];
			});
		}
		GraphToText.visit(element);
		return text;
	}
	
	private static appendChainText(text, chainText) {
		if (chainText) {
			if (text) {
				text += '\n';
			}
			text += chainText;
		}
		return text;
	}
	
	// Translate a graph into a basic string
	public  static convert(g) {
		var text = '';
		var chainText;
		var id;
		GraphToText.init(g);
		while (GraphToText.numberOfLinksToVisit) {
			chainText = GraphToText.chainToText(GraphToText.nextLink());
			text = GraphToText.appendChainText(text, chainText);
		}
		// Visit all disconnected nodes
		for (id in GraphToText.nodesToVisit) {
			chainText = GraphToText.nodeToText(GraphToText.nodesToVisit[id], true);
			text = GraphToText.appendChainText(text, chainText);
		}
		return text;
	};
	
}

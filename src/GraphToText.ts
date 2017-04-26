/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class GraphToText{
    // Graph
	 private g;
	
	// Number of Links left to visit
	 private numberOfLinksToVisit;
	
	// Number of nodes left to visit
	 private numberOfNodesToVisit;
	
	// Map of links left to visit indexed by id
	 private linksToVisit;
	
	// Map of nodes left to visit indexed by id
	 private nodesToVisit;
	
	// Map of nodes incoming non-visited links degrees index by node id
	 private nodesInDegrees;
	
	// Priority:
	// 1. find links whose source has no other links pointing at it
	// 2. find links whose source has already been processed (not currently needed in sample DSL since
	//    can't create graphs like that due to metamodel constraints)
	// 3. find remaining links
	private  nextLink() {
            var indegree = Number.MAX_VALUE;
		var currentBest;
		for (var id in this.linksToVisit) {
			var link = this.g.getCell(id);
			var source = this.g.getCell(link.get('source').id);
			var currentInDegree = this.nodesInDegrees[source.get('id')];
			if (currentInDegree === 0) {
				return this.visit(link);
			} else if (indegree > currentInDegree) {
				indegree = currentInDegree;
				currentBest = link;
			}
		}
		if (currentBest) {
			return this.visit(currentBest);
		}
	}
	
	private  visit(e) {
		if (e.isLink()) {
			delete this.linksToVisit[e.get('id')];
			this.nodesInDegrees[e.get('target').id]--;
			this.numberOfLinksToVisit--;
		} else {
			delete this.nodesToVisit[e.get('id')];
			this.numberOfNodesToVisit--;
		}
		return e;
	}
	
	private  init(graph) {
                let that = this;
		this.numberOfLinksToVisit = 0;
		this.numberOfNodesToVisit = 0;
		this.linksToVisit = {};
		this.nodesToVisit = {};
		this.nodesInDegrees = {};
		this.g = graph;
		this.g.getElements().forEach(function(element) {
			if (element.attr('metadata/name')) { // is it a node?
				that.nodesToVisit[element.get('id')] = element;
				var indegree = 0;
				that.g.getConnectedLinks(element, {inbound: true}).forEach(function(link) {
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
	}
	
	/**
	 * Starts at a link and proceeds down a chain. Converts each node to
	 * text and then joins them with a ' > '. 
	 */
	private  chainToText(link) {
		var text = '';
		var source = this.g.getCell(link.get('source').id);
		text += this.nodeToText(source, true);
		while (link) {
			var target = this.g.getCell(link.get('target').id);
			text += ' > ';
			text += this.nodeToText(target, false);
			
			// Find next not visited link to follow
			link = null;
			var outgoingLinks = this.g.getConnectedLinks(target, {outbound: true});
			for (var i = 0; i < outgoingLinks.length && !link; i++) {
				if (this.linksToVisit[outgoingLinks[i].get('id')]) {
					source = target;
					link = this.visit(outgoingLinks[i]);
				}
			}
		}
		return text;
	}
	
	/**
	 * Very basic format. From a node to the text:
	 * "name --key=value --key=value"
	 */
	private  nodeToText(element,junk) {
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
		this.visit(element);
		return text;
	}
	
	private  appendChainText(text, chainText) {
		if (chainText) {
			if (text) {
				text += '\n';
			}
			text += chainText;
		}
		return text;
	}
	
	// Translate a graph into a basic string
	public  convert(g) {
		var text = '';
		var chainText;
		var id;
		this.init(g);
		while (this.numberOfLinksToVisit) {
			chainText = this.chainToText(this.nextLink());
			text = this.appendChainText(text, chainText);
		}
		// Visit all disconnected nodes
		for (id in this.nodesToVisit) {
			chainText = this.nodeToText(this.nodesToVisit[id], true);
			text = this.appendChainText(text, chainText);
		}
		return text;
	};
	
}

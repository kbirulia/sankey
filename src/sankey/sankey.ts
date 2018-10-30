import * as d3 from "d3"; //todo check minimal import
import {
    IDetails,
    IGraph, INode,
    IPickedColors,
    ISankeyGraph,
    ISankeyNode,
    SvgSelection
} from "./sankey.model";
import * as d3_sankey from "d3-sankey";
import {ConnectionsDiagramHelper} from "../color";
import {sidePaddingMap} from "./sankey.constants";

export default class Sankey {

    private svg: SvgSelection;
    private width: number;
    private height: number;
    private graph: ISankeyGraph;
    private colors: string[];
    private pickedColors: IPickedColors = {};
    private nodePadding: number = 4;

    constructor(graph: IGraph, private details: IDetails, node: Element ) {
        this.width = node.clientWidth;
        this.height = node.clientHeight;
        this.createSVG(node);
        this.graph = this.createGraph(graph);
        this.colors = ConnectionsDiagramHelper.generatePalit();
    }

    private createSVG(node: Element) {
        this.svg = d3.select(node).append('svg');

        this.svg.attr("width", this.width)
            .attr("height", this.height)
    }

    private createGraph(data: IGraph): ISankeyGraph {
        const groupCount = this.getGroupCount();
        const sidePadding = sidePaddingMap[groupCount];

        return <ISankeyGraph>d3_sankey.sankey()
            .extent([
                [sidePadding, this.nodePadding],
                [ this.width - 2 * sidePadding, this.height - 2 * this.nodePadding]])
            .nodeId((d: ISankeyNode) => d.id)
            .nodeAlign(d3_sankey.sankeyCenter)(data);
    }

    private getGroupCount() {
        return Object.keys(this.details).reduce((accumulator, nodeId) => {
            const groupName = nodeId.substr(0, nodeId.lastIndexOf('_'));
            if (accumulator.indexOf(groupName) < 0) {
                accumulator.push(groupName);
            }

            return accumulator;
        }, []).length;
    }

    private getColor(nodeId: string): string {
        if (this.pickedColors[nodeId]) {
            return this.pickedColors[nodeId];
        }

        const color = this.colors.pop();
        this.pickedColors[nodeId] = color;

        return color;
    }

    drawNodes() {
        this.svg.append("g")
            .classed("nodes", true)
            .selectAll("rect")
            .data(this.graph.nodes)
            .enter()
            .append("rect")
            .classed("node", true)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)
            .attr("fill", node => this.getColor(node.id))
            .attr("opacity", 0.8);
    }

    drawLinks() {
        this.svg.append("g")
            .classed("links", true)
            .selectAll("path")
            .data(this.graph.links)
            .enter()
            .append("path")
            .classed("link", true)
            .attr("d", d3_sankey.sankeyLinkHorizontal())
            .attr("fill", "none")
            .attr("stroke", link => this.getColor(link.source.id))
            .attr("stroke-width", d => d.width)
            .attr("opacity", 0.3);
    }

    drawText() {
        this.svg.append("g")
            .classed("text", true)
            .selectAll("text")
            .data(this.graph.nodes)
            .enter()
            .append("text")
            .classed("node", true)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0 + 15)
            .text(node => `${this.details[node.id].name} (${this.details[node.id].value})`);
    }

    draw() {
        this.drawNodes();
        this.drawLinks();
        this.drawText();
    }
}

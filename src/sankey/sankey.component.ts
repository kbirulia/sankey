import * as d3 from "d3";//todo check minimal import
import {IGraph, IPickedColors, SvgSelection} from "./sankey.model";
import {
    colorsMap,
    nodePadding, nodeWidth,
    Side,
    sidePaddingByGroup,
    textPositionsByGroup
} from "./sankey.constants";
import {ConnectionsDiagramHelper} from "../color";
import { Sankey } from "./sankey";
import {BaseType} from "d3";
// import {temporaryFilter} from "../utils/temporaryFilter";

export default class SankeyComponent {

    private width: number;
    private height: number;
    private svg: SvgSelection;
    private colors: string[] = [];
    private pickedColors: IPickedColors = {};
    private sidePadding: number;
    private nodePadding: number = 4;
    private isNodeSelected: boolean = false;
    private _sankey: Sankey;
    private _groupCount: number;

    constructor(graph: IGraph, node: Element) {
        this.width = node.clientWidth;
        this.height = node.clientHeight;
        this.createSVG(node);

        this._sankey = new Sankey(graph);

        this.initSankeyDimensions();

        this.compute();
    }

    get groups() {
        return this._sankey.groups;
    }

    get nodes() {
        return this._sankey.nodes;
    }

    get links() {
        return this._sankey.links;
    }

    private initSankeyDimensions() {
        this._groupCount = Object.keys(this.groups).length;
        this.sidePadding = sidePaddingByGroup[this._groupCount];

        this._sankey
            .nodePadding(nodePadding)
            .nodeWidth(nodeWidth)
            .extent({
                x0: this.sidePadding,
                y0: this.nodePadding,
                x1: this.width - this.sidePadding,
                y1:this.height - this.nodePadding
            });
    }

    private compute() {
        this._sankey.compute();
    }

    private createSVG(node: Element) {
        this.svg = d3.select(node)
            .append("svg")
            .classed("diagram", true);

        this.svg.attr("width", this.width)
            .attr("height", this.height)
    }

    private getColor(nodeId: string): string {
        if (this.pickedColors[nodeId]) {
            return this.pickedColors[nodeId];
        }

        if (!this.colors.length) {
            this.colors = ConnectionsDiagramHelper.generatePalit();
        }

        const color = this.colors.pop();
        this.pickedColors[nodeId] = color;

        return color;
    }

    private drawNodes() {
        const { nodes, groups } = this;

        // draw nodes
        const nodeBlock = this.svg.append("g")
            .classed("nodes", true)
            // .on('click', () => {
            //     if (d3.event.target.tagName === "rect") {
            //         this.handleNodeClick(d3.event.target.dataset.id);
            //     }
            // });

        const nodeGroups = nodeBlock
            .selectAll("g")
            .data(nodes)
            .enter()
            .append("g")
            .classed("bar-group", true);

        //draw node bar
        nodeGroups
            .append("rect")
            .classed("bar", true)
            .attr("data-id", node => node.id)
            .attr("x", node => node.x0)
            .attr("y", node => node.y0)
            .attr("width", node => node.x1 - node.x0)
            .attr("height", node => node.y1 - node.y0)
            .attr("fill", node => this.getColor(node.id))
            .attr("opacity", 0.8)
            .append("title")
            .text(node => node.name);

        //draw node label
        const text = nodeGroups.append("text")
            .classed("connection-label", true);

        //draw node label name
        text.append("tspan")
            .classed("name-label", true)
            .attr("fill", colorsMap['name-label'])
            .text(node => `${node.name} `);

        //draw node label count
        text.append("tspan")
            .classed("count-label", true)
            .attr("fill", colorsMap['count-label'])
            .text(node => {
                const percent = (node.percentage * 100).toFixed(1);
                return `${node.value } (${percent}%)`
            });

        const groupCount = this._groupCount;
        //set node label position
        text.attr("x", function (node){
            const side = textPositionsByGroup[groupCount][node.depth];

            return side === Side.left
                ? node.x0 - (<SVGTSpanElement>this).getComputedTextLength() - 5
                : node.x1 + 5;
        })
        .attr("y", d => d.y0 + (d.y1 - d.y0)/2 + 5)
    }

    //todo apply real handler
    // private handleNodeClick(nodeId) {
    //     if (this.isNodeSelected) {
    //
    //     }
    //     this.svg.selectAll("*").remove();
    //
    //     const selected = temporaryFilter(this.sankey.data, this.sankey.details, nodeId);
    //
    //     this.sankey.updateData(selected.data, selected.details);
    //     this.draw();
    // }

    private drawLinks() {

        const { links } = this;

        this.svg.append("g")
            .classed("links", true)
            .selectAll("path")
            .data(links)
            .enter()
            .append("path")
            .classed("link", true)
            .attr("d", link => this.curveLink(link))
            .attr("fill", "none")
            .attr("stroke", link => this.getColor(link.source.id))
            // .attr("stroke-width", d => d.width)
            .attr("opacity", 0.3);
    }

    private curveLink(link) {
        const linkWidth = link.x2 - link.x0;
        const dx = linkWidth / 3;

        const path1 =  d3.line().curve(d3.curveBasis)([
            [link.x0, link.y0],
            [link.x0 + dx, link.y0],
            [link.x0 + 2*dx, link.y2],
            [link.x2, link.y2]
        ]);

        const path2 =  d3.line().curve(d3.curveBasis)([
            [link.x1, link.y1],
            [link.x1 + dx, link.y1],
            [link.x1 + 2*dx, link.y3],
            [link.x3, link.y3]
        ]);

        console.log(path1, path2);
        return path1;
    }

    public draw() {
        this.drawNodes();
        this.drawLinks();
    }
}

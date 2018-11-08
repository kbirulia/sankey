import * as d3 from "d3";//todo check minimal import
import {IGraph, IGroups, ILink, INode, IPickedColors, TSvgSelection} from "./sankey.model";
import {
    nodePadding, nodeWidth,
    NodeSide,
    sidePaddingByGroup,
    textPositionsByGroup
} from "./sankey.constants";
import {ConnectionsDiagramHelper} from "../utils/color";
import { Sankey } from "./sankey";
import { selectedMinsk } from "../data/selectedMinsk";
import { selectedMinskA2 } from "../data/selectedMinskA2";
import { selectedA2 } from "../data/selectedA2";
import {selectedMinskA2A3} from "../data/selectedMinskA2A3";

//todo remove(temporary mock)
const mocks = {
    "city_Minsk": selectedMinsk,
    "seniority_level_A2": selectedA2,
    "city_Minsk_seniority_level_A2": selectedMinskA2,
    "city_Minsk_seniority_level_A2_seniority_level_A3": selectedMinskA2A3,
};

export default class SankeyComponent {

    private _width: number;
    private _height: number;
    private _svg: TSvgSelection;
    private _colors: string[] = [];
    private _pickedColors: IPickedColors = {};
    private _sidePadding: number;
    private _nodePadding: number = 4;
    private _sankey: Sankey;
    private _groupCount: number;
    private _selectedSankey: Sankey | null = null;
    private _selectedNodes: string[] = [];
    private _duration: number = 500;

    constructor(graph: IGraph, node: Element) {
        this._width = node.clientWidth;
        this._height = node.clientHeight;
        this.createSVG(node);

        this._sankey = new Sankey(graph);

        this.initSankeyDimensions();

        this.compute();
    }

    get groups(): IGroups {
        return this._selectedSankey
            ? this._selectedSankey.groups
            : this._sankey.groups;
    }

    get nodes(): INode[] {
        return this._selectedSankey
            ? this._selectedSankey.nodes
            : this._sankey.nodes;    }

    get links(): ILink[] {
        return this._selectedSankey
            ? this._selectedSankey.links
            : this._sankey.links;    }

    private initSankeyDimensions(): void {
        this._groupCount = Object.keys(this.groups).length;
        this._sidePadding = sidePaddingByGroup[this._groupCount];

        this._sankey
            .nodePadding(nodePadding)
            .nodeWidth(nodeWidth)
            .extent({
                x0: this._sidePadding,
                y0: this._nodePadding,
                x1: this._width - this._sidePadding,
                y1:this._height - this._nodePadding
            });
    }

    private compute(): void {
        this._sankey.compute();
    }

    private createSVG(node: Element): void {
        this._svg = d3.select(node)
            .append("svg")
            .classed("diagram", true);

        this._svg
            .attr("width", this._width)
            .attr("height", this._height);

        this._svg
            .selectAll('g')
            .data(['nodes', 'links'])
            .enter()
            .append('g')
            .attr('class', d => d);

        this._svg
            .select('.nodes')
            .on('click', () => this.handleNodeClick());
    }

    private getColor(nodeId: string): string {
        if (this._pickedColors[nodeId]) {
            return this._pickedColors[nodeId];
        }

        if (!this._colors.length) {
            this._colors = ConnectionsDiagramHelper.generatePalit();
        }

        const color = this._colors.pop();
        this._pickedColors[nodeId] = color;

        return color;
    }

    private drawNodes(): void {
        const { nodes } = this;

        const nodeBlock = this._svg
            .select('.nodes');

        const nodeGroups = nodeBlock
            .selectAll("g")
            .data(nodes, (node: INode) => node.id);
        nodeGroups.exit().remove();
        nodeGroups.enter()
            .append("g")
            .classed("bar-group", true);

        nodeGroups
            .classed('selected', (d) => this._selectedNodes.includes(d.id));

        const bars = nodeBlock
            .selectAll('g')
            .selectAll('rect')
            .data((d: INode) => [d]);
        bars
            .enter()
            .append('rect')
            .classed("bar", true)
            .attr("data-id", node => node.id)
            .attr("data-group", node => node.group)
            .attr("fill", node => this.getColor(node.id))
            .attr("x", node => node.x0)
            .attr("y", node => node.y0)
            .attr("width", node => node.x1 - node.x0)
            .attr("height", node => node.y1 - node.y0)
            .append("title")
            .text(node => node.name);
        bars
            .transition()
            .duration(this._duration)
            .attr("x", node => node.x0)
            .attr("y", node => node.y0)
            .attr("width", node => node.x1 - node.x0)
            .attr("height", node => node.y1 - node.y0);

        const existsLabel = nodeBlock
            .selectAll('g')
            .selectAll('text')
            .data((d: INode) => [d]);

        const label = existsLabel.enter()
            .append('text')
            .classed("connection-label", true);

        label.append("tspan")
            .classed("name_label", true)
            .text(node => `${node.name} `);

        label.append("tspan")
            .classed("count-label", true)
            .text(this.getLabelCount);

        const self = this;

        label.attr("x", function (node){
                return self.getLabelX(node, <SVGTSpanElement>this);
            })
            .attr("y", d => d.y0 + (d.y1 - d.y0)/2 + 5);

        existsLabel
            .transition()
            .duration(this._duration)
            .attr("x", function (node){
                return self.getLabelX(node, <SVGTSpanElement>this);
            })
            .attr("y", d => d.y0 + (d.y1 - d.y0)/2 + 5);

        existsLabel
            .selectAll('.count-label')
            .data(d => [d])
            .text(this.getLabelCount);

    }

    private getLabelX(node: INode, text: SVGTSpanElement): number {
        const side = textPositionsByGroup[this._groupCount][node.depth];

        return side === NodeSide.left
            ? node.x0 - text.getComputedTextLength() - 5
            : node.x1 + 5;
    }

    private getLabelCount(node): string {
        const percent = (node.percentage * 100).toFixed(1);
        return `${node.value } (${percent}%)`;
    }

    //todo apply real handler
    private handleNodeClick(): void {
        if (d3.event.target.tagName !== "rect") {
            return;
        }

        const { id: nodeId } = d3.event.target.dataset;

        if (this._selectedNodes.includes(nodeId)) {
            this._selectedNodes = this._selectedNodes.filter(id => id !== nodeId)
        } else {
            this._selectedNodes.push(nodeId)
        }

        if (!this._selectedNodes.length) {
            this._selectedSankey = null;
            this.draw();
            return;
        }

        // todo start fetch

        const nodeIds = this._selectedNodes.sort();

        const key = nodeIds.join('_');

        const selectedData = mocks[key];
        if (!selectedData) {
            return;
        }

        // todo end fetch

        this._selectedSankey = new Sankey(selectedData);

        this._selectedSankey.cloneConfig(this._sankey);

        this._selectedSankey.compute();

        this.draw();
    }

    private drawLinks(): void {
        const { links } = this;

        const linkBlock = this._svg
            .select('.links');

        const existsLinks = linkBlock
            .selectAll("path")
            .data(links, (link: ILink) => link.id);

        existsLinks.exit()
            .transition()
            .duration(this._duration)
            .attr("opacity", 0);

        existsLinks
            .enter()
            .append("path")
            .classed("link", true)
            .attr("d", this.curveLink)
            .attr("fill", link => this.getColor((link.source as INode).id))
            .attr("opacity", 0.5)
            .append("title")
            .text(d => `${d.source.name} -> ${d.target.name} ${d.value}`);

        existsLinks
            .transition()
            .duration(this._duration)
            .attr("d", this.curveLink)
            .attr("opacity", 0.5);

        existsLinks
            .selectAll('title')
            .data(d => [d])
            .text(d => `${d.source.name} -> ${d.target.name} ${d.value}`);
    }

    private curveLink(link: ILink): string {
        const x = [link.x0, link.x1];

        const sourceY = [link.y0, link.y1];
        const targetY = [link.y2, link.y3];

        const y = <[number, number][]>[sourceY, sourceY, targetY, targetY];

        const xGenerator = d3.scaleLinear()
            .range(x)
            .domain([0, y.length - 1]);

        return d3.area()
            .x((d, i) => xGenerator(i))
            .y1(d => d[0])
            .y0(d => d[1])
            .curve(d3.curveBasis)(y);
    }

    public draw(): void {
        this.drawNodes();
        this.drawLinks();
    }
}

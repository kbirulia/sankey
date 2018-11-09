import * as d3 from "d3";//todo check minimal import
import {IGraph, IGroups, ILink, INode, IPickedColors, TSvgSelection} from "./sankey.model";
import {
    nodePadding, nodeWidth,
    NodeSide,
    sidePaddingByGroup,
    textPositionsByGroup, minNodeHeight
} from "./sankey.constants";
import {ConnectionsDiagramHelper} from "../utils/color";
import { Sankey } from "./sankey";
import { selectedMinskV1 } from "../data/selectedMinsk-v1";
import { selectedMinskA2A3V1 } from "../data/selectedMinskA2A3-v1";
import { selectedMinskA2A3A2B1B2V1 } from "../data/selectedMinskA2A3A2B1B2-v1";

//todo remove(temporary mock)
const mocks = {
    "city_600100000009449": selectedMinskV1,
    "city_600100000009449_level_A2_level_A3": selectedMinskA2A3V1,
    "cefr_A2_cefr_B1_cefr_B2_city_600100000009449_level_A2_level_A3": selectedMinskA2A3A2B1B2V1,
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
    private _fitToScreen: boolean = false;

    constructor(graph: IGraph, node: Element) {
        this._width = node.clientWidth;
        this._height = node.clientHeight;

        this.createSVG(node);

        this._sankey = new Sankey(graph);

        this.initSankeyDimensions();

        this.compute();

        this.applyHeight();
    }

    get groups(): IGroups {
        return this._selectedSankey
            ? this._selectedSankey.groups
            : this._sankey.groups;
    }

    get nodes(): INode[] {
        return this._selectedSankey
            ? this._selectedSankey.nodes
            : this._sankey.nodes;
    }

    get links(): ILink[] {
        return this._selectedSankey
            ? this._selectedSankey.links
            : this._sankey.links;
    }

    private applyHeight(): void {
        if (!this._fitToScreen) {
            const dimensions = this._sankey.getDimensions();
            this._height = dimensions.y1 + this._nodePadding;
        }

        this._svg
            .attr("height", this._height);
    }

    private initSankeyDimensions(): void {
        this._groupCount = Object.keys(this.groups).length;
        this._sidePadding = sidePaddingByGroup[this._groupCount];

        this._sankey
            .nodePadding(nodePadding)
            .nodeWidth(nodeWidth)
            .minNodeHeight(minNodeHeight)
            .extent({
                x0: this._sidePadding,
                y0: this._nodePadding,
                x1: this._width - this._sidePadding,
                y1:this._height - this._nodePadding
            });
    }

    private compute(): void {
        this._sankey.compute(this._fitToScreen);
    }

    private createSVG(node: Element): void {
        this._svg = d3.select(node)
            .append("svg")
            .classed("diagram", true)
            .attr("width", this._width);

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
            .classed("bar-group", true)
            .classed('selected', (d) => {
                return this._selectedNodes.includes(d.id)
            });

        nodeGroups
            .classed('selected', (d) => {
                return this._selectedNodes.includes(d.id)
            });

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
            .attr("x", node => node.x)
            .attr("y", node => node.y)
            .attr("width", node => node.width)
            .attr("height", node => node.height)
            .append("title")
            .text(node => node.name);
        bars
            .transition()
            .duration(this._duration)
            .attr("x", node => node.x)
            .attr("y", node => node.y)
            .attr("width", node => node.width)
            .attr("height", node => node.height)

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
            .attr("y", d => d.y + (d.height)/2 + 5);

        existsLabel
            .transition()
            .duration(this._duration)
            .attr("x", function (node){
                return self.getLabelX(node, <SVGTSpanElement>this);
            })
            .attr("y", d => d.y + (d.height)/2 + 5);

        existsLabel
            .selectAll('.count-label')
            .data(d => [d])
            .text(this.getLabelCount);

    }

    private getLabelX(node: INode, text: SVGTSpanElement): number {
        const side = textPositionsByGroup[this._groupCount][node.depth];

        return side === NodeSide.left
            ? node.x - text.getComputedTextLength() - 5
            : node.x + node.width + 5;
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
        console.log(key);

        const selectedData = mocks[key];
        if (!selectedData) {
            this.draw();
            return;
        }

        // todo end fetch

        this._selectedSankey = new Sankey(selectedData);

        this._selectedSankey.cloneConfig(this._sankey);

        this._selectedSankey.compute(this._fitToScreen);

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

        const sourceY = [
            link.y1 - link.y0 >= minNodeHeight
                ? link.y0
                : link.y1 - 1,
            link.y1
        ];
        const targetY = [
            link.y3 - link.y2 >= minNodeHeight
                ? link.y2
                : link.y3 - 1,
            link.y3
        ];

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
        this.drawLinks();
        this.drawNodes();
    }
}

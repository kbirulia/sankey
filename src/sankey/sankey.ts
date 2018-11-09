import { map } from "d3-collection";
import { sum, max } from "d3-array";
import { IDimensions, IGraph, IGroups, ILink, INode } from "./sankey.model";
import {ascendingBy, descendingBy} from "../utils/descendingBy";
import { groupByKey } from "../utils/groupByKey";
import {minNodeHeight} from "./sankey.constants";

export class Sankey {
    private _graph: IGraph;
    private _groupCount: number;
    private _nodeWidth: number = 24;
    private _minNodeHeigth: number = 2;
    private _dimensions: IDimensions = {
        x0: 0,
        x1: 0,
        y0: 0,
        y1: 0
    };
    private _nodePadding: number = 8;
    private _fitToScreen: boolean;

    constructor(graph: IGraph) {
        this._groupCount = Object.keys(graph.groups).length;
        this._graph = JSON.parse(JSON.stringify(graph));
    }

    get groups(): IGroups {
        return this._graph.groups;
    }

    get nodes(): INode[] {
        return this._graph.nodes;
    }

    get links(): ILink[] {
        return this._graph.links;
    }

    public getNodePadding(): number {
        return this._nodePadding;
    }

    public getDimensions(): IDimensions {
        return this._dimensions;
    }

    public getNodeWidth(): number {
        return this._nodeWidth;
    }

    public nodeWidth(value: number): Sankey {
        this._nodeWidth = value;

        return this;
    }

    public minNodeHeight(value: number): Sankey {
        this._minNodeHeigth = value;

        return this;
    }

    public extent(dimensions: Partial<IDimensions>): Sankey {
        this._dimensions = <IDimensions>{
            ...this._dimensions,
            ...dimensions
        };

        return this;
    }
    public nodePadding(padding: number): Sankey {
        this._nodePadding = padding;

        return this;
    }

    public compute(fitToScreen: boolean): void {
        this._fitToScreen = fitToScreen;
        this.computeNodes();
        this.computeNodeLinks();
        this.computeLinks();
    }

    public cloneConfig(sankey: Sankey): void {
        this.nodePadding(sankey.getNodePadding())
            .nodeWidth(sankey.getNodeWidth())
            .extent(sankey.getDimensions())
    }

    private getGroups(): INode[][] {
        return <INode[][]>groupByKey(this.nodes, 'depth');
    }

    private computeNodes(): void {
        const {nodes, groups} = this._graph;
        const { x0, x1 } = this._dimensions;

        const chartWidth = x1 - x0;

        const linkNodeWidth = (chartWidth - this._nodeWidth) / (this._groupCount - 1);

        nodes.forEach(node => {
            const group = groups[node.group];
            node.depth = group.index;
            node.percentage = node.value / group.value;
            node.sourceLinks = [];
            node.targetLinks = [];
            node.x = x0 + node.depth * linkNodeWidth;
            node.width = this._nodeWidth;
        });

        this.computeNodesY()
    }

    private computeNodesY(): void {
        const groups = this.getGroups();
        if (this._fitToScreen) {
            //todo others
            this.computeNodesYByHeight(groups);
        } else {
            this.computeNodesYFull(groups)
        }

    }

    private computeNodesYByHeight(groups: INode[][]) {
        const { y1, y0 } = this._dimensions;
        const chartHeight = y1 - y0;

        groups.forEach(nodes => {
            const commonNodeHeight = chartHeight - (nodes.length - 1) * this._nodePadding;
            let y = y1;
            let leftHeight = commonNodeHeight;
            let leftPercentage= 1;
            ascendingBy(nodes, 'value')
                .forEach(node => {
                    const nodeHeight = Math.max(leftHeight * node.percentage / leftPercentage, minNodeHeight);
                    node.y = y - nodeHeight;
                    node.height = nodeHeight;
                    y = node.y - this._nodePadding;
                    leftHeight -= nodeHeight;
                    leftPercentage -= node.percentage;
                });
        });
    }

    private computeNodesYFull(sortedGroups: INode[][]) {
        const maxNodesInGroup = max(sortedGroups, nodes => nodes.length);

        const maxGroupIndex = sortedGroups.findIndex(group => group.length === maxNodesInGroup);
        const maxGroup = sortedGroups.splice(maxGroupIndex, 1)[0];

        const { y0 } = this._dimensions;

            const minHeight = this._minNodeHeigth * maxGroup.length;
            const percentagePerPx = 1 / minHeight;
            let y = y0;

        descendingBy(maxGroup, 'value').forEach(node => {
                const nodeHeight = Math.max(node.percentage / percentagePerPx, minNodeHeight);
                node.y = y;
                node.height = nodeHeight;
                y = node.y + nodeHeight + this._nodePadding;
            });

            y -= this._nodePadding;

        if (y < this._dimensions.y1) {
            this._dimensions.y1 = y;
            this.computeNodesYByHeight([...sortedGroups, maxGroup]);
        } else {
            this._dimensions.y1 = y;
            this.computeNodesYByHeight(sortedGroups);
        }
    }

    private computeNodeLinks(): void {
        const {nodes, links} = this._graph;

        const nodeMap = map(nodes, node => node.id);
        links.forEach(link => {
            link.id = `${link.source}_${link.target}`;
            const source = link.source = nodeMap.get(<string>link.source);
            const target = link.target = nodeMap.get(<string>link.target);
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
    }

    private computeLinks(): void {
        const { nodes } = this._graph;

        nodes.forEach(node => {
            descendingBy(node.sourceLinks, 'value');
            descendingBy(node.targetLinks, 'value');
            const sourceX = node.x + node.width;
            const targetX = node.x;

            let sourceY = node.y;
            let targetY = node.y;
            const nodeHeight = node.height;

            const sourceSum = sum(node.sourceLinks, link => link.value);
            const targetSum = sum(node.targetLinks, link => link.value);

            node.sourceLinks.forEach(link => {
                const linkHeight = link.value / sourceSum * nodeHeight;
                link.x0 = sourceX;
                link.y0 = sourceY;

                sourceY = link.y0 + linkHeight;

                link.y1 = sourceY;
            });

            node.targetLinks.forEach(link => {
                const linkHeight = link.value / targetSum * nodeHeight;
                link.x1 = targetX;
                link.y2 = targetY;

                targetY = link.y2 + linkHeight;

                link.y3 = targetY;
            })
        })
    }
}

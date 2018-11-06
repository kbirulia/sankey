import { map } from "d3-collection";
import { IDimensions, IGraph, IGroups, ILink, INode } from "./sankey.model";
import { descendingBy } from "../utils/descendingBy";

export class Sankey {
    private _graph: IGraph;
    private _groupCount: number;
    private _nodeWidth: number = 24;
    private _dimensions: IDimensions = {
        x0: 0,
        x1: 0,
        y0: 0,
        y1: 0,
    };
    private _nodePadding: number = 8;

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

    public extent(dimensions: IDimensions): Sankey {
        this._dimensions = dimensions;

        return this;
    }
    public nodePadding(padding: number): Sankey {
        this._nodePadding = padding;

        return this;
    }

    public compute(): void {
        this.computeNodes();
        this.computeNodeLinks();
        this.computeLinks();
    }

    public cloneConfig(sankey: Sankey): void {
        this.nodePadding(sankey.getNodePadding())
            .nodeWidth(sankey.getNodeWidth())
            .extent(sankey.getDimensions())
    }

    private getSortedGroups(): INode[][] {
        const groups = this._graph.nodes
            .reduce((columns, node) => {
                (columns[node.depth] = columns[node.depth] || []).push(node);
                return columns;
            }, []);

        groups.forEach((column: INode[]) => {
            descendingBy(column, 'value');
        });

        return groups;
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
            node.x0 = x0 + node.depth * linkNodeWidth;
            node.x1 = node.x0 + this._nodeWidth;
        });

        this.computeNodesY()
    }

    private computeNodesY(): void {
        const { y1, y0 } = this._dimensions;

        const chartHeight = y1 - y0;

        const sortedGroups = this.getSortedGroups();

        sortedGroups.forEach(nodes => {
            const commonNodeHeight = chartHeight - (nodes.length - 1) * this._nodePadding;
            let y = y0;
            nodes.forEach(node => {
                node.y0 = y;
                node.y1 = node.y0 + commonNodeHeight * node.percentage;
                y = node.y1 + this._nodePadding;
            });
        });
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
            const sourceX = node.x1;
            const targetX = node.x0;

            let sourceY = node.y0;
            let targetY = node.y0;
            const nodeHeight = node.y1 - node.y0;

            node.sourceLinks.forEach(link => {
                const linkHeight = link.value / node.value * nodeHeight;
                link.x0 = sourceX;
                link.y0 = sourceY;

                sourceY = link.y0 + linkHeight;

                link.y1 = sourceY;
            });

            node.targetLinks.forEach(link => {
                const linkHeight = link.value / node.value * nodeHeight;
                link.x1 = targetX;
                link.y2 = targetY;

                targetY = link.y2 + linkHeight;

                link.y3 = targetY;
            })
        })
    }
}

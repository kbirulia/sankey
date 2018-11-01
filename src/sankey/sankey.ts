import {descending, min, sum} from "d3-array";
import {map, nest} from "d3-collection";
import {IDimensions, IGraph, INode} from "./sankey.model";
import {descendingBy} from "../utils/descendingBy";

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

    get groups() {
        return this._graph.groups;
    }

    get nodes() {
        return this._graph.nodes;
    }

    get links() {
        return this._graph.links;
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

    public compute() {
        this.computeNodes();
        this.computeNodeLinks();
        this.computeLinks();

        return this._graph;
    }

    private getSortedGroups() {
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

    private computeNodes() {
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

    private computeNodesY() {
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

    private computeNodeLinks() {
        const {nodes, links} = this._graph;

        const nodeMap = map(nodes, node => node.id);
        links.forEach(link => {
            const source = link.source = nodeMap.get(<string>link.source);
            const target = link.target = nodeMap.get(<string>link.target);
            source.sourceLinks.push(link);
            target.targetLinks.push(link);
        });
    }

    private computeLinks() {
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
                link.x0 = link.x1 = sourceX;
                link.y0 = sourceY;

                link.y1 = link.y0 + linkHeight;
                sourceY = link.y1;
            });

            node.targetLinks.forEach(link => {
                const linkHeight = link.value / node.value * nodeHeight;
                link.x2 = link.x3 = targetX;
                link.y2 = targetY;

                link.y3 = link.y2 + linkHeight;
                targetY = link.y3;
            })
        })
    }
}

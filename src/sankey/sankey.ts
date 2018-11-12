import {Map, map} from "d3-collection";
import { sum, max } from "d3-array";
import {IDimensions, IExcludeFromOthers, IGraph, IGroups, ILink, INode} from "./sankey.model";
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
    private _excludeFromOthers: IExcludeFromOthers = {};

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

    get excludeFromOthers(): IExcludeFromOthers {
        return this._excludeFromOthers;
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
            const paddingSum = (nodes.length - 1) * this._nodePadding;
            let leftHeight = chartHeight - paddingSum;
            let leftPercentage = 1;

            ascendingBy(nodes.slice(), 'value')
                .forEach(node => {
                    const nodeHeight = Math.max(leftHeight * node.percentage / leftPercentage, minNodeHeight);
                    node.height = nodeHeight;
                    leftHeight -= nodeHeight;
                    leftPercentage -= node.percentage;
                });

            const nodeSum = Math.floor(sum(nodes, node => node.height) + paddingSum);

            if(nodeSum > chartHeight) {
                nodes = this.reculcGroupWithOthers(nodes);
            }

            let y = y0;
            nodes.forEach(node => {
                node.y = y;
                y = node.y + node.height + this._nodePadding;
            });
        });
    }

    private reculcGroupWithOthers(nodes): INode[] {
        const { y1, y0 } = this._dimensions;
        const chartHeight = y1 - y0;
        const anyNode = nodes[0];

        let counted = 0;
        let nodesHeight = chartHeight;

        const nodeOthers = <INode>{
            id: `${anyNode.group}_others`,
            name: 'Others',
            group: anyNode.group,
            value: this.groups[anyNode.group].value,
            depth: this.groups[anyNode.group].index,
            x: anyNode.x,
            width: anyNode.width,
            height: nodesHeight,
            percentage: 1,
            sourceLinks: [],
            targetLinks: []
        };

        while(counted <= nodes.length) {
            counted++;

            nodesHeight = chartHeight - this._nodePadding * counted;
            nodeOthers.percentage = 1;
            nodeOthers.height = nodesHeight;
            nodeOthers.value = this.groups[anyNode.group].value;

            for(let i = 0; i < counted; i++) {
                const node = nodes[i];
                node.height = Math.max(nodesHeight * node.percentage, minNodeHeight);

                nodeOthers.percentage -= node.percentage;
                nodeOthers.height -= node.height;
                nodeOthers.value -= node.value;
            }

            const othersPlannedHeight = Math.floor(nodeOthers.percentage * nodesHeight);

            if (Math.floor(nodeOthers.height) < othersPlannedHeight) {
                break;
            }
        }

        nodes.splice(counted, nodes.length - counted);

        this._excludeFromOthers[anyNode.group] = nodes.map(node => node.id);


        return this.replaceOthersNodes(nodes, nodeOthers, anyNode.group);
    }

    private replaceOthersNodes(nodes: INode[], others: INode, group: string): INode[] {
        nodes.push(others);

        const mapNodes = map(nodes, node => node.id);
        let indexForOthers = undefined;

        this._graph.nodes = this._graph.nodes.filter((node, index) => {
            if (node.group === group) {
                if (!mapNodes.get(node.id)) {
                    indexForOthers = indexForOthers ? indexForOthers : index;
                    return false;
                }
            }

            return true;
        });

        this._graph.nodes.splice(indexForOthers, 0, others);

        return nodes;
    }

    private removeOthersLinks(nodeMap: Map<INode>) {
        this._graph.links = this._graph.links.filter(link => {
            return nodeMap.get(<string>link.source) && nodeMap.get(<string>link.target)
        })
    }

    private computeNodesYFull(sortedGroups: INode[][]) {
        const maxNodesInGroup = max(sortedGroups, nodes => nodes.length);

        const maxGroupIndex = sortedGroups.findIndex(group => group.length === maxNodesInGroup);
        const maxGroup = sortedGroups.splice(maxGroupIndex, 1)[0];

        const { y0 } = this._dimensions;

            const minHeight = this._minNodeHeigth * maxGroup.length;
            const percentagePerPx = 1 / minHeight;

        descendingBy(maxGroup.slice(), 'value')
            .forEach(node => {
                node.height =  Math.max(node.percentage / percentagePerPx, minNodeHeight);
            });

        let y = y0;
        maxGroup
            .forEach(node => {
                node.y = y;
                y = node.y + node.height + this._nodePadding;
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

        if (Object.keys(this._excludeFromOthers).length) {
            this.removeOthersLinks(nodeMap);
        }

        links.forEach(link => {
            link.id = `${link.source}_${link.target}`;

            const source = nodeMap.get(<string>link.source);
            if (source) {
                link.source = source;
                source.sourceLinks.push(link);
            }

            const target = nodeMap.get(<string>link.target);
            if(target) {
                link.target = target;
                target.targetLinks.push(link);

            }
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

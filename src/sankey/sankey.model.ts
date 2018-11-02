import {BaseType, Selection} from "d3-selection";

export interface INode {
    id: string;
    name: string;
    group: string;
    value: number;
    sourceLinks?: any[];
    targetLinks?: any[];
    depth?: number;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    percentage?: number;
}

export interface ILink {
    target: string | INode;
    source: string | INode;
    value: number;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    y2?: number;
    y3?: number;
}

export interface IGroup {
    index: number;
    value: number;
}

export interface IGraph {
    groups: {
        [key: string]:IGroup
    };
    nodes: INode[];
    links: ILink[];
}

export interface IDimensions {
    x0: number;
    y0: number;
    x1: number;
    y1: number
}

export type TSvgSelection = Selection<BaseType, {}, null, undefined>;

export interface IPickedColors {
    [key: string]: string
}

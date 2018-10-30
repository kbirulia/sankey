import {Selection} from "d3-selection";
import {SankeyGraph, SankeyLinkMinimal, SankeyNodeMinimal} from "d3-sankey";

export interface INode {
    id: string
}

export interface ILink {
    target: string;
    value: number;
    source: string;
}

export interface IPickedColors {
    [key: string]: string
}

export interface IDetails {

}

export type SvgSelection = Selection<SVGSVGElement, {}, null, undefined>;

export type IGraph = SankeyGraph<INode, ILink>
export type ISankeyNode = INode & SankeyNodeMinimal<INode, ILink>;
export type ISankeyLink = ILink & SankeyLinkMinimal<INode, ILink>;
export type ISankeyGraph = SankeyGraph<ISankeyNode, ISankeyLink>

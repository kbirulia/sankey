export const sidePaddingByGroup = {
    2: 250,
    3: 200,
    4: 150,
};

export enum NodeSide {
    left,
    right
}

export const textPositionsByGroup = {
    2: [NodeSide.left, NodeSide.right],
    3: [NodeSide.left, NodeSide.right, NodeSide.right],
    4: [NodeSide.left, NodeSide.left, NodeSide.right, NodeSide.right]
};

export const colorsMap = {
    name_label: '#9b9b9b',
    count_label: '#5e40bf'
};

export const nodePadding = 8;

export const nodeWidth = 24;

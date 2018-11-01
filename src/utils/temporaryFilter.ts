import {IGraph, INode} from "../sankey/sankey.model";

export const temporaryFilter = (data: IGraph, currNode: INode) => {
    const newGroupsDetails = {};
    const newNodeDetails = {};
    const currentGroup = currNode.group;

    const newLinks = data.links.filter(link => {

        if (link.source.id === currNode.id || link.target.id === currNode.id) {

            const nodeToFill = link.source !== currNodeId ? link.source : link.target;
            const groupToFill = details.nodes[nodeToFill].group;

            if (!newNodeDetails[nodeToFill]) {
                newNodeDetails[nodeToFill] = {
                    ...details.nodes[nodeToFill],
                    value: 0
                }
            }

            newNodeDetails[nodeToFill].value += link.value;

            if (!newGroupsDetails[groupToFill]) {
                newGroupsDetails[groupToFill] = 0;
            }

            newGroupsDetails[groupToFill] += link.value;

            return true;
        }
    });

    newGroupsDetails[currentGroup] = details.groups[currentGroup];

    Object.keys(details.nodes).forEach(nodeId => {
        const node = details.nodes[nodeId];
        if (node.group === currentGroup) {
            newNodeDetails[nodeId] = node
        }
    });

    return {
        details: {
            groups: newGroupsDetails,
            nodes: newNodeDetails
        },
        data: {
            nodes: data.nodes,
            links: newLinks
        }
    }
};


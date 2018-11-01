
export const validate = (details, graph) => {
    const nodeGroups = {};
    const nodes = {};

    Object.keys(details.nodes).forEach(nodeId => {
        const groupName = getGroupName(nodeId);
        if (!nodeGroups[groupName]) {
            nodeGroups[groupName] = {
                common: 0,
                in: 0,
                out: 0,
                nodes: {}
            };
        }
        nodeGroups[groupName].common += details.nodes[nodeId].value;
    });

    graph.links.forEach(link => {
        const sourceName = getGroupName(link.source);
        const targetName = getGroupName(link.target);

        nodeGroups[sourceName].out += link.value;
        nodeGroups[targetName].in += link.value;

        if (!nodes[link.source]) {
            nodes[link.source] = {
                in: 0,
                out: 0
            }
        }

        if (!nodes[link.target]) {
            nodes[link.target] = {
                in: 0,
                out: 0
            }
        }

        nodes[link.target].in += link.value;
        nodes[link.source].out += link.value;
    });

    Object.keys(nodeGroups).forEach(groupId => {
        const group = nodeGroups[groupId];
        if ((group.in !== 0 && group.common !== group.in) || ( group.out !== 0 && group.common !== group.out)) {
            console.warn(`Group ${groupId} count and link count weight are not equal`);
        }
    });

    Object.keys(nodes).forEach(nodeId => {
        const node = nodes[nodeId];
        if (node.in !== node.out && (node.in !== 0 && node.out !== 0)) {
            console.warn(`Node ${details.nodes[nodeId].name} in and out are not equal`);
        }
    });
};

const getGroupName = (nodeId) => nodeId.substr(0, nodeId.lastIndexOf('_'));

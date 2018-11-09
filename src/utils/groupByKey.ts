export const groupByKey = (array, key) => array
    .reduce((groups, item) => {
        const groupName = item[key];

        if (!groups) {
            groups = getAccumulator(typeof groupName, key);
        }

        (groups[groupName] = groups[groupName] || []).push(item);
        return groups;
    }, null);

const getAccumulator = (groupNameType, key) => {
    switch (groupNameType) {
        case 'strung': {
            return {}
        }
        case 'number': {
            return []
        }
        default: {
            throw new Error(`Grouping by ${key} is impossible`);
        }
    }
};

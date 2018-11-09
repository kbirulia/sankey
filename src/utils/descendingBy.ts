export const descendingBy = (arr, key) => {
    arr.sort((a ,b) => b[key] - a[key]);
    return arr;
};

export const ascendingBy = (arr, key) => {
    arr.sort((a ,b) => a[key] - b[key]);
    return arr;
};

export const descendingBy = (arr, key) => {
    arr.sort((a ,b) => b[key] - a[key]);
};

export const distinct = <T,>(list: T[], key: keyof T): T[] => {
    return [...new Map(list.map(item => [item[key], item])).values()];
};
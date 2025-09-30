export const distinct = <T,>(list: T[], key: keyof T | (keyof T)[]): T[] => {
    const keys = Array.isArray(key) ? key : [key];
    return [...new Map(list.map(item => {
        const compositeKey = keys.map(k => item[k]).join('|');
        return [compositeKey, item];
    })).values()];
};
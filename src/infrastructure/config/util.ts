export function replaceParams(query: string, values: any[]): string {
    let index = 0;
    return query.replace(/\?/g, () => {
        const value = values[index++];
        if (typeof value === 'string') {
            // If the value is a string, surround it with single quotes
            return `'${value}'`;
        } else {
            // Otherwise, return the value as is
            return value;
        }
    });
}
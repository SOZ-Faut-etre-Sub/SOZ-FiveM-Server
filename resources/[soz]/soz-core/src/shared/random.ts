export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomItem = <T>(values: T[]): T => {
    const index = getRandomInt(0, values.length - 1);

    return values[index];
};

export const getRandomItems = <T>(values: T[], count: number): T[] => {
    const indexes = new Set<number>();
    const minCount = Math.min(count, values.length);

    while (indexes.size < minCount) {
        indexes.add(getRandomInt(0, values.length - 1));
    }

    return Array.from(indexes).map(index => values[index]);
};

export const getRandomKeyWeighted = <T extends keyof any>(values: Record<T, number>): T => {
    const totalWeight = Object.values(values).reduce((acc: number, value: number) => acc + value, 0) as number;
    const random = Math.random() * totalWeight;
    let currentWeight = 0;

    for (const [key, weight] of Object.entries(values)) {
        currentWeight += weight as number;

        if (random < currentWeight) {
            return key as T;
        }
    }

    return Object.keys(values)[0] as T;
};

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomItem = <T>(values: T[]): T => {
    const index = getRandomInt(0, values.length - 1);

    return values[index];
};

export const getRandomEnumValue = <T>(anEnum: T): T[keyof T] => {
    const enumValues = Object.keys(anEnum)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][];
    const randomIndex = Math.floor(Math.random() * enumValues.length);

    return enumValues[randomIndex];
};

export const getRandomItems = <T>(values: T[], count: number): T[] => {
    const indexes = new Set<number>();
    const minCount = Math.min(count, values.length);

    while (indexes.size < minCount) {
        indexes.add(getRandomInt(0, values.length - 1));
    }

    return Array.from(indexes).map(index => values[index]);
};

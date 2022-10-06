export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomItem = <T>(values: T[]): T => {
    const index = getRandomInt(0, values.length - 1);

    return values[index];
};

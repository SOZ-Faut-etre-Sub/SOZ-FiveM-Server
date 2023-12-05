export type LootType = 'item' | 'money';

export type Loot = {
    type: LootType;
    value: string | number;
    chance: number;
};

export const doLooting = (loots: Loot[]): Loot => {
    const totalWeight = loots.reduce((acc, loot) => acc + loot.chance, 0);
    let random = Math.floor(Math.random() * totalWeight);

    return loots.find((loot: Loot) => {
        if (random < loot.chance) {
            return true;
        }

        random -= loot.chance;
        return false;
    });
};

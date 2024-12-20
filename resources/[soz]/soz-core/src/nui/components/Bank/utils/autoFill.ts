export const autoFillAmount = (playerMoney: number, accountMoney: number, accountMaxCapacity: number): number => {
    if (playerMoney <= 0) return 0;
    if (accountMoney >= accountMaxCapacity) return 0;
    return Math.min(playerMoney, accountMaxCapacity - accountMoney);
};

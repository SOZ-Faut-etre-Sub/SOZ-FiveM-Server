import { PlayerData } from '../player';

export interface NuiClothShopMethodMap {
    SetStocks: Record<number, number>;
    SetPlayerData: PlayerData;
}

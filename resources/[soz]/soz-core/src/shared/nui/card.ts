import { PlayerData } from '../player';

export interface NuiCardMethodMap {
    addCard: CardData;
}

export type CardData = {
    type: 'identity' | 'license' | 'health';
    player: PlayerData;
};

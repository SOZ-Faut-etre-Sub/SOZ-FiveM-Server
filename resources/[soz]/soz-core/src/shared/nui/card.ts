import { PlayerData } from '../player';

export interface NuiCardMethodMap {
    addCard: CardData;
}

export type CardData = {
    type: CardType;
    player: PlayerData;
};

export type CardType = 'identity' | 'license' | 'health';

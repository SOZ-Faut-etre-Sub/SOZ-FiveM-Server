import { PlayerData } from '../player';

export interface NuiCardMethodMap {
    addCard: CardData;
}

export type CardData = {
    type: CardType;
    player: PlayerData;
    iban?: string;
};

export type CardType = 'identity' | 'license' | 'health';

import { PlayerData } from '../player';

export interface NuiCardMethodMap {
    addCard: CardData;
}

export type CardData = {
    type: CardType;
    player: PlayerData;
    iban?: string;
    expiration?: number;
};

export type CardType = 'identity' | 'license' | 'health' | 'bank' | 'casino_standard' | 'casino_premium';

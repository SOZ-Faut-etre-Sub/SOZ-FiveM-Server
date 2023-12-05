import { FishItem } from './item';

export interface PlayerFish {
    citizenId: string;
    fishId: string;
    quantity: number;
    maxWidth: number;
    maxWeight: number;
    maxResell: number;
    lastFishAt: Date;
}

export interface FishWithCompletion extends FishItem {
    completion: {
        quantity: number;
        maxWidth: number;
        maxWeight: number;
        maxResell: number;
        lastFishAt: Date;
        fishTier: any;
    };
}

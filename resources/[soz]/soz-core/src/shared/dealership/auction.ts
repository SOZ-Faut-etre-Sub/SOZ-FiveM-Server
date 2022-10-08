import { Vector3 } from '../polyzone/vector';

export type Auction = {
    model: string;
    hash: string;
    name: string;
    category: string;
    pos: number[];
    window: {
        pos: Vector3;
        length: number;
        width: number;
        options: {
            heading: number;
            minZ: number;
            maxZ: number;
            debugPoly?: boolean;
        };
    };
    minimumBidPrice: number;
    bestBidCitizenId: string;
    bestBidAccount: string;
    bestBidName: string;
    bestBidPrice: number;
    required_licence?: string;
};

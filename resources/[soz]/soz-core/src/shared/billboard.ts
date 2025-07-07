import { Vector3 } from './polyzone/vector';

export type Billboard = {
    id?: number;
    name: string;
    position: string;
    originDictName: string;
    originTextureName: string;
    imageUrl: string;
    previewImageUrl: string;
    templateImageUrl: string;
    width: number;
    height: number;
    lastEdit?: Date;
    lastEditor: string;
    enabled: boolean;
    owner: string;
};

export const billboardOffsets: Record<
    number,
    {
        offsets: Vector3[];
        width: number;
        height: number;
    }
> = {
    [GetHashKey('soz_news_billboard_01')]: {
        offsets: [
            [0.589, -0.076625, 1.40922],
            [0.589, -0.076625, -0.261406],
            [-0.589, -0.076625, 1.40922],
            [-0.589, -0.076625, -0.261406],
        ],
        width: 724,
        height: 1024,
    },
    [GetHashKey('soz_news_billboard_02')]: {
        offsets: [
            [2.2, -2.15, 16.85],
            [2.2, -2.15, 9.81],
            [-2.2, -2.15, 16.85],
            [-2.2, -2.15, 9.81],
        ],
        width: 648,
        height: 1024,
    },
    [GetHashKey('soz_news_billboard_03')]: {
        offsets: [
            [6.7, -0.53, 5.6],
            [6.7, -0.53, 0.28],
            [-7.22, -0.53, 5.6],
            [-7.22, -0.53, 0.28],
        ],
        width: 1338,
        height: 512,
    },
};

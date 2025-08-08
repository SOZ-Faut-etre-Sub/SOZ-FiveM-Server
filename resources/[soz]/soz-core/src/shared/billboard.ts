import { JobType } from './job';
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
        offset: Vector3;
        width: number;
        height: number;
        mapping: string;
        textures: string[];
        max: Partial<Record<JobType, number>>;
    }
> = {
    [GetHashKey('soz_news_billboard_01')]: {
        offsets: [
            [0.589, -0.076625, 1.40922],
            [0.589, -0.076625, -0.261406],
            [-0.589, -0.076625, 1.40922],
            [-0.589, -0.076625, -0.261406],
        ],
        offset: [0, 0, 0],
        mapping: 'soz_news_billboard_01_',
        width: 724,
        height: 1024,
        textures: ['soz_txd_newsbill_01_media_1'],
        max: {
            [JobType.News]: 20,
            [JobType.YouNews]: 20,
            [JobType.FBI]: 2,
        },
    },
    [GetHashKey('soz_news_billboard_02')]: {
        offsets: [
            [2.2, -2.15, 16.85],
            [2.2, -2.15, 9.81],
            [-2.2, -2.15, 16.85],
            [-2.2, -2.15, 9.81],
        ],
        offset: [0, 0, 0],
        mapping: 'soz_news_billboard_02_',
        width: 648,
        height: 1024,
        textures: ['soz_txd_newsbill_02_media_1'],
        max: {
            [JobType.News]: 10,
            [JobType.YouNews]: 10,
            [JobType.FBI]: 2,
        },
    },
    [GetHashKey('soz_news_billboard_03')]: {
        offsets: [
            [6.7, -0.53, 5.6],
            [6.7, -0.53, 0.28],
            [-7.22, -0.53, 5.6],
            [-7.22, -0.53, 0.28],
        ],
        offset: [0, 0, 0],
        mapping: 'soz_news_billboard_03_',
        width: 1338,
        height: 512,
        textures: ['soz_txd_newsbill_03_media_1'],
        max: {
            [JobType.News]: 10,
            [JobType.YouNews]: 10,
            [JobType.FBI]: 2,
        },
    },
};

export function getScreenModel(baseModel: number, index: number): string {
    return billboardOffsets[baseModel].mapping + index.toString().padStart(3, '0');
}

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

export const billboardOffsets: Record<number, Vector3[]> = {
    [GetHashKey('soz_news_billboard_01')]: [
        [0.589, -0.0595625, 1.40922],
        [0.589, -0.0595625, -0.261406],
        [-0.589, -0.0595625, 1.40922],
        [-0.589, -0.0595625, -0.261406],
    ],
};

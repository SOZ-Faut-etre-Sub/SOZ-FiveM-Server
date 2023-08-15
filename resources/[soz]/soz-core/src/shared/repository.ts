import { Vector3 } from './polyzone/vector';

export type Billboard = {
    id: number;
    name: string;
    position: Vector3;
    originDictName: string;
    originTextureName: string;
    imageUrl: string;
    previewImageUrl: string;
    width: number;
    height: number;
    lastEdit: Date;
    lastEditor: number;
    enabled: boolean;
};

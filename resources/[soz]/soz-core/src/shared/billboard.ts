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
    lastEdit?: number;
    lastEditor: number;
    enabled: boolean;
};

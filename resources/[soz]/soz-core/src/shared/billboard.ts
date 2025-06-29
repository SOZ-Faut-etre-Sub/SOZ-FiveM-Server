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

export type BillboardModels = {
    [key: string]: {
        name: string;
        width: number;
        height: number;
        originDictName: string;
        originTextureName: string;
        templateImageUrl: string;
    };
};

import { Inject, Injectable } from '@public/core/decorators/injectable';

import { TextureReplacerProvider } from '../object/texture.replacer.provider';

@Injectable()
export class BillboardService {
    @Inject(TextureReplacerProvider)
    private textureReplacerProvider: TextureReplacerProvider;

    public loadBillboard(imageUrl: string, dictName: string, textureName: string) {
        this.textureReplacerProvider.replaceTexture({
            baseDict: dictName,
            baseTexture: textureName,
            url: imageUrl,
        });
    }
}

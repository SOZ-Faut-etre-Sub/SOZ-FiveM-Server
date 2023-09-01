import { Injectable } from '@public/core/decorators/injectable';

@Injectable()
export class BillboardService {
    public loadBillboard(
        imageUrl: string,
        dictName: string,
        textureName: string,
        width: number,
        height: number,
        name: string
    ) {
        const dict = CreateRuntimeTxd(name);
        const dui = CreateDui(imageUrl, width, height);
        const duiHandle = GetDuiHandle(dui);
        CreateRuntimeTextureFromDuiHandle(dict, `${name}_texture`, duiHandle);
        RemoveReplaceTexture(dictName, textureName);
        AddReplaceTexture(dictName, textureName, name, `${name}_texture`);
    }
}

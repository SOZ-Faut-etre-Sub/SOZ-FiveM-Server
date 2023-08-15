import { Once, OnceStep } from '@public/core/decorators/event';
import { Provider } from '@public/core/decorators/provider';

@Provider()
export class BillboardProvider {

    @Once(OnceStep.Start)
    public init() {
        const dict = CreateRuntimeTxd('billboard_triptique');
        const dui = CreateDui('https://images.unsplash.com/photo-1512850183-6d7990f42385', 800, 2000);
        const duiHandle = GetDuiHandle(dui);
        const runtime = CreateRuntimeTextureFromDuiHandle(dict, 'triptique', duiHandle);
        console.log('INIT DONE', runtime, duiHandle, dui, dict);
        AddReplaceTexture('sp1_12_billboards+hi', 'sp1_12_branding_tpage_d', 'billboard_triptique', 'triptique');
    }
}

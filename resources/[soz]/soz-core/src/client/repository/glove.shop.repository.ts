import { Injectable } from '@core/decorators/injectable';
import { emitRpc } from '@core/rpc';
import { GlovesItem } from '@public/shared/cloth';

import { RpcServerEvent } from '../../shared/rpc';
import { GloveShopRepositoryData } from '../../shared/shop';

@Injectable()
export class GloveShopRepository {
    private repoData: GloveShopRepositoryData;

    public async load() {
        if (this.repoData) {
            return;
        }

        this.repoData = await emitRpc<GloveShopRepositoryData>(RpcServerEvent.REPOSITORY_GET_DATA, 'gloveShop');
    }

    public update(data: GloveShopRepositoryData) {
        this.repoData = data;
    }

    public async getGloves(id: number): Promise<GlovesItem> {
        // getGloves is called by in resources\[soz]\soz-character\client\skin\apply.lua as an Exportable
        // in case soz-character is loaded before soz-core, we need to make sure the repoData is loaded before the exportable is called
        // then, simply check if repoData is loaded, and if not, load it. Meant to happen eventually at client start
        if (!this.repoData) {
            await this.load();
        }
        return this.repoData[id];
    }

    public getAllGloves(): Record<number, GlovesItem> {
        return this.repoData;
    }
}

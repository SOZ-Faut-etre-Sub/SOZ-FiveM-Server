import { Injectable } from '@core/decorators/injectable';
import { emitRpc } from '@core/rpc';

import { RpcServerEvent } from '../../shared/rpc';
import { UnderTypesShopRepositoryData } from '../../shared/shop';

@Injectable()
export class UnderTypesShopRepository {
    private repoData: UnderTypesShopRepositoryData;

    public async load() {
        if (this.repoData) {
            return;
        }

        this.repoData = await emitRpc<UnderTypesShopRepositoryData>(
            RpcServerEvent.REPOSITORY_GET_DATA,
            'underTypesShop'
        );
    }

    public update(data: UnderTypesShopRepositoryData) {
        this.repoData = data;
    }

    public getUnderTypes(id: number): number[] {
        return this.repoData[id];
    }

    public getAllUnderTypes(): Record<number, number[]> {
        return this.repoData;
    }
}

import { joaat } from '@public/shared/joaat';
import { ModelSwap } from '@public/shared/modelswap';
import { getDistance, Vector3, Vector4 } from '@public/shared/polyzone/vector';

import { Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { Repository } from './repository';

@Injectable(ModelSwapRepository, Repository)
export class ModelSwapRepository extends Repository<RepositoryType.ModelSwap> {
    public type = RepositoryType.ModelSwap;

    private swapPerModel = new Map<number, ModelSwap[]>();

    public load() {
        const swaps = this.get();
        for (const swap of swaps) {
            const perModel = this.swapPerModel.get(joaat(swap.source)) ?? [];
            perModel.push(swap);
            this.swapPerModel.set(joaat(swap.source), perModel);
        }
    }

    public addSwap(swap: ModelSwap) {
        const perModel = this.swapPerModel.get(joaat(swap.source)) ?? [];
        perModel.push(swap);
        this.swapPerModel.set(joaat(swap.source), perModel);
    }

    public removeSwap(swap: ModelSwap) {
        const perModel = this.swapPerModel.get(joaat(swap.source)) ?? [];
        const index = perModel.findIndex(elem => elem.id === swap.id);
        if (index >= 0) {
            perModel.splice(index, 1);
        }
    }

    public findSwap(model: number, position: Vector3 | Vector4) {
        const perModel = this.swapPerModel.get(model) ?? [];
        return perModel.find(elem => getDistance(position, elem.position) <= elem.range);
    }
}

import { ModelSwap } from '@public/shared/modelswap';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { RepositoryType } from '../../shared/repository';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(ModelSwapRepository, Repository)
export class ModelSwapRepository extends Repository<RepositoryType.ModelSwap> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.ModelSwap;

    private swapPerModel = new Map<string, ModelSwap[]>();

    protected async load(): Promise<Record<number, ModelSwap>> {
        const swaps = await this.prismaService.model_swap.findMany();
        const list: Record<number, ModelSwap> = {};

        for (const swap of swaps) {
            list[swap.id] = {
                id: swap.id,
                source: swap.source,
                target: swap.target,
                position: JSON.parse(swap.position),
                range: swap.range,
            };

            const perModel = this.swapPerModel.get(swap.source) ?? [];
            perModel.push(list[swap.id]);
            this.swapPerModel.set(swap.source, perModel);
        }

        return list;
    }

    public async addSwap(swap: ModelSwap): Promise<void> {
        const addedSwap = await this.prismaService.model_swap.create({
            data: {
                source: swap.source,
                target: swap.target,
                position: JSON.stringify(swap.position),
                range: swap.range,
            },
        });

        swap.id = addedSwap.id;

        const perModel = this.swapPerModel.get(swap.source) ?? [];
        perModel.push(swap);
        this.swapPerModel.set(swap.source, perModel);

        await this.set(swap.id, swap);
    }

    public async removeSwap(id: number): Promise<void> {
        const swap = await this.prismaService.model_swap.delete({
            where: {
                id,
            },
        });

        const perModel = this.swapPerModel.get(swap.source) ?? [];
        const index = perModel.findIndex(elem => elem.id === id);
        if (index >= 0) {
            perModel.slice(index, 1);
        }

        this.delete(id);
    }
}

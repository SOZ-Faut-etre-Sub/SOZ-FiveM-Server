import { Injectable } from '@core/decorators/injectable';
import { RepositoryType } from '@public/shared/repository';
import { TowRope } from '@public/shared/vehicle/tow.rope';

import { Repository } from './repository';

@Injectable(TowRopeRepository, Repository)
export class TowRopeRepository extends Repository<RepositoryType.TowRope> {
    public type = RepositoryType.TowRope;

    protected async load(): Promise<Record<string, TowRope>> {
        return {};
    }

    public async addRope(rope: TowRope): Promise<void> {
        await this.set(rope.id, rope);
    }

    public async removeRope(id: string): Promise<void> {
        await this.delete(id);
    }
}

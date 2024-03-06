import { RepositoryType } from '@public/shared/repository';

import { Inject, Injectable } from '../../core/decorators/injectable';
import { JobType } from '../../shared/job';
import { Vehicle } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable(VehicleRepository, Repository)
export class VehicleRepository extends Repository<RepositoryType.Vehicle> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    public type = RepositoryType.Vehicle;

    protected async load(): Promise<Record<string, Vehicle>> {
        const rows = await this.prismaService.vehicle.findMany();
        const list = {};

        for (const row of rows) {
            const veh: Vehicle = {
                ...row,
                jobName: JSON.parse(row.jobName) as { [key in JobType]: string },
                handling: row.handling ? JSON.parse(row.handling) : null,
            };

            list[veh.model] = veh;
        }

        return list;
    }

    public async findByModel(model: string): Promise<Vehicle | null> {
        return (await this.get()).find(v => v.model === model) ?? null;
    }

    public async findByHash(modelHash: number): Promise<Vehicle | null> {
        return (await this.get()).find(v => v.hash === modelHash) ?? null;
    }
}

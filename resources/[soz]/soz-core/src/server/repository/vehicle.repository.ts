import { Inject, Injectable } from '../../core/decorators/injectable';
import { JobType } from '../../shared/job';
import { Vehicle } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { RepositoryLegacy } from './repository';

@Injectable()
export class VehicleRepository extends RepositoryLegacy<Vehicle[]> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<Vehicle[]> {
        return (await this.prismaService.vehicle.findMany())
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(v => ({
                ...v,
                jobName: JSON.parse(v.jobName) as { [key in JobType]: string },
            }));
    }

    public async findByModel(model: string): Promise<Vehicle | null> {
        return (await this.get()).find(v => v.model === model) ?? null;
    }

    public async findByHash(modelHash: number): Promise<Vehicle | null> {
        return (await this.get()).find(v => v.hash === modelHash) ?? null;
    }
}

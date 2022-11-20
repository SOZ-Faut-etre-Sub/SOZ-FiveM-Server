import { Inject, Injectable } from '../../core/decorators/injectable';
import { JobType } from '../../shared/job';
import { Vehicle, VehicleMaxStock } from '../../shared/vehicle/vehicle';
import { PrismaService } from '../database/prisma.service';
import { Repository } from './repository';

@Injectable()
export class VehicleRepository extends Repository<Vehicle[]> {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    protected async load(): Promise<Vehicle[]> {
        return (await this.prismaService.vehicle.findMany())
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(v => ({
                ...v,
                jobName: JSON.parse(v.jobName) as { [key in JobType]: string },
                maxStock: VehicleMaxStock[v.category],
            }));
    }

    public async findByModel(model: string): Promise<Vehicle | null> {
        return (await this.get()).find(v => v.model === model) ?? null;
    }
}

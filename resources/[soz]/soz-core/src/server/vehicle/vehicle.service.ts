import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { JobType } from '../../shared/job';
import { getRandomInt } from '../../shared/random';
import { PrismaService } from '../database/prisma.service';
import { JobService } from '../job.service';

@Provider()
export class VehicleService {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(JobService)
    private jobService: JobService;

    public getVehicle(hash: number) {
        return this.prismaService.vehicle.findFirst({
            where: {
                hash,
            },
        });
    }

    public async generatePlate(): Promise<string> {
        let plate;
        do {
            const firstPart = getRandomInt(0, 9).toString(10);
            const secondPart = Math.random().toString(36).slice(2, 4).toUpperCase();
            const thirdPart = getRandomInt(100, 999).toString(10);
            const fourthPart = Math.random().toString(36).slice(2, 4).toUpperCase();

            plate = firstPart + secondPart + thirdPart + fourthPart;
        } while (await this.prismaService.playerVehicle.findFirst({ where: { plate: plate } }));
        return plate;
    }

    public async generateJobPlate(jobId: JobType): Promise<string> {
        const prefix = this.jobService.getJob(jobId).platePrefix;

        let plate;
        do {
            plate = prefix + ' ' + getRandomInt(100, 999);
        } while (await this.prismaService.playerVehicle.findFirst({ where: { plate: plate } }));
        return plate;
    }
}

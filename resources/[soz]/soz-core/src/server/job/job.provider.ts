import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Job } from '../../shared/job';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { JobService } from '../job.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';

@Provider()
export class JobProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Rpc(RpcServerEvent.JOB_GET_JOBS)
    public async getJobs(): Promise<Job[]> {
        const jobs = this.jobService.getJobs();

        const grades = await this.prismaService.job_grades.findMany({
            orderBy: {
                jobId: 'asc',
            },
        });

        for (const job of Object.values(jobs)) {
            job.grades = [];
        }

        for (const grade of grades) {
            const job = jobs[grade.jobId];

            if (job) {
                job.grades.push({
                    id: grade.id,
                    jobId: grade.jobId,
                    salary: grade.salary,
                    name: grade.name,
                    is_default: grade.is_default === 1,
                    owner: grade.owner,
                    permissions: JSON.parse(grade.permissions),
                    weight: grade.weight,
                });
                job.id = grade.jobId;
            }
        }

        return Object.values(jobs).filter(job => job.grades.length > 0);
    }

    @Rpc(RpcServerEvent.JOBS_USE_WORK_CLOTHES)
    public async useWorkClothes(source: number, storageId: string) {
        return this.inventoryManager.removeItemFromInventory(storageId, 'work_clothes', 1);
    }
}

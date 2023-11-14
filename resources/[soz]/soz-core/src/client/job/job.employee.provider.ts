import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { JobPermission, JobType } from '../../shared/job';
import { JobRegistry } from '../../shared/job/config';
import { MenuType } from '../../shared/nui/menu';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { JobGradeRepository } from '../repository/job.grade.repository';
import { TargetFactory } from '../target/target.factory';
import { JobService } from './job.service';

@Provider()
export class JobEmployeeProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(JobGradeRepository)
    private jobGradeRepository: JobGradeRepository;

    @Once(OnceStep.PlayerLoaded)
    public loadEmployeeProvider() {
        this.targetFactory.createForAllPlayer([
            {
                label: "Recruter dans l'entreprise",
                icon: 'c:jobs/enroll.png',
                blackoutGlobal: true,
                canInteract: (entity: number) => {
                    return this.canInteract(entity, JobType.Unemployed);
                },
                action: (entity: number) => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(ServerEvent.JOB_RECRUIT, targetSource);
                },
            },
            {
                label: "Virer de l'entreprise",
                icon: 'c:jobs/fire.png',
                blackoutGlobal: true,
                canInteract: (entity: number) => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return this.canInteract(entity, player.job.id);
                },
                action: (entity: number) => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(ServerEvent.JOB_FIRE, targetSource);
                },
            },
            {
                label: 'Promouvoir',
                icon: 'c:jobs/promote.png',
                blackoutGlobal: true,
                canInteract: (entity: number) => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return this.canInteract(entity, player.job.id);
                },
                action: (entity: number) => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return;
                    }

                    const grades = this.jobGradeRepository.getGradesByJob(player.job.id);

                    this.nuiMenu.openMenu(MenuType.Promote, {
                        grades,
                        target: targetSource,
                    });
                },
            },
        ]);
    }

    @OnNuiEvent(NuiEvent.JobPromote)
    public async onPromote({ gradeId, target }: { gradeId: number; target: number }) {
        this.nuiMenu.closeMenu();
        TriggerServerEvent(ServerEvent.JOB_PROMOTE, target, gradeId);
    }

    private async canInteract(entity: number, targetJobRequired: JobType): Promise<boolean> {
        const player = this.playerService.getPlayer();

        if (!player) {
            return false;
        }

        const job = JobRegistry[player.job.id];

        if (!job) {
            return false;
        }

        if (
            !this.jobService.hasPermission(player.job.id, JobPermission.ManageGrade) &&
            !this.jobService.hasPermission(player.job.id, JobPermission.Enrollment)
        ) {
            return false;
        }

        const playerPosition = GetEntityCoords(PlayerPedId()) as Vector3;
        let inZone = false;

        for (const zone of job.bossZones) {
            const boxZone = BoxZone.fromZone(zone);

            if (boxZone.isPointInside(playerPosition)) {
                inZone = true;
                break;
            }
        }

        if (!inZone) {
            return false;
        }

        const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
        const targetJob = await emitRpc<JobType>(RpcServerEvent.PLAYER_GET_JOB, targetSource);

        return targetJob === targetJobRequired;
    }
}

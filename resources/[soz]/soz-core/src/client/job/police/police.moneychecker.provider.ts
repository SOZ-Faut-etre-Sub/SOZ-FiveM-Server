import { Notifier } from '@public/client/notifier';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnceStep, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { NuiEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { MenuType } from '@public/shared/nui/menu';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

const moneycheckerInfos = [
    {
        job: JobType.LSPD,
        position: [586.82, 13.41, 76.63] as Vector3,
        length: 2.4,
        width: 0.8,
        heading: 350,
        minZ: 76.63,
        maxZ: 77.63,
    },
    {
        job: JobType.BCSO,
        position: [1857.69, 3687.39, 30.27] as Vector3,
        length: 2.4,
        width: 0.8,
        heading: 210,
        minZ: 29.27,
        maxZ: 32.27,
    },
];

@Provider()
export class PoliceMoneyCheckerProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Once(OnceStep.Start)
    public async onStart() {
        for (const moneycheckerInfo of moneycheckerInfos) {
            this.targetFactory.createForBoxZone(
                `${moneycheckerInfo.job}:moneychecker`,
                {
                    center: moneycheckerInfo.position,
                    length: moneycheckerInfo.length,
                    width: moneycheckerInfo.width,
                    heading: moneycheckerInfo.heading,
                    minZ: moneycheckerInfo.minZ,
                    maxZ: moneycheckerInfo.maxZ,
                },
                [
                    {
                        label: 'Analyser',
                        color: moneycheckerInfo.job,
                        icon: 'c:police/fouiller.png',
                        job: moneycheckerInfo.job,
                        blackoutGlobal: true,
                        blackoutJob: moneycheckerInfo.job,
                        canInteract: () => {
                            const [player, distance] = this.playerService.getClosestPlayer();

                            return this.playerService.getPlayer().job.onduty && player != -1 && distance <= 2.0;
                        },
                        action: async () => {
                            const [player, distance] = this.playerService.getClosestPlayer();

                            if (player != -1 && distance <= 2.0) {
                                const { completed } = await this.progressService.progress(
                                    'police-moneychecker',
                                    'Analyse en cours...',
                                    Math.floor(Math.random() * (7000 - 5000 + 1) + 5000),
                                    null,
                                    {
                                        disableMovement: true,
                                        disableCarMovement: true,
                                        disableMouse: false,
                                        disableCombat: true,
                                    }
                                );
                                if (!completed) {
                                    return;
                                }
                                const target = GetPlayerServerId(player);
                                const amount = await emitRpc<number>(RpcServerEvent.POLICE_GET_MARKED_MONEY, target);
                                this.nuiMenu.openMenu(MenuType.PoliceJobMoneychecker, {
                                    job: this.playerService.getPlayer().job.id,
                                    playerServerId: target,
                                    amount: amount,
                                });
                            } else {
                                this.notifier.error('Aucun joueur à proximité');
                            }
                        },
                    },
                ],
                2.5
            );
        }
    }

    @OnNuiEvent(NuiEvent.PoliceGatherMoneyMarked)
    public async gatherMoneyMarked(target: number): Promise<void> {
        this.nuiMenu.closeMenu();
        const { completed } = await this.progressService.progress(
            'police-gathermoneymarked',
            'Confiscation...',
            6000,
            null,
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
            }
        );
        if (!completed) {
            return;
        }
        TriggerServerEvent(ServerEvent.POLICE_CONFISCATE_MONEY, GetPlayerServerId(target));
    }
}

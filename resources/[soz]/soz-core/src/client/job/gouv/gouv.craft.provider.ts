import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { JobService } from '@public/client/job/job.service';
import { Notifier } from '@public/client/notifier';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { wait } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event';
import { JobPermission, JobType } from '@public/shared/job';
import { SEARCH_WARRANT_PRICE } from '@public/shared/job/gouv';

@Provider()
export class GouvCraftProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Once(OnceStep.PlayerLoaded)
    public setupGouvCraftSearchWarrant() {
        this.targetFactory.createForBoxZone(
            'gouv_search_warrant',
            {
                center: [-526.49, -589.71, 33.88],
                length: 0.8,
                width: 1.0,
                heading: 269.04,
                minZ: 33.48,
                maxZ: 34.88,
            },
            [
                {
                    icon: 'pawl/craft-paper',
                    label: 'Ecrire un mandat de perquisition',
                    job: JobType.Gouv,
                    blackoutGlobal: true,
                    blackoutJob: JobType.Gouv,
                    category: 'society',
                    canInteract: () => {
                        return this.jobService.hasPermission(JobType.Gouv, JobPermission.Craft);
                    },
                    action: async () => {
                        const player = this.playerService.getPlayer();
                        if (
                            player.money.money < SEARCH_WARRANT_PRICE ||
                            !this.inventoryManager.hasEnoughItem('paper')
                        ) {
                            this.notifier.notify(
                                "Vous avez besoin d'une ~b~feuille de papier~s~ et de ~b~$500 000~s~ pour écrire un mandat de perquisition.",
                                'error'
                            );
                            return;
                        }

                        this.playerService.updateState({ disableMoneyCase: true });
                        await wait(150);

                        const { completed } = await this.progressService.progress(
                            'write_search_warrant',
                            'Ecriture du mandat de perquisition...',
                            90000,
                            {
                                dictionary: 'missheistdockssetup1clipboard@base',
                                name: 'base',
                                options: {
                                    repeat: true,
                                },
                                props: [
                                    {
                                        model: 'prop_notepad_01',
                                        bone: 18905,
                                        position: [0.09999999999999432, 0.020000000000003126, 0.04999999999999716],
                                        rotation: [10, 0, 0],
                                    },
                                    {
                                        model: 'prop_pencil_01',
                                        bone: 58866,
                                        position: [0.11000000000001364, -0.020000000000003126, 0.0009999999999998899],
                                        rotation: [-120, 0, 0],
                                    },
                                ],
                            }
                        );
                        this.playerService.updateState({ disableMoneyCase: false });

                        if (!completed) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.GOUV_CRAFT_SEARCH_WARRANT);
                    },
                },
            ]
        );
    }
}

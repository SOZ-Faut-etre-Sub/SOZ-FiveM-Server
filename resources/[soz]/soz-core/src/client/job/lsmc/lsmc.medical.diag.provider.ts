import { AnimationRunner } from '@public/client/animation/animation.factory';
import { AnimationService } from '@public/client/animation/animation.service';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { Once, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { MedicalMetadata } from '@public/shared/item';
import { JobType } from '@public/shared/job';
import { LSMCConfig } from '@public/shared/job/lsmc';
import { Vector3 } from '@public/shared/polyzone/vector';

@Provider()
export class LSMCMedicalDiagProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private anim: AnimationRunner = null;

    @OnEvent(ClientEvent.LSMC_SHOW_MEDICAL_DIAG)
    public async showMedicalDiag(data: MedicalMetadata) {
        this.nuiDispatch.dispatch('medicalDiag', 'open', data);
    }

    @OnNuiEvent(NuiEvent.LsmcMedicalDiagExit)
    public async exitMedicalDiag() {
        if (this.anim) {
            this.anim.cancel();
            this.anim = null;
        }
    }

    @Once()
    public inspectPatient() {
        this.targetFactory.createForModel('soz_lsmc_operationrm_irm', [
            {
                label: 'Lancer un scan',
                blackoutJob: JobType.LSMC,
                color: JobType.LSMC,
                job: JobType.LSMC,
                blackoutGlobal: true,
                icon: 'ems/irm',
                category: 'society',
                canInteract: () => {
                    const playerPed = PlayerPedId();
                    const coord = GetEntityCoords(playerPed) as Vector3;
                    const players = this.playerService.getPlayersAround(coord, 3.0, true, player => {
                        const ped = GetPlayerPed(player);
                        return (
                            IsEntityPlayingAnim(ped, 'anim@gangops@morgue@table@', 'body_search', 3) ||
                            IsEntityPlayingAnim(ped, 'dead', 'dead_a', 3)
                        );
                    });

                    return players.length > 0;
                },
                action: async entity => {
                    const coords = GetOffsetFromEntityInWorldCoords(entity, 0.7, -1.0, 0.0) as Vector3;
                    const heading = GetEntityHeading(entity);
                    await this.animationService.walkToCoords([...coords, heading], 6000);

                    this.anim = this.animationService.playAnimation({
                        base: {
                            dictionary: 'mp_fib_grab',
                            name: 'loop',
                            options: { repeat: true },
                        },
                    });

                    const { completed } = await this.progressService.progress(
                        'damage_inspection',
                        'Scan du patient...',
                        LSMCConfig.scanTime
                    );

                    if (!completed) {
                        this.anim.cancel();
                        this.anim = null;
                        return;
                    }

                    const playerPed = PlayerPedId();
                    const coord = GetEntityCoords(playerPed) as Vector3;
                    const players = this.playerService.getPlayersAround(coord, 3.0, true, player => {
                        const ped = GetPlayerPed(player);
                        return (
                            IsEntityPlayingAnim(ped, 'anim@gangops@morgue@table@', 'body_search', 3) ||
                            IsEntityPlayingAnim(ped, 'dead', 'dead_a', 3)
                        );
                    });

                    if (players.length == 0) {
                        return;
                    }

                    TriggerServerEvent(ServerEvent.LSMC_SCAN, players[0]);
                },
            },
        ]);
    }
}

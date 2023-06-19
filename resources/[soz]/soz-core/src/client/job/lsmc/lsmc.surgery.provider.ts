import { Once } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { BlipFactory } from '@public/client/blip';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { Monitor } from '@public/client/monitor/monitor';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { emitRpc } from '@public/core/rpc';
import { Organ } from '@public/shared/disease';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';

import { LSMCDeathProvider } from './lsmc.death.provider';

const surgery = BoxZone.fromZone({
    center: [334.97, -1446.74, 32.51] as Vector3,
    length: 8.4,
    width: 6.2,
    heading: 320,
    debugPoly: false,
    minZ: 31.51,
    maxZ: 34.51,
});

@Provider()
export class LSMCSurgeryProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(ProgressService)
    public progressService: ProgressService;

    @Inject(LSMCDeathProvider)
    public LSMCDeathProvider: LSMCDeathProvider;

    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(Monitor)
    public monitor: Monitor;

    @Once()
    public onStart() {
        let organ: Organ = null;
        this.targetFactory.createForAllPlayer([
            {
                label: 'Enlever un Poumon',
                color: JobType.LSMC,
                icon: 'c:ems/remove_poumon.png',
                job: JobType.LSMC,
                blackoutGlobal: true,
                blackoutJob: JobType.LSMC,
                canInteract: async entity => {
                    if (!this.playerService.isOnDuty()) {
                        return false;
                    }

                    if (!IsEntityPlayingAnim(entity, 'anim@gangops@morgue@table@', 'body_search', 3)) {
                        return false;
                    }

                    if (!surgery.isPointInside(GetEntityCoords(entity) as Vector3)) {
                        return false;
                    }

                    const id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    organ = await emitRpc<Organ>(RpcServerEvent.LSMC_GET_CURRENT_ORGAN, id);

                    return !organ;
                },
                action: async entity => {
                    const { completed } = await this.progressService.progress(
                        'Soigner',
                        'Enlever un Poumon..',
                        10000,
                        {
                            dictionary: 'mini@repair',
                            name: 'fixing_a_ped',
                        },
                        {
                            disableMovement: true,
                            disableCarMovement: true,
                        }
                    );

                    if (!completed) {
                        return;
                    }

                    const id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(ServerEvent.LSMC_SET_CURRENT_ORGAN, 'poumon', id);
                },
            },
            {
                label: 'Enlever un Rein',
                color: JobType.LSMC,
                icon: 'c:ems/remove_rein.png',
                job: JobType.LSMC,
                blackoutGlobal: true,
                blackoutJob: JobType.LSMC,
                canInteract: async entity => {
                    if (!this.playerService.isOnDuty()) {
                        return false;
                    }

                    if (!IsEntityPlayingAnim(entity, 'anim@gangops@morgue@table@', 'body_search', 3)) {
                        return false;
                    }

                    if (!surgery.isPointInside(GetEntityCoords(entity) as Vector3)) {
                        return false;
                    }

                    const id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    organ = await emitRpc<Organ>(RpcServerEvent.LSMC_GET_CURRENT_ORGAN, id);

                    return !organ;
                },
                action: async entity => {
                    const { completed } = await this.progressService.progress(
                        'Soigner',
                        'Enlever un Rein..',
                        10000,
                        {
                            dictionary: 'mini@repair',
                            name: 'fixing_a_ped',
                        },
                        {
                            disableMovement: true,
                            disableCarMovement: true,
                        }
                    );

                    if (!completed) {
                        return;
                    }

                    const id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(ServerEvent.LSMC_SET_CURRENT_ORGAN, 'rein', id);
                },
            },
            {
                label: 'Enlever le Foie',
                color: JobType.LSMC,
                icon: 'c:ems/remove_foie.png',
                job: JobType.LSMC,
                blackoutGlobal: true,
                blackoutJob: JobType.LSMC,
                canInteract: async entity => {
                    if (!this.playerService.isOnDuty()) {
                        return false;
                    }

                    if (!IsEntityPlayingAnim(entity, 'anim@gangops@morgue@table@', 'body_search', 3)) {
                        return false;
                    }

                    if (!surgery.isPointInside(GetEntityCoords(entity) as Vector3)) {
                        return false;
                    }

                    const id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    organ = await emitRpc<Organ>(RpcServerEvent.LSMC_GET_CURRENT_ORGAN, id);

                    return !organ;
                },
                action: async entity => {
                    const { completed } = await this.progressService.progress(
                        'Soigner',
                        'Enlever le Foie..',
                        10000,
                        {
                            dictionary: 'mini@repair',
                            name: 'fixing_a_ped',
                        },
                        {
                            disableMovement: true,
                            disableCarMovement: true,
                        }
                    );

                    if (!completed) {
                        return;
                    }

                    const id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(ServerEvent.LSMC_SET_CURRENT_ORGAN, 'foie', id);
                },
            },
            {
                label: 'greffer',
                color: JobType.LSMC,
                icon: 'c:ems/greffer.png',
                job: JobType.LSMC,
                blackoutGlobal: true,
                blackoutJob: 'lsmc',
                canInteract: entity => {
                    return (
                        this.playerService.isOnDuty() &&
                        IsEntityPlayingAnim(entity, 'anim@gangops@morgue@table@', 'body_search', 3) &&
                        surgery.isPointInside(GetEntityCoords(entity) as Vector3) &&
                        !!organ &&
                        this.inventoryManager.hasEnoughItem(organ)
                    );
                },
                action: async entity => {
                    const id = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    const organ = await emitRpc<Organ>(RpcServerEvent.LSMC_GET_CURRENT_ORGAN, id);
                    const { completed } = await this.progressService.progress(
                        'Soigner',
                        'Greffer un ' + organ,
                        10000,
                        {
                            dictionary: 'mini@repair',
                            name: 'fixing_a_ped',
                        },
                        {
                            disableMovement: true,
                            disableCarMovement: true,
                        }
                    );

                    if (!completed) {
                        return;
                    }

                    TriggerServerEvent(ServerEvent.LSMC_SET_CURRENT_ORGAN, false, id);
                },
            },
        ]);
    }
}

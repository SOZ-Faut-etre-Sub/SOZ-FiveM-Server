import { emitRpc } from '@public/core/rpc';
import { ServerEvent } from '@public/shared/event';
import { UpwStation } from '@public/shared/fuel';
import { JobType } from '@public/shared/job';
import { Vector3 } from '@public/shared/polyzone/vector';
import { RpcEvent } from '@public/shared/rpc';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { UpwChargerRepository } from '../resources/upw.station.repository';
import { TargetFactory } from '../target/target.factory';

type CurrentStationPistol = {
    object: number;
    rope: number;
    entity: number;
    station: string;
    filling: boolean;
};

@Provider()
export class VehicleElectricProvider {
    @Inject(UpwChargerRepository)
    private upwChargerRepository: UpwChargerRepository;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepositoryLoaded() {
        let upwCharger = this.upwChargerRepository.get();

        while (!upwCharger) {
            await wait(100);
            upwCharger = this.upwChargerRepository.get();
        }
    }

    public async getStationEnergyLevel(entity: number) {
        if (!entity) {
            return;
        }
        const position = GetEntityCoords(entity) as Vector3;
        const charger = this.upwChargerRepository.getClosestCharger(position);
        if (!charger) {
            return;
        }

        const refreshStation = await emitRpc<UpwStation>(RpcEvent.UPW_GET_STATION, charger.station);

        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
        await wait(500);

        const { completed } = await this.progressService.progress(
            'get_fuel_level',
            'Vous vérifiez la charge...',
            5000,
            {
                task: 'PROP_HUMAN_PARKING_METER',
            },
            {
                disableMovement: true,
                disableCombat: true,
            }
        );

        if (completed) {
            this.notifier.notify(
                `Charge de la station : ~b~${refreshStation.stock} / ${refreshStation.max_stock}kWh`,
                'success'
            );
        }
    }

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        this.targetFactory.createForModel(this.upwChargerRepository.getModel(), [
            {
                label: "Recharger à l'énergie fossile",
                color: JobType.Upw,
                icon: 'c:fuel/charger.png',
                blackoutGlobal: true,
                blackoutJob: JobType.Upw,
                job: JobType.Upw,
                canInteract: entity => {
                    const player = this.playerService.getPlayer();
                    return player && player.job.onduty;
                },
                action: entity => {
                    const position = GetEntityCoords(entity) as Vector3;
                    const charger = this.upwChargerRepository.getClosestCharger(position);

                    if (!charger) {
                        return false;
                    }

                    TriggerServerEvent(ServerEvent.UPW_REFILL_STATION, charger.station, 'energy_cell_fossil');
                },
                item: 'energy_cell_fossil',
            },
            {
                label: "Recharger à l'énergie hydraulique",
                color: JobType.Upw,
                icon: 'c:fuel/charger.png',
                blackoutGlobal: true,
                blackoutJob: JobType.Upw,
                job: JobType.Upw,
                canInteract: entity => {
                    const player = this.playerService.getPlayer();
                    return player && player.job.onduty;
                },
                action: entity => {
                    const position = GetEntityCoords(entity) as Vector3;
                    const charger = this.upwChargerRepository.getClosestCharger(position);

                    if (!charger) {
                        return false;
                    }

                    TriggerServerEvent(ServerEvent.UPW_REFILL_STATION, charger.station, 'energy_cell_hydro');
                },
                item: 'energy_cell_hydro',
            },
            {
                label: "Recharger à l'énergie éolienne",
                color: JobType.Upw,
                icon: 'c:fuel/charger.png',
                blackoutGlobal: true,
                blackoutJob: JobType.Upw,
                job: JobType.Upw,
                canInteract: entity => {
                    const player = this.playerService.getPlayer();
                    return player && player.job.onduty;
                },
                action: entity => {
                    const position = GetEntityCoords(entity) as Vector3;
                    const charger = this.upwChargerRepository.getClosestCharger(position);

                    if (!charger) {
                        return false;
                    }

                    TriggerServerEvent(ServerEvent.UPW_REFILL_STATION, charger.station, 'energy_cell_wind');
                },
                item: 'energy_cell_wind',
            },
            {
                label: 'État de la station',
                color: JobType.Upw,
                icon: 'c:fuel/battery.png',
                blackoutGlobal: true,
                blackoutJob: JobType.Upw,
                job: JobType.Upw,
                action: (entity: number) => {
                    this.getStationEnergyLevel(entity);
                },
                canInteract: (entity: number) => {
                    const player = this.playerService.getPlayer();
                    return player && player.job.onduty;
                },
            },
        ]);
    }
}

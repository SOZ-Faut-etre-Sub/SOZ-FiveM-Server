import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Command } from '@public/core/decorators/command';
import { Once, OnEvent } from '@public/core/decorators/event';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent } from '@public/shared/event/client';
import { RpcServerEvent } from '@public/shared/rpc';

import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../repository/resource.loader';
import { TargetFactory } from '../target/target.factory';

const models = [
    'freight',
    'freight2',
    'freightcar',
    'freightcar2',
    'freightcar3',
    'freightcont1',
    'freightcont2',
    'freightgrain',
    'metrotrain',
    'class1_2',
    'class1t',
    'soz_freightcar',
    'tankercar',
];

@Provider()
export class VehicleTrainProvider {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    private train: number = 0;

    @Command('train')
    public async trainSpawn(source: number, typeStr: string, reverse: string) {
        const [isAllowed] = await emitRpc<[boolean, string]>(RpcServerEvent.ADMIN_IS_ALLOWED);
        if (!isAllowed) {
            return;
        }

        this.notifier.notify('Chargement du train');
        const type = Number.parseInt(typeStr);
        const coords = GetEntityCoords(PlayerPedId());
        for (const model of models) {
            await this.resourceLoader.loadModel(model);
        }
        this.train = CreateMissionTrain(type, coords[0], coords[1], coords[2], reverse == 'true');

        TaskWarpPedIntoVehicle(PlayerPedId(), this.train, -1);
        SetTrainSpeed(this.train, 0.0);
        SetTrainCruiseSpeed(this.train, 0.0);

        for (const model of models) {
            this.resourceLoader.unloadModel(model);
        }
    }

    @Command('dtrain')
    public async dtrain() {
        if (this.train) {
            DeleteMissionTrain(this.train);
            this.train = 0;
        } else {
            const veh = GetVehiclePedIsIn(PlayerPedId(), false);
            if (IsMissionTrain(veh)) {
                DeleteMissionTrain(veh);
            }
        }
    }

    @Once()
    public init() {
        SetTrainsForceDoorsOpen(false);
        this.targetFactory.createForModel(
            ['class1_2', 'freight', 'freight2', 'metrotrain'],
            [
                {
                    category: 'citizen',
                    label: 'Conduire',
                    canInteract: entity => {
                        const player = this.playerService.getPlayer();
                        if (!player) {
                            return false;
                        }
                        return !GetPedInVehicleSeat(entity, -1) && player.role != 'user';
                    },
                    action: entity => {
                        TaskWarpPedIntoVehicle(PlayerPedId(), entity, -1);
                    },
                },
            ]
        );
    }

    @OnEvent(ClientEvent.VEHICLE_SYNC_DOOR_TRAIN)
    public onSyncTrainDoorState(netVeh: number, doorIndex: number, open: boolean) {
        if (!NetworkDoesEntityExistWithNetworkId(netVeh)) {
            return;
        }

        const vehicle = NetToVeh(netVeh);
        if (!vehicle) {
            return;
        }

        if (open) {
            SetVehicleDoorOpen(vehicle, doorIndex, false, false);
        } else {
            SetVehicleDoorShut(vehicle, doorIndex, false);
        }

        const carriage = GetTrainCarriage(vehicle, 1);
        if (carriage) {
            if (open) {
                SetVehicleDoorOpen(carriage, 3 - doorIndex, false, false);
            } else {
                SetVehicleDoorShut(carriage, 3 - doorIndex, false);
            }
        }
    }
}

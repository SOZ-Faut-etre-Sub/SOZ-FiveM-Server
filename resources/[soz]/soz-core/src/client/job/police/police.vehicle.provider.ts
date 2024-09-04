import { Notifier } from '@public/client/notifier';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { VehicleLockProvider } from '@public/client/vehicle/vehicle.lock.provider';
import { VehicleStateProvider } from '@public/client/vehicle/vehicle.state.provider';
import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { RpcServerEvent } from '@public/shared/rpc';
import { VehicleType, VehicleTypeFromClass, VehicleVolatileState } from '@public/shared/vehicle/vehicle';

const jobsAllowed = [JobType.LSPD, JobType.BCSO, JobType.SASP, JobType.FBI, JobType.LSCS];

const PlateTypeOverride: Record<number, number> = {
    [GetHashKey('rebel')]: 1,
    [GetHashKey('streiter')]: 2,
};

@Provider()
export class PoliceVehicleProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(VehicleLockProvider)
    private vehicleLockProvider: VehicleLockProvider;

    @Inject(VehicleStateProvider)
    private vehicleStateProvider: VehicleStateProvider;

    @OnEvent(ClientEvent.JOB_DUTY_CHANGE)
    public onStart(duty: boolean) {
        const job = this.playerService.getPlayer().job.id;
        if (!duty) {
            return;
        }
        if (!jobsAllowed.includes(job)) {
            return;
        }
        this.targetFactory.createForAllVehicle(
            [
                {
                    label: 'Immatriculation',
                    color: job,
                    icon: 'c:police/immatriculation.png',
                    job: job,
                    blackoutJob: job,
                    blackoutGlobal: true,
                    category: 'society',
                    canInteract: vehicle => {
                        if (VehicleTypeFromClass[GetVehicleClass(vehicle)] == VehicleType.Automobile) {
                            let vehiclePlate = PlateTypeOverride[GetEntityModel(vehicle)];
                            if (vehiclePlate == null) {
                                vehiclePlate = GetVehiclePlateType(vehicle);
                            }

                            if (vehiclePlate == 3) {
                                return false;
                            }
                            if (vehiclePlate == 0 || vehiclePlate == 2) {
                                const model = GetEntityModel(vehicle);
                                const [modelDimMin, modelDimMax] = GetModelDimensions(model);
                                const middleBack = GetOffsetFromEntityInWorldCoords(
                                    vehicle,
                                    modelDimMax[0] / 2,
                                    modelDimMin[1],
                                    modelDimMax[2] / 2
                                ) as Vector3;
                                const pedPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
                                if (
                                    getDistance([middleBack[0], middleBack[1]], [pedPosition[0], pedPosition[1]]) <= 1.5
                                ) {
                                    return true;
                                }
                            }
                            if (vehiclePlate == 0 || vehiclePlate == 1) {
                                const model = GetEntityModel(vehicle);
                                const [, modelDimMax] = GetModelDimensions(model);
                                const middleFront = GetOffsetFromEntityInWorldCoords(
                                    vehicle,
                                    modelDimMax[0] / 2,
                                    modelDimMax[1],
                                    modelDimMax[2] / 2
                                ) as Vector3;
                                const pedPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
                                if (
                                    getDistance([middleFront[0], middleFront[1]], [pedPosition[0], pedPosition[1]]) <=
                                    1.5
                                ) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        return true;
                    },
                    action: async entity => {
                        const { completed } = await this.progressService.progress(
                            'police:vehicle:check',
                            'Vérification de la plaque en cours...',
                            8000,
                            {
                                task: 'CODE_HUMAN_MEDIC_KNEEL',
                            },
                            {
                                useWhileDead: false,
                                canCancel: true,
                                disableMovement: true,
                                disableCarMovement: true,
                                disableMouse: false,
                                disableCombat: true,
                            }
                        );
                        if (!completed) {
                            return;
                        }
                        const plate = GetVehicleNumberPlateText(entity);
                        TriggerServerEvent(ServerEvent.POLICE_GET_VEHICLE_OWNER, plate, VehToNet(entity));
                    },
                },
                {
                    label: 'Fouiller',
                    color: job,
                    icon: 'c:police/fouiller_vehicle.png',
                    job: job,
                    category: 'society',
                    canInteract: vehicle => {
                        if (VehicleTypeFromClass[GetVehicleClass(vehicle)] == VehicleType.Automobile) {
                            const model = GetEntityModel(vehicle);
                            const [modelDimMin, modelDimMax] = GetModelDimensions(model);
                            const middleBack = GetOffsetFromEntityInWorldCoords(
                                vehicle,
                                modelDimMax[0] / 2,
                                modelDimMin[1],
                                modelDimMax[2] / 2
                            ) as Vector3;
                            const pedPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
                            if (getDistance([middleBack[0], middleBack[1]], [pedPosition[0], pedPosition[1]]) > 1.5) {
                                return false;
                            }
                        }
                        return true;
                    },
                    action: async entity => {
                        const { completed } = await this.progressService.progress(
                            'police:vehicle:check',
                            'Vérification du coffre en cours...',
                            8000,
                            {
                                dictionary: 'amb@prop_human_bum_bin@idle_a',
                                name: 'idle_a',
                                options: { onlyUpperBody: true },
                            },
                            {
                                useWhileDead: false,
                                canCancel: true,
                                disableMovement: true,
                                disableCarMovement: true,
                                disableMouse: false,
                                disableCombat: true,
                            }
                        );
                        if (!completed) {
                            return;
                        }
                        this.vehicleLockProvider.openVehiclePolice(entity);
                    },
                },
                {
                    label: 'Ouvrir',
                    color: job,
                    icon: 'c:police/forcer.png',
                    job: job,
                    category: 'society',
                    action: async entity => {
                        const { completed } = await this.progressService.progress(
                            'police:vehicle:lockpick',
                            'Déverrouillage du véhicule en cours...',
                            8000,
                            {
                                task: 'WORLD_HUMAN_WELDING',
                            },
                            {
                                useWhileDead: true,
                                canCancel: true,
                                disableMovement: true,
                                disableCarMovement: true,
                                disableMouse: false,
                                disableCombat: true,
                            }
                        );
                        if (!completed) {
                            return;
                        }
                        const networkId = NetworkGetNetworkIdFromEntity(entity);

                        TriggerServerEvent(ServerEvent.VEHICLE_FORCE_OPEN, networkId);
                    },
                },
                {
                    label: 'Rechercher des empreintes',
                    job: job,
                    item: 'fingerprint_collector',
                    icon: 'c:police/fouiller.png',
                    color: job,
                    category: 'society',
                    canInteract: async entity => {
                        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(entity);
                        const vehicleState = await emitRpc<VehicleVolatileState>(
                            RpcServerEvent.VEHICLE_GET_STATE,
                            vehicleNetworkId
                        );
                        if (!vehicleState.isAnalyzed) {
                            return false;
                        }
                        return true;
                    },
                    action: async entity => {
                        const { completed } = await this.progressService.progress(
                            'police:vehicle:fingerprint',
                            "Recherche d'empreintes en cours...",
                            8000,
                            {
                                task: 'CODE_HUMAN_MEDIC_KNEEL',
                            },
                            {
                                useWhileDead: false,
                                canCancel: true,
                                disableMovement: true,
                                disableCarMovement: true,
                                disableMouse: false,
                                disableCombat: true,
                            }
                        );
                        if (!completed) {
                            return;
                        }
                        const model = GetEntityModel(entity);
                        const name = GetDisplayNameFromVehicleModel(model);
                        const coords = GetEntityCoords(PlayerPedId());
                        const zoneID = GetNameOfZone(coords[0], coords[1], coords[2]);
                        const zone = GetLabelText(zoneID);
                        const networkId = NetworkGetNetworkIdFromEntity(entity);
                        TriggerServerEvent(ServerEvent.VEHICLE_COLLECT_FINGERPRINT, networkId, zone, name);
                    },
                },
                {
                    label: 'Rechercher des traces de drogue',
                    job: job,
                    icon: 'c:police/fouiller.png',
                    color: job,
                    category: 'society',
                    canInteract: async entity => {
                        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(entity);
                        const vehicleState = await emitRpc<VehicleVolatileState>(
                            RpcServerEvent.VEHICLE_GET_STATE,
                            vehicleNetworkId
                        );
                        if (!vehicleState.isAnalyzed) {
                            return false;
                        }
                        return true;
                    },
                    action: async entity => {
                        const { completed } = await this.progressService.progress(
                            'police:vehicle:drug',
                            'Recherche de traces de drogue en cours...',
                            8000,
                            {
                                task: 'CODE_HUMAN_MEDIC_KNEEL',
                            },
                            {
                                useWhileDead: false,
                                canCancel: true,
                                disableMovement: true,
                                disableCarMovement: true,
                                disableMouse: false,
                                disableCombat: true,
                            }
                        );
                        if (!completed) {
                            return;
                        }
                        const model = GetEntityModel(entity);
                        const name = GetDisplayNameFromVehicleModel(model);
                        const coords = GetEntityCoords(PlayerPedId());
                        const zoneID = GetNameOfZone(coords[0], coords[1], coords[2]);
                        const zone = GetLabelText(zoneID);
                        const networkId = NetworkGetNetworkIdFromEntity(entity);
                        TriggerServerEvent(ServerEvent.VEHICLE_COLLECT_DRUG, networkId, zone, name);
                    },
                },
            ],
            1.5
        );
    }
}

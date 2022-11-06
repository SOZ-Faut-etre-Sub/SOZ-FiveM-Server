import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick, TickInterval } from '../../../core/decorators/tick';
import { ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { Vector3, Vector4 } from '../../../shared/polyzone/vector';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { SoundService } from '../../sound.service';
import { TargetFactory } from '../../target/target.factory';
import { VehicleService } from '../../vehicle/vehicle.service';

const FLATBED_OFFSET = [0.0, -2.2, 1.1] as Vector3;

@Provider()
export class BennysFlatbedProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(SoundService)
    private soundService: SoundService;

    @Inject(Notifier)
    private notifier: Notifier;

    private currentFlatbed: number | null = null;

    @Once(OnceStep.PlayerLoaded)
    public async onInit() {
        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/Mettre.png',
                color: JobType.Bennys,
                job: JobType.Bennys,
                label: 'Remorquer',
                event: 'soz-flatbed:client:calltp',
                action: (entity: number) => {
                    this.attachVehicle(entity);
                },
                canInteract: (entity: number) => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return player.job.onduty && this.currentFlatbed !== null;
                },
            },
            {
                icon: 'c:mechanic/Mettre.png',
                color: JobType.Bennys,
                job: JobType.Bennys,
                label: 'Prendre le crochet du flatbed',
                event: 'soz-flatbed:client:calltp',
                action: (entity: number) => {
                    this.currentFlatbed = entity;
                },
                canInteract: entity => {
                    if (GetEntityModel(entity) !== GetHashKey('flatbed4')) {
                        return false;
                    }

                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return player.job.onduty;
                },
            },
            {
                icon: 'c:mechanic/Retirer.png',
                color: JobType.Bennys,
                job: JobType.Bennys,
                label: 'Démorquer',
                action: (entity: number) => {
                    this.detachVehicle(entity);
                },
                canInteract: (entity: number) => {
                    if (GetEntityModel(entity) !== GetHashKey('flatbed4')) {
                        return false;
                    }

                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    const currentAttachedVehicle = Entity(entity).state.flatbedAttachedVehicle;

                    return player.job.onduty && currentAttachedVehicle !== null;
                },
            },
        ]);
    }

    @Tick(TickInterval.EVERY_SECOND)
    public async onTick() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            return;
        }

        const attachedNetworkId = Entity(vehicle).state.flatbedAttachedVehicle || 0;

        if (!attachedNetworkId) {
            return;
        }

        const attachedVehicle = NetworkGetEntityFromNetworkId(attachedNetworkId);

        if (NetworkHasControlOfEntity(attachedVehicle)) {
            return;
        }

        // Here we are in a case where we owned the flatbed but not the attached vehicle
        // Duplicate the vehicle and attach it to the flatbed while destroying the original
        const attachedState = this.vehicleService.getVehicleState(attachedVehicle);
        const plate = attachedState.plate || GetVehicleNumberPlateText(attachedVehicle);
        const configuration = await this.vehicleService.getVehicleConfiguration(attachedVehicle);
        const vehiclePosition = GetEntityCoords(attachedVehicle, true) as Vector4;
        const model = GetEntityModel(attachedVehicle);

        const vehicleDuplicate = CreateVehicle(
            model,
            vehiclePosition[0],
            vehiclePosition[1],
            vehiclePosition[2],
            vehiclePosition[3],
            true,
            false
        );

        const duplicateNetworkId = NetworkGetNetworkIdFromEntity(vehicleDuplicate);

        SetNetworkIdCanMigrate(duplicateNetworkId, true);
        SetEntityAsMissionEntity(vehicleDuplicate, true, false);
        SetVehicleHasBeenOwnedByPlayer(vehicleDuplicate, true);
        SetVehicleNeedsToBeHotwired(vehicleDuplicate, false);
        SetVehRadioStation(vehicleDuplicate, 'OFF');
        CopyVehicleDamages(attachedVehicle, vehicleDuplicate);

        this.vehicleService.applyVehicleConfiguration(vehicleDuplicate, configuration);
        this.vehicleService.syncVehicle(vehicleDuplicate, attachedState);
        SetVehicleNumberPlateText(vehicle, plate);

        this.attachVehicleToFlatbed(vehicle, vehicleDuplicate);
        Entity(vehicle).state.flatbedAttachedVehicle = duplicateNetworkId;

        TriggerServerEvent(ServerEvent.VEHICLE_SWAP, attachedNetworkId, duplicateNetworkId, attachedState);
    }

    public detachVehicle(flatbed: number) {
        const attachedVehicleNetworkId = Entity(flatbed).state.flatbedAttachedVehicle;

        if (!attachedVehicleNetworkId) {
            return;
        }

        const attachedVehicle = NetworkGetEntityFromNetworkId(attachedVehicleNetworkId);
        const attachedVehiclePosition = GetEntityCoords(attachedVehicle, true) as Vector4;
        const flatbedPosition = GetEntityCoords(flatbed, true) as Vector4;

        DetachEntity(attachedVehicle, true, true);
        SetEntityCoords(
            attachedVehicle,
            flatbedPosition[0] - (flatbedPosition[0] - attachedVehiclePosition[0]) * 6,
            flatbedPosition[1] - (flatbedPosition[1] - attachedVehiclePosition[1]) * 6,
            flatbedPosition[2],
            false,
            false,
            false,
            false
        );

        Entity(flatbed).state.set('flatbedAttachedVehicle', null, true);

        this.soundService.play('seatbelt/unbuckle', 0.2);
        this.notifier.notify('Le véhicule a été détaché du flatbed.');
    }

    public attachVehicle(vehicle: number) {
        if (vehicle === this.currentFlatbed) {
            this.notifier.notify('Vous ne pouvez pas attacher le flatbed à lui-même.', 'error');

            return;
        }

        if (Entity(this.currentFlatbed).state.flatbedAttachedVehicle) {
            this.notifier.notify('Un véhicule est déjà attaché au flatbed.', 'error');

            return;
        }

        if (Entity(vehicle).state.flatbedAttachedVehicle) {
            this.notifier.notify('Les chateaux de flatbed sont interdits, merci de prendre un jeu de carte.', 'error');

            return;
        }

        this.attachVehicleToFlatbed(this.currentFlatbed, vehicle);

        this.soundService.play('seatbelt/buckle', 0.2);
        this.notifier.notify('Le véhicule a été attaché au flatbed.');

        const vehicleFlatbedNetworkId = NetworkGetNetworkIdFromEntity(this.currentFlatbed);
        const vehicleAttachedNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        this.currentFlatbed = null;

        TriggerServerEvent(
            ServerEvent.BENNYS_FLATBED_ATTACH_VEHICLE,
            vehicleFlatbedNetworkId,
            vehicleAttachedNetworkId
        );
    }

    private attachVehicleToFlatbed(flatbed: number, vehicle: number) {
        const attachPosition = GetOffsetFromEntityInWorldCoords(
            flatbed,
            FLATBED_OFFSET[0],
            FLATBED_OFFSET[1],
            FLATBED_OFFSET[2]
        ) as Vector3;
        const offset = GetOffsetFromEntityGivenWorldCoords(
            flatbed,
            attachPosition[0],
            attachPosition[1],
            attachPosition[2]
        ) as Vector3;

        AttachEntityToEntity(
            vehicle,
            flatbed,
            null,
            offset[0],
            offset[1],
            offset[2],
            0.0,
            0.0,
            0.6,
            true,
            false,
            false,
            false,
            null,
            true
        );
    }
}

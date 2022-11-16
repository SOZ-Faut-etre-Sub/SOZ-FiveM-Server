import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick, TickInterval } from '../../../core/decorators/tick';
import { wait } from '../../../core/utils';
import { ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { getDistance, Vector3, Vector4 } from '../../../shared/polyzone/vector';
import { AnimationService } from '../../animation/animation.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { SoundService } from '../../sound.service';
import { TargetFactory } from '../../target/target.factory';
import { VehicleService } from '../../vehicle/vehicle.service';

const FLATBED_OFFSET = [0.0, -2.2, 1.1] as Vector3;

type FlatbedAttach = {
    object: number;
    rope: number;
    entity: number;
};

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

    @Inject(AnimationService)
    private animationService: AnimationService;

    private currentFlatbedAttach: FlatbedAttach = null;

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
                canInteract: () => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    return player.job.onduty && this.currentFlatbedAttach !== null;
                },
            },
            {
                icon: 'c:mechanic/Attacher.png',
                color: JobType.Bennys,
                job: JobType.Bennys,
                label: 'Prendre le crochet',
                action: (entity: number) => {
                    this.toggleFlatbedAttach(entity);
                },
                canInteract: entity => {
                    if (GetEntityModel(entity) !== GetHashKey('flatbed4')) {
                        return false;
                    }

                    if (this.currentFlatbedAttach !== null) {
                        return false;
                    }

                    if (Entity(entity).state.flatbedAttachedVehicle) {
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
                icon: 'c:mechanic/Attacher.png',
                color: JobType.Bennys,
                job: JobType.Bennys,
                label: 'Déposer le crochet',
                action: entity => {
                    this.toggleFlatbedAttach(entity);
                },
                canInteract: entity => {
                    if (GetEntityModel(entity) !== GetHashKey('flatbed4')) {
                        return false;
                    }

                    if (this.currentFlatbedAttach === null || this.currentFlatbedAttach.entity !== entity) {
                        return false;
                    }

                    if (Entity(entity).state.flatbedAttachedVehicle) {
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

    @Tick()
    private async handleFlatbedAttach() {
        if (!this.currentFlatbedAttach) {
            return;
        }

        const ropePosition = GetOffsetFromEntityInWorldCoords(
            this.currentFlatbedAttach.entity,
            0.0,
            0.0,
            1.0
        ) as Vector3;
        const handPosition = GetWorldPositionOfEntityBone(
            PlayerPedId(),
            GetEntityBoneIndexByName(PlayerPedId(), 'BONETAG_L_FINGER2')
        ) as Vector3;

        const distance = Math.min(getDistance(ropePosition, handPosition) + 2.0, 30);

        AttachEntitiesToRope(
            this.currentFlatbedAttach.rope,
            this.currentFlatbedAttach.entity,
            PlayerPedId(),
            ropePosition[0],
            ropePosition[1],
            ropePosition[2],
            handPosition[0],
            handPosition[1],
            handPosition[2],
            distance,
            true,
            true,
            null,
            'BONETAG_L_FINGER2'
        );
    }

    private async toggleFlatbedAttach(entity: number) {
        if (this.currentFlatbedAttach) {
            await this.disableFlatbedAttach();
        } else {
            await this.activateFlatbedAttach(entity);
        }
    }

    private async disableFlatbedAttach() {
        if (!this.currentFlatbedAttach) {
            return;
        }

        RopeUnloadTextures();
        DeleteRope(this.currentFlatbedAttach.rope);
        SetEntityAsMissionEntity(this.currentFlatbedAttach.object, true, true);
        DeleteEntity(this.currentFlatbedAttach.object);

        this.currentFlatbedAttach = null;

        this.soundService.playAround('fuel/end_fuel', 5, 0.3);
    }

    private async activateFlatbedAttach(entity: number) {
        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
        await wait(500);

        await this.animationService.playAnimation({
            base: {
                dictionary: 'anim@mp_atm@enter',
                name: 'enter',
                blendInSpeed: 8.0,
                blendOutSpeed: -8.0,
                duration: 3000,
                lockX: true,
                lockY: true,
                lockZ: true,
            },
        });

        this.soundService.playAround('fuel/start_fuel', 5, 0.3);

        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;
        const object = CreateObject(
            GetHashKey('prop_v_hook_s'),
            position[0],
            position[1],
            position[2] - 1.0,
            true,
            true,
            true
        );

        SetNetworkIdCanMigrate(ObjToNet(object), false);
        AttachEntityToEntity(
            object,
            PlayerPedId(),
            GetPedBoneIndex(PlayerPedId(), 26610),
            0.04,
            -0.04,
            0.02,
            305.0,
            270.0,
            -40.0,
            true,
            true,
            false,
            true,
            0,
            true
        );
        RopeLoadTextures();

        const [rope] = AddRope(
            position[0],
            position[1],
            position[2],
            0.0,
            0.0,
            0.0,
            30.0,
            6,
            25.0,
            1.0,
            0.5,
            false,
            true,
            true,
            1.0,
            false,
            0
        );
        LoadRopeData(rope, 'ropeFamily3');
        const ropePosition = GetOffsetFromEntityInWorldCoords(entity, 0.0, 0.0, 1.0) as Vector3;
        AttachRopeToEntity(rope, entity, ropePosition[0], ropePosition[1], ropePosition[2], true);
        ActivatePhysics(rope);

        this.currentFlatbedAttach = {
            rope,
            object,
            entity,
        };
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
        const height = GetEntityHeightAboveGround(attachedVehicle) - 0.4 - GetEntityHeightAboveGround(vehicle);

        if (NetworkHasControlOfEntity(attachedVehicle)) {
            return;
        }

        // Here we are in a case where we owned the flatbed but not the attached vehicle
        // Duplicate the vehicle and attach it to the flatbed while destroying the original
        const position = GetEntityCoords(attachedVehicle, true) as Vector3;
        const heading = GetEntityHeading(attachedVehicle);
        const [vehicleDuplicate, duplicateNetworkId] = await this.duplicateVehicle(attachedVehicle, [
            ...position,
            heading,
        ]);

        this.attachVehicleToFlatbed(vehicle, vehicleDuplicate, height);
        Entity(vehicle).state.flatbedAttachedVehicle = duplicateNetworkId;
    }

    public async duplicateVehicle(vehicleEntityId: number, position: Vector4 = [0, 0, 0, 0]) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);
        const vehicleState = this.vehicleService.getVehicleState(vehicleEntityId);
        const plate = vehicleState.plate || GetVehicleNumberPlateText(vehicleEntityId);
        const configuration = await this.vehicleService.getVehicleConfiguration(vehicleEntityId);
        const model = GetEntityModel(vehicleEntityId);

        const vehicleDuplicate = CreateVehicle(model, position[0], position[1], position[2], position[3], true, true);

        const duplicateNetworkId = NetworkGetNetworkIdFromEntity(vehicleDuplicate);

        SetNetworkIdCanMigrate(duplicateNetworkId, true);
        SetEntityAsMissionEntity(vehicleDuplicate, true, true);
        SetVehicleHasBeenOwnedByPlayer(vehicleDuplicate, true);
        SetVehicleNeedsToBeHotwired(vehicleDuplicate, false);
        SetVehRadioStation(vehicleDuplicate, 'OFF');
        CopyVehicleDamages(vehicleEntityId, vehicleDuplicate);

        this.vehicleService.applyVehicleConfiguration(vehicleDuplicate, configuration);
        this.vehicleService.syncVehicle(vehicleDuplicate, vehicleState);
        SetVehicleNumberPlateText(vehicleDuplicate, plate);
        TriggerServerEvent(ServerEvent.VEHICLE_SWAP, vehicleNetworkId, duplicateNetworkId, vehicleState);

        return [vehicleDuplicate, duplicateNetworkId];
    }

    public async detachVehicle(flatbed: number) {
        const attachedVehicleNetworkId = Entity(flatbed).state.flatbedAttachedVehicle;

        if (!attachedVehicleNetworkId) {
            return;
        }

        const attachedVehicle = NetworkGetEntityFromNetworkId(attachedVehicleNetworkId);
        const flatbedPosition = GetEntityCoords(flatbed, true) as Vector4;
        const attachedVehiclePosition = GetEntityCoords(attachedVehicle, true) as Vector4;
        const [vehicleDuplicate] = await this.duplicateVehicle(attachedVehicle, [
            flatbedPosition[0] - (flatbedPosition[0] - attachedVehiclePosition[0]) * 6,
            flatbedPosition[1] - (flatbedPosition[1] - attachedVehiclePosition[1]) * 6,
            flatbedPosition[2],
            GetEntityHeading(flatbed),
        ]);

        SetVehicleOnGroundProperly(vehicleDuplicate);
        Entity(flatbed).state.set('flatbedAttachedVehicle', null, true);

        this.soundService.play('seatbelt/unbuckle', 0.2);
        this.notifier.notify('Le véhicule a été détaché du flatbed.');
    }

    public async attachVehicle(vehicle: number) {
        if (!this.currentFlatbedAttach || !DoesEntityExist(this.currentFlatbedAttach.entity)) {
            await this.disableFlatbedAttach();

            return;
        }

        if (vehicle === this.currentFlatbedAttach?.entity) {
            this.notifier.notify('Vous ne pouvez pas attacher le flatbed à lui-même.', 'error');

            return;
        }

        if (Entity(this.currentFlatbedAttach?.entity).state.flatbedAttachedVehicle) {
            this.notifier.notify('Un véhicule est déjà attaché au flatbed.', 'error');

            return;
        }

        if (Entity(vehicle).state.flatbedAttachedVehicle) {
            this.notifier.notify('Les chateaux de flatbed sont interdits, merci de prendre un jeu de carte.', 'error');

            return;
        }

        if (IsVehicleAttachedToTrailer(vehicle)) {
            DetachVehicleFromTrailer(vehicle);

            await wait(500);
        }

        const height = GetEntityHeightAboveGround(vehicle);
        const position = GetEntityCoords(vehicle, true) as Vector3;
        const heading = GetEntityHeading(vehicle);
        const [vehicleDuplicate, vehicleDuplicateNetworkId] = await this.duplicateVehicle(vehicle, [
            ...position,
            heading,
        ]);

        this.attachVehicleToFlatbed(this.currentFlatbedAttach.entity, vehicleDuplicate, height);

        this.soundService.play('seatbelt/buckle', 0.2);
        this.notifier.notify('Le véhicule a été attaché au flatbed.');

        const vehicleFlatbedNetworkId = NetworkGetNetworkIdFromEntity(this.currentFlatbedAttach.entity);

        await this.disableFlatbedAttach();

        TriggerServerEvent(
            ServerEvent.BENNYS_FLATBED_ATTACH_VEHICLE,
            vehicleFlatbedNetworkId,
            vehicleDuplicateNetworkId
        );
    }

    private attachVehicleToFlatbed(flatbed: number, vehicle: number, height: number) {
        const attachPosition = GetOffsetFromEntityInWorldCoords(
            flatbed,
            FLATBED_OFFSET[0],
            FLATBED_OFFSET[1],
            0.4 + height
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

import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { Tick, TickInterval } from '../../../core/decorators/tick';
import { wait } from '../../../core/utils';
import { AnimationStopReason } from '../../../shared/animation';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { Vector3, Vector4 } from '../../../shared/polyzone/vector';
import { VehicleSeat } from '../../../shared/vehicle/vehicle';
import { AnimationService } from '../../animation/animation.service';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { RopeService } from '../../rope.service';
import { SoundService } from '../../sound.service';
import { TargetFactory } from '../../target/target.factory';
import { VehicleService } from '../../vehicle/vehicle.service';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

const FLATBED_OFFSET = [0.0, -2.2, 1.1] as Vector3;

const MAX_LENGTH_ROPE = 30;

type FlatbedAttach = {
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

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(SoundService)
    private soundService: SoundService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(RopeService)
    private ropeService: RopeService;

    private currentFlatbedAttach: FlatbedAttach = null;

    @Once(OnceStep.PlayerLoaded)
    public async setupFlatbed() {
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
                canInteract: async entity => {
                    if (GetEntityModel(entity) !== GetHashKey('flatbed4')) {
                        return false;
                    }

                    if (this.currentFlatbedAttach !== null) {
                        return false;
                    }

                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (!player.job.onduty) {
                        return false;
                    }

                    const flatbedState = await this.vehicleStateService.getVehicleState(entity);
                    const attachedVehicleNetworkId = flatbedState.flatbedAttachedVehicle;

                    return !attachedVehicleNetworkId;
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
                canInteract: async entity => {
                    if (GetEntityModel(entity) !== GetHashKey('flatbed4')) {
                        return false;
                    }

                    if (this.currentFlatbedAttach === null || this.currentFlatbedAttach.entity !== entity) {
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
                    TriggerServerEvent(
                        ServerEvent.BENNYS_FLATBED_ASK_DETACH_VEHICLE,
                        NetworkGetNetworkIdFromEntity(entity)
                    );
                },
                canInteract: async (entity: number) => {
                    if (GetEntityModel(entity) !== GetHashKey('flatbed4')) {
                        return false;
                    }

                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (!player.job.onduty) {
                        return false;
                    }

                    const flatbedState = await this.vehicleStateService.getVehicleState(entity);

                    return flatbedState.flatbedAttachedVehicle !== null;
                },
            },
        ]);
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async handleFlatbedAttach() {
        if (!this.currentFlatbedAttach) {
            return;
        }
        this.ropeService.manageRopePhysics();
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

        this.ropeService.deleteRope();

        this.currentFlatbedAttach = null;

        this.soundService.playAround('fuel/end_fuel', 5, 0.3);
    }

    private async activateFlatbedAttach(entity: number) {
        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);
        await wait(500);

        const stopReason = await this.animationService.playAnimation({
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

        if (stopReason !== AnimationStopReason.Finished) {
            return;
        }

        if (this.currentFlatbedAttach !== null) {
            return;
        }

        const ropePosition = GetOffsetFromEntityInWorldCoords(entity, 0.0, 0.0, 1.0) as Vector3;
        if (!this.ropeService.createNewRope(ropePosition, entity, 6, MAX_LENGTH_ROPE, 'prop_v_hook_s', 'ropeFamily3')) {
            return;
        }

        this.soundService.playAround('fuel/start_fuel', 5, 0.3);

        this.currentFlatbedAttach = {
            entity,
        };
    }

    @Tick(TickInterval.EVERY_SECOND)
    public async checkAttachedEntityOwnershipLoop() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            return;
        }

        const flatbedState = await this.vehicleStateService.getVehicleState(vehicle);
        const attachedVehicleNetworkId = flatbedState.flatbedAttachedVehicle;

        if (!attachedVehicleNetworkId) {
            return;
        }

        if (!NetworkDoesNetworkIdExist(attachedVehicleNetworkId)) {
            return;
        }

        const attachedVehicle = NetworkGetEntityFromNetworkId(attachedVehicleNetworkId);

        if (!attachedVehicle) {
            return;
        }

        if (NetworkHasControlOfEntity(attachedVehicle)) {
            return;
        }

        const attachedNetworkId = NetworkGetNetworkIdFromEntity(attachedVehicle);

        await this.vehicleService.getVehicleOwnership(
            attachedVehicle,
            attachedNetworkId,
            'flatbedAttachedVehicle while driving'
        );
    }

    @OnEvent(ClientEvent.BENNYS_FLATBED_DETACH_VEHICLE)
    public async detachVehicle(flatbedNetworkId: number, attachedVehicleNetworkId: number) {
        const flatbed = NetworkGetEntityFromNetworkId(flatbedNetworkId);

        if (!flatbed) {
            return;
        }

        const attachedVehicle = NetworkGetEntityFromNetworkId(attachedVehicleNetworkId);

        if (!attachedVehicle) {
            return;
        }

        const controlFlatbed = await this.vehicleService.getVehicleOwnership(
            flatbed,
            flatbedNetworkId,
            'flatbed while detaching'
        );

        if (!controlFlatbed) {
            this.notifier.notify('Impossible de prendre le contrôle du flatbed, ressayer plus tard', 'error');

            return;
        }

        const controlTarget = await this.vehicleService.getVehicleOwnership(
            attachedVehicle,
            attachedVehicleNetworkId,
            'flatbedAttachedVehicle while detaching'
        );

        if (!controlTarget) {
            this.notifier.notify('Impossible de prendre le controle du vehicule cible, ressayer plus tard', 'error');

            return;
        }

        if (IsEntityAttached(attachedVehicle)) {
            const flatbedPosition = GetEntityCoords(flatbed, true) as Vector4;
            const attachedVehiclePosition = GetEntityCoords(attachedVehicle, true) as Vector4;

            DetachEntity(attachedVehicle, true, true);

            SetEntityCoords(
                attachedVehicle,
                flatbedPosition[0] - (flatbedPosition[0] - attachedVehiclePosition[0]) * 6,
                flatbedPosition[1] - (flatbedPosition[1] - attachedVehiclePosition[1]) * 6,
                flatbedPosition[2],
                false,
                false,
                false,
                true
            );

            SetVehicleOnGroundProperly(attachedVehicle);

            // if (!SetVehicleOnGroundProperly(attachedVehicle)) {
            //     SetEntityAsMissionEntity(attachedVehicle, true, true);
            // }
        }

        TriggerServerEvent(ServerEvent.BENNYS_FLATBED_DETACH_VEHICLE, flatbedNetworkId);

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

        const flatbedState = await this.vehicleStateService.getVehicleState(this.currentFlatbedAttach?.entity);

        if (flatbedState.flatbedAttachedVehicle) {
            this.notifier.notify('Un véhicule est déjà attaché au flatbed.', 'error');

            return;
        }

        const state = await this.vehicleStateService.getVehicleState(vehicle);

        if (state.flatbedAttachedVehicle) {
            this.notifier.notify('Les châteaux de flatbed sont interdits, merci de prendre un jeu de cartes.', 'error');

            return;
        }

        const driverFlatBed = GetPedInVehicleSeat(this.currentFlatbedAttach.entity, VehicleSeat.Driver);
        if (driverFlatBed && IsPedAPlayer(driverFlatBed)) {
            this.notifier.notify("Impossible de remorquer lorsqu'une autre personne conduit le flatbed", 'error');

            return;
        }

        const driver = GetPedInVehicleSeat(vehicle, VehicleSeat.Driver);
        if (driver && IsPedAPlayer(driver)) {
            this.notifier.notify(
                "Impossible de remorquer lorsqu'une autre personne conduit le véhicule cible",
                'error'
            );

            return;
        }

        if (IsVehicleAttachedToTrailer(vehicle)) {
            DetachVehicleFromTrailer(vehicle);

            await wait(500);
        }

        const flatbedNetworkId = NetworkGetNetworkIdFromEntity(this.currentFlatbedAttach.entity);
        const controlFlatbed = await this.vehicleService.getVehicleOwnership(
            this.currentFlatbedAttach.entity,
            flatbedNetworkId,
            'flatbed while attaching'
        );

        if (!controlFlatbed) {
            this.notifier.notify('Impossible de prendre le contrôle du flatbed, ressayer plus tard', 'error');

            return;
        }

        const height = GetEntityHeightAboveGround(vehicle);
        const attachedVehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        const controlTarget = await this.vehicleService.getVehicleOwnership(
            vehicle,
            attachedVehicleNetworkId,
            'flatbedAttachedVehicle while attaching'
        );

        if (!controlTarget) {
            this.notifier.notify('Impossible de prendre le controle du vehicule cible, ressayer plus tard', 'error');

            return;
        }

        const attached = await this.attachVehicleToFlatbed(this.currentFlatbedAttach.entity, vehicle, height);

        if (!attached) {
            this.notifier.notify('Echec du remorquage, ressayer plus tard', 'error');

            return;
        }

        this.soundService.play('seatbelt/buckle', 0.2);
        this.notifier.notify('Le véhicule a été attaché au flatbed.');

        const vehicleFlatbedNetworkId = NetworkGetNetworkIdFromEntity(this.currentFlatbedAttach.entity);

        await this.disableFlatbedAttach();

        TriggerServerEvent(
            ServerEvent.BENNYS_FLATBED_ATTACH_VEHICLE,
            vehicleFlatbedNetworkId,
            attachedVehicleNetworkId
        );
    }

    private async attachVehicleToFlatbed(flatbed: number, vehicle: number, height: number) {
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
        return IsEntityAttached(vehicle);
    }
}

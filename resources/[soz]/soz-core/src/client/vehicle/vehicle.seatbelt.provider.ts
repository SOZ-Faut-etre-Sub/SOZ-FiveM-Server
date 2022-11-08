import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Vector3 } from '../../shared/polyzone/vector';
import { VehicleLockStatus } from '../../shared/vehicle/vehicle';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { SoundService } from '../sound.service';
import { VehicleService } from './vehicle.service';

const THRESHOLD_G_STRENGTH_HARD = 7.0;
const THRESHOLD_G_STRENGTH_SOFT = 3.5;

@Provider()
export class VehicleSeatbeltProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(SoundService)
    private soundService: SoundService;

    private isSeatbeltOn = false;
    private lastVehicleSpeed = 0;
    private lastVehiclePosition: Vector3 | null = null;
    private lastVehicleVelocity: Vector3 | null = null;

    public isSeatbeltOnForPlayer() {
        return this.isSeatbeltOn;
    }

    @Command('soz_vehicle_toggle_vehicle_seatbelt', {
        description: 'Mettre/Enlever la ceinture de sécurité',
        keys: [
            {
                mapper: 'keyboard',
                key: 'K',
            },
        ],
    })
    async toggleVehicleSeatbelt() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (exports['soz-phone'].isPhoneVisible()) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        const vehicleClass = GetVehicleClass(vehicle);

        if (vehicleClass === 8 || vehicleClass === 13 || vehicleClass === 14) {
            return;
        }

        if (GetEntitySpeed(vehicle) * 3.6 > 75) {
            this.notifier.notify('Vous allez trop vite pour faire ça.', 'error');

            return;
        }

        if (this.isSeatbeltOn) {
            this.isSeatbeltOn = false;
            this.soundService.play('seatbelt/unbuckle', 0.2);
        } else {
            this.isSeatbeltOn = true;
            this.soundService.play('seatbelt/buckle', 0.2);
        }

        if (this.isSeatbeltOn) {
            SetVehicleDoorsLocked(vehicle, VehicleLockStatus.StickPlayerInside);
        } else {
            SetVehicleDoorsLocked(vehicle, VehicleLockStatus.None);
        }

        TriggerEvent('hud:client:UpdateSeatbelt', this.isSeatbeltOn);
    }

    @Tick(500)
    async handleVehicleEjectionAndSeatbelt() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            this.lastVehicleSpeed = 0;
            this.lastVehiclePosition = null;
            this.isSeatbeltOn = false;
            TriggerEvent('hud:client:UpdateSeatbelt', this.isSeatbeltOn);

            return;
        }

        if (!NetworkGetEntityIsNetworked(vehicle)) {
            this.lastVehicleSpeed = 0;
            this.lastVehiclePosition = null;

            return;
        }

        const vehicleSpeed = GetEntitySpeed(vehicle);
        const vehiclePosition = GetEntityCoords(vehicle, false) as Vector3;
        const vehicleVelocity = GetEntityVelocity(vehicle) as Vector3;

        if (!this.lastVehiclePosition || !this.lastVehicleVelocity) {
            this.lastVehiclePosition = vehiclePosition;
            this.lastVehicleSpeed = vehicleSpeed;
            this.lastVehicleVelocity = vehicleVelocity;

            return;
        }

        const acceleration = (vehicleSpeed - this.lastVehicleSpeed) / 0.5;
        const gStrength = Math.abs(acceleration / 9.81);
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (gStrength > THRESHOLD_G_STRENGTH_SOFT) {
            TriggerServerEvent(
                ServerEvent.VEHICLE_ROUTE_EJECTION,
                vehicleNetworkId,
                gStrength,
                this.lastVehicleVelocity,
                this.getPlayersInVehicle(vehicle)
            );
        }

        this.lastVehicleVelocity = vehicleVelocity;
        this.lastVehiclePosition = vehiclePosition;
        this.lastVehicleSpeed = vehicleSpeed;
    }

    private getPlayersInVehicle(vehicle: number): number[] {
        const maxSeats = GetVehicleMaxNumberOfPassengers(vehicle);
        const players = [];

        for (let i = -1; i < maxSeats; i++) {
            const ped = GetPedInVehicleSeat(vehicle, i);

            if (ped && IsPedAPlayer(ped)) {
                players.push(GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped)));
            }
        }

        return players;
    }

    @OnEvent(ClientEvent.VEHICLE_ROUTE_EJECTION)
    async handleVehicleEjection(vehicleNetworkId: number, gStrength: number, velocity: Vector3) {
        const vehicleEjection = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const ped = PlayerPedId();
        const vehiclePedIsIn = GetVehiclePedIsIn(ped, false);

        if (!vehicleEjection || vehicleEjection !== vehiclePedIsIn) {
            return;
        }

        if (gStrength > THRESHOLD_G_STRENGTH_HARD || (!this.isSeatbeltOn && gStrength > THRESHOLD_G_STRENGTH_SOFT)) {
            await this.ejectPlayer(ped, vehicleEjection, velocity);
        }
    }

    private async ejectPlayer(ped: number, vehicle: number, velocity: Vector3) {
        const position = GetOffsetFromEntityInWorldCoords(vehicle, 1.0, 0.0, 1.0);
        SetEntityCoords(ped, position[0], position[1], position[2], false, false, false, false);

        await wait(0);

        SetPedToRagdoll(ped, 5511, 5511, 0, false, false, false);
        SetEntityVelocity(ped, velocity[0], velocity[1], velocity[2]);

        const ejectionSpeed = Math.abs(GetEntitySpeed(ped));
        const newHealth = Math.max(0, Math.round(GetEntityHealth(ped) - ejectionSpeed * 3));

        SetEntityHealth(ped, newHealth);

        this.isSeatbeltOn = false;
        TriggerEvent('hud:client:UpdateSeatbelt', this.isSeatbeltOn);
    }
}

import { Control } from '@public/shared/input';

import { Command } from '../../core/decorators/command';
import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { toVectorNorm, Vector3 } from '../../shared/polyzone/vector';
import { VehicleClass } from '../../shared/vehicle/vehicle';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { SoundService } from '../sound.service';
import { VehicleService } from './vehicle.service';

const THRESHOLD_G_STRENGTH_DEFAULT = 9.5;
const THRESHOLD_G_STRENGTH_VEHICLE_CLASS: { [key in VehicleClass]?: number } = {
    [VehicleClass.Motorcycles]: 7,
};

const EJECTION_TICK_INTERVAL_SECONDES = 0.1;

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
    private isSwitchingSeat = false;
    private lastVehicleSpeed = 0;
    private lastVehiclePosition: Vector3 | null = null;
    private lastVehicleVelocity: Vector3 | null = null;
    private lastVehicleHealth = 0;
    private lastEjectionTimeOrDamage = 0;

    private async trySwitchingSeat() {
        if (this.isSwitchingSeat) {
            return;
        }

        if (this.isSeatbeltOn) {
            return;
        }

        const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);

        if (!vehicle) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, 0) !== PlayerPedId()) {
            return;
        }

        this.isSwitchingSeat = true;
        SetPedConfigFlag(PlayerPedId(), 184, false);
        await wait(2000);
        SetPedConfigFlag(PlayerPedId(), 184, true);
        this.isSwitchingSeat = false;
        this.vehicleService.updateVehiculeClothConfig();
    }

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

        if (!player || player.metadata.isdead) {
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

        const vehicleEntering = GetVehiclePedIsEntering(ped);

        if (vehicleEntering === vehicle) {
            return;
        }

        const vehicleClass = GetVehicleClass(vehicle);

        if (vehicleClass === VehicleClass.Motorcycles || vehicleClass === VehicleClass.Cycles) {
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

        if (!this.isSeatbeltOn) {
            await wait(2000);
            await this.trySwitchingSeat();
        }
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    private async onBaseEnteredVehicle() {
        this.isSeatbeltOn = false;
        const ped = PlayerPedId();

        SetPedConfigFlag(ped, 184, true);

        const vehicle = GetVehiclePedIsIn(ped, false);
        const maxSeats = GetVehicleMaxNumberOfPassengers(vehicle);

        for (let i = -1; i < maxSeats; i++) {
            const seatPed = GetPedInVehicleSeat(vehicle, i);

            if (seatPed === ped) {
                SetPedVehicleForcedSeatUsage(ped, vehicle, i, 0);
            }
        }

        await wait(3000);
        await this.trySwitchingSeat();
    }

    @OnEvent(ClientEvent.BASE_LEFT_VEHICLE)
    private onBaseLeaveVehicle() {
        ClearAllPedVehicleForcedSeatUsage(PlayerPedId());
    }

    @Tick(EJECTION_TICK_INTERVAL_SECONDES * 1000)
    async handleVehicleEjectionAndSeatbelt() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            this.lastVehicleSpeed = 0;
            this.lastVehiclePosition = null;
            this.isSeatbeltOn = false;
            this.lastVehicleHealth = 0;

            return;
        }

        if (!NetworkGetEntityIsNetworked(vehicle) || !NetworkHasControlOfEntity(vehicle)) {
            this.lastVehicleSpeed = 0;
            this.lastVehiclePosition = null;
            this.lastVehicleHealth = 0;

            return;
        }

        const vehicleClass = GetVehicleClass(vehicle);

        if (vehicleClass === VehicleClass.Motorcycles || vehicleClass === VehicleClass.Cycles) {
            return;
        }

        const vehicleSpeed = GetEntitySpeed(vehicle);
        const vehiclePosition = GetEntityCoords(vehicle, false) as Vector3;
        const vehicleVelocity = GetEntityVelocity(vehicle) as Vector3;
        const vehicleHealth = GetEntityHealth(vehicle);

        if (!this.lastVehiclePosition || !this.lastVehicleVelocity) {
            this.lastVehiclePosition = vehiclePosition;
            this.lastVehicleSpeed = vehicleSpeed;
            this.lastVehicleVelocity = vehicleVelocity;
            this.lastVehicleHealth = vehicleHealth;

            return;
        }

        const acceleration = [
            (this.lastVehicleVelocity[0] - vehicleVelocity[0]) / EJECTION_TICK_INTERVAL_SECONDES,
            (this.lastVehicleVelocity[1] - vehicleVelocity[1]) / EJECTION_TICK_INTERVAL_SECONDES,
            (this.lastVehicleVelocity[2] - vehicleVelocity[2]) / EJECTION_TICK_INTERVAL_SECONDES,
        ] as Vector3;
        const gStrength = toVectorNorm(acceleration) / 9.81;
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (gStrength > THRESHOLD_G_STRENGTH_DEFAULT && this.lastVehicleHealth != vehicleHealth) {
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
        this.lastVehicleHealth = vehicleHealth;
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
        if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
            return;
        }

        if (this.playerService.getPlayer().metadata.godmode) {
            return;
        }

        const vehicleEjection = NetworkGetEntityFromNetworkId(vehicleNetworkId);
        const ped = PlayerPedId();
        const vehiclePedIsIn = GetVehiclePedIsIn(ped, false);

        if (!vehicleEjection || vehicleEjection !== vehiclePedIsIn) {
            return;
        }

        const gStrengthEjected =
            THRESHOLD_G_STRENGTH_VEHICLE_CLASS[GetVehicleClass(vehicleEjection)] || THRESHOLD_G_STRENGTH_DEFAULT;

        if (gStrength > gStrengthEjected) {
            this.lastEjectionTimeOrDamage = Date.now();
            if (!this.isSeatbeltOn) {
                await this.ejectPlayer(ped, vehicleEjection, velocity);
            } else {
                const damage = ((gStrength - THRESHOLD_G_STRENGTH_DEFAULT) * toVectorNorm(velocity)) / 30;
                SetEntityHealth(ped, Math.round(GetEntityHealth(ped) - damage));

                const duration = Math.min((1000 * damage) / 4, 6000);
                if (damage > 5) {
                    const blurAction = async () => {
                        SetGameplayCamShakeAmplitude(2.0);
                        TriggerScreenblurFadeIn(500);
                        await wait(duration);
                        TriggerScreenblurFadeOut(1000);
                        for (let u = 0; u < 100; u++) {
                            await wait(10);
                            SetGameplayCamShakeAmplitude((2.0 * (100 - u)) / 100);
                        }
                        SetGameplayCamShakeAmplitude(0.0);
                    };

                    if (GetScreenblurFadeCurrentTime() == 0) {
                        blurAction();
                    }
                }
                if (damage > 30) {
                    this.disabledAfterDamage(duration);
                }
            }
        }
    }

    private async disabledAfterDamage(duration: number) {
        const end = Date.now() + duration;
        while (Date.now() < end) {
            DisableControlAction(0, Control.Sprint, true);
            DisableControlAction(0, Control.Attack, true);
            DisableControlAction(0, Control.Aim, true);
            DisableControlAction(0, Control.Detonate, true);
            DisableControlAction(0, Control.ThrowGrenade, true);
            DisableControlAction(0, Control.VehicleAccelerate, true);
            DisableControlAction(0, Control.VehicleBrake, true);
            DisableControlAction(0, Control.VehicleMoveLeftRight, true);
            DisableControlAction(0, Control.VehicleMoveLeftOnly, true);
            DisableControlAction(0, Control.VehicleMoveRightOnly, true);
            DisableControlAction(0, Control.MeleeAttack1, true);
            DisableControlAction(0, Control.MeleeAttack2, true);
            DisableControlAction(0, Control.Attack2, true);
            DisableControlAction(0, Control.MeleeAttackLight, true);
            DisableControlAction(0, Control.MeleeAttackHeavy, true);
            DisableControlAction(0, Control.MeleeAttackAlternate, true);
            DisableControlAction(0, Control.MeleeBlock, true);
            DisableControlAction(0, Control.VehicleExit, true);
            DisableControlAction(27, Control.VehicleExit, true);
            await wait(0);
        }
    }

    private async ejectPlayer(ped: number, vehicle: number, velocity: Vector3) {
        const position = GetOffsetFromEntityInWorldCoords(vehicle, 1.0, 0.0, 1.0);
        SetEntityCoords(ped, position[0], position[1], position[2], false, false, false, false);

        await wait(0);

        SetPedToRagdoll(ped, 5511, 5511, 0, false, false, false);
        SetEntityVelocity(ped, velocity[0], velocity[1], velocity[2]);

        this.isSeatbeltOn = false;
    }

    public getLastEjectTime(): number {
        return this.lastEjectionTimeOrDamage;
    }
}

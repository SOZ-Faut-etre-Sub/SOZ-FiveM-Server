import { FDO } from '@public/shared/job';
import { VehicleClass, VehicleSeat } from '@public/shared/vehicle/vehicle';

import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Err, Ok } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { VoipRadioVehicleProvider } from '../voip/voip.radio.vehicle.provider';
import { VehicleCustomProvider } from './vehicle.custom.provider';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleMenuProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(VehicleCustomProvider)
    private vehicleCustomProvider: VehicleCustomProvider;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(VoipRadioVehicleProvider)
    private voipRadioVehicleProvider: VoipRadioVehicleProvider;

    @OnNuiEvent<boolean, boolean>(NuiEvent.VehicleSetEngine)
    async setVehicleEngine(engineOn: boolean) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        SetVehicleEngineOn(vehicle, engineOn, false, true);

        return true;
    }

    @OnNuiEvent<boolean, boolean>(NuiEvent.VehicleSetNeonStatus)
    async setNeonStatus(neonLightsEnabled: boolean) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);
        if (!vehicle) {
            return false;
        }

        const state = await this.vehicleStateService.getVehicleState(vehicle).then(data => {
            return data;
        });

        const neonLightsStatus = neonLightsEnabled;
        this.vehicleStateService.updateVehicleState(vehicle, { neonLightsStatus }, false);

        DisableVehicleNeonLights(vehicle, state.neonLightsStatus);
        return true;
    }

    @Command('vehiclelimitersetter', {
        description: 'Activer / Désactiver le limiteur',
        keys: [{ mapper: 'keyboard', key: 'slash' }],
    })
    async setSpeedLimit() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        const isDriver = GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === ped;

        if (!isDriver) {
            return false;
        }

        const state = await this.vehicleStateService.getVehicleState(vehicle).then(data => {
            return data;
        });

        const currentSpeed = GetEntitySpeed(vehicle) * 3.6;
        const speedLimit = state.speedLimit ? null : Math.round(currentSpeed);

        this.vehicleStateService.updateVehicleState(vehicle, { speedLimit }, false);

        if (speedLimit == 0 || speedLimit == null) {
            this.notifier.notify('Limiteur de vitesse ~r~désactivé~s~.');
        } else {
            this.notifier.notify(`Limiteur de vitesse ~g~activé~s~ à ${speedLimit} km/h.`);
        }
    }

    @OnNuiEvent<null | number, boolean>(NuiEvent.VehicleSetSpeedLimit)
    async setVehicleSpeedLimit(speedLimit: null | number) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        // -1 is for current speed
        if (speedLimit === -1) {
            const currentSpeed = GetEntitySpeed(vehicle) * 3.6;
            speedLimit = Math.round(currentSpeed);
        }
        // -2 is for custom speed
        else if (speedLimit === -2) {
            const customSpeedLimit = await this.inputService.askInput(
                {
                    title: 'Limiter la vitesse à :',
                    maxCharacters: 4,
                    defaultValue: '',
                },
                (input: string) => {
                    const value = parseInt(input);

                    if (isNaN(value) || value < 0) {
                        return Err('Veuillez entrer un nombre supérieur à 0');
                    }

                    return Ok(true);
                }
            );

            if (!customSpeedLimit) {
                return false;
            }

            speedLimit = parseInt(customSpeedLimit);
        }

        this.vehicleStateService.updateVehicleState(vehicle, { speedLimit }, false);

        if (speedLimit == 0 || speedLimit == null) {
            this.notifier.notify('Limiteur de vitesse ~r~désactivé~s~.');
        } else {
            this.notifier.notify(`Limiteur de vitesse ~g~activé~s~ à ${speedLimit} km/h.`);
        }

        return true;
    }

    @OnNuiEvent(NuiEvent.VehicleSetDoorOpen)
    async setVehicleDoorState({ doorIndex, open }: { doorIndex: number; open: boolean }) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        if (open) {
            SetVehicleDoorOpen(vehicle, doorIndex, false, false);
        } else {
            SetVehicleDoorShut(vehicle, doorIndex, false);
        }

        return true;
    }

    @OnNuiEvent(NuiEvent.VehicleHandleRadio)
    async handleVehicleRadio() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        this.voipRadioVehicleProvider.openRadioInterface();

        this.nuiMenu.closeMenu();

        return true;
    }

    @OnNuiEvent(NuiEvent.VehicleOpenLSCustom)
    async handleVehicleLSCustom(admin?: boolean) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        this.nuiMenu.closeMenu();

        await this.vehicleCustomProvider.upgradeVehicle(vehicle, admin);

        return true;
    }

    @OnNuiEvent(NuiEvent.VehicleAnchorChange)
    async handleAnchorChange(status: boolean) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        SetBoatAnchor(vehicle, status);
        SetBoatFrozenWhenAnchored(vehicle, status);

        if (status) {
            this.notifier.notify("Vous avez ~g~baissé~s~ l'ancre.");
        } else {
            this.notifier.notify("Vous avez ~r~relevé~s~ l'ancre.");
        }

        return true;
    }

    @OnNuiEvent(NuiEvent.VehiclePoliceDisplay)
    async handlePoliceDisplay(status: boolean) {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return false;
        }

        this.vehicleStateService.updateVehicleState(vehicle, {
            policeLocatorEnabled: status,
        });
    }

    @Tick(TickInterval.EVERY_SECOND)
    public checkCloseMenu(): void {
        if (this.nuiMenu.getOpened() !== MenuType.Vehicle) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (vehicle) {
            return;
        }

        this.nuiMenu.closeMenu();
    }

    @Command('soz_vehicle_toggle_menu', {
        description: 'Ouvrir le menu du véhicule.',
        keys: [
            {
                mapper: 'keyboard',
                key: 'HOME',
            },
        ],
    })
    async openMenu() {
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle || player.metadata.isdead) {
            return;
        }

        const isDriver = GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) === ped;
        const isCopilot = GetPedInVehicleSeat(vehicle, VehicleSeat.Copilot) === ped;

        if (!isDriver && !isCopilot) {
            return;
        }

        const vehicleState = await this.vehicleStateService.getVehicleState(vehicle);

        if (isCopilot && !vehicleState.hasRadio) {
            return;
        }

        if (this.nuiMenu.getOpened() === MenuType.Vehicle) {
            this.nuiMenu.closeMenu();

            return;
        }

        const [isAllowed, permission] = await emitRpc<[boolean, string]>(RpcServerEvent.ADMIN_IS_ALLOWED);
        const doorStatus = {};

        for (let i = 0; i < 6; i++) {
            doorStatus[i] = GetVehicleDoorAngleRatio(vehicle, i) >= 0.5;
        }

        const pitstop = await emitRpc<[boolean, number]>(
            RpcServerEvent.VEHICLE_PITSTOP_DATA,
            NetworkGetNetworkIdFromEntity(vehicle)
        );

        const hasNeon = () => {
            if (
                IsVehicleNeonLightEnabled(vehicle, 0) ||
                IsVehicleNeonLightEnabled(vehicle, 1) ||
                IsVehicleNeonLightEnabled(vehicle, 2) ||
                IsVehicleNeonLightEnabled(vehicle, 3)
            ) {
                return true;
            } else {
                return false;
            }
        };

        this.nuiMenu.openMenu<MenuType.Vehicle>(MenuType.Vehicle, {
            isDriver,
            engineOn: GetIsVehicleEngineRunning(vehicle),
            speedLimit: vehicleState.speedLimit,
            doorStatus,
            hasRadio: vehicleState.hasRadio,
            insideLSCustom: this.vehicleCustomProvider.isPedInsideCustomZone(),
            permission: isAllowed ? permission : null,
            isAnchor: IsBoatAnchoredAndFrozen(vehicle),
            isBoat: GetVehicleClass(vehicle) == VehicleClass.Boats,
            police: FDO.includes(player.job.id) && FDO.includes(vehicleState.job),
            policeLocator: vehicleState.policeLocatorEnabled,
            onDutyNg: pitstop[0],
            pitstopPrice: pitstop[1],
            neonLightsStatus: vehicleState.neonLightsStatus,
            hasNeon: hasNeon(),
        });
    }
}

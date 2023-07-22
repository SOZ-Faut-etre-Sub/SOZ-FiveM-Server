import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event';
import { VehicleVolatileState } from '../../shared/vehicle/vehicle';
import { NuiMenu } from '../nui/nui.menu';
import { VehicleStateService } from './vehicle.state.service';

export const createVehicleChangeCallback = (
    callback: (vehicle: number, ...data) => void,
    checkOwnership = true
): ((vehicle: number) => void) => {
    return (vehicle: number, ...data) => {
        if (!vehicle || !DoesEntityExist(vehicle)) {
            return;
        }

        if (!IsEntityAVehicle(vehicle)) {
            return;
        }

        if (checkOwnership && !NetworkHasControlOfEntity(vehicle)) {
            return;
        }

        callback(vehicle, ...data);
    };
};

@Provider()
export class VehicleStateProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Once(OnceStep.Start)
    public initStateSelector() {
        // Indicators and lights
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleVolatileState) => state.indicators.left],
            createVehicleChangeCallback((vehicle: number, left: boolean) => {
                SetVehicleIndicatorLights(vehicle, 1, left);
            }, false)
        );

        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleVolatileState) => state.indicators.right],
            createVehicleChangeCallback((vehicle: number, right: boolean) => {
                SetVehicleIndicatorLights(vehicle, 0, right);
            }, false)
        );

        // Windows
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleVolatileState) => state.openWindows],
            createVehicleChangeCallback((vehicle: number, openWindows: boolean) => {
                if (openWindows) {
                    RollDownWindow(vehicle, 0);
                    RollDownWindow(vehicle, 1);
                } else {
                    RollUpWindow(vehicle, 0);
                    RollUpWindow(vehicle, 1);
                    RollUpWindow(vehicle, 2);
                    RollUpWindow(vehicle, 3);
                }
            }, false)
        );

        // Windows
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleVolatileState) => state.speedLimit],
            createVehicleChangeCallback(async (vehicle: number, speedLimit: number) => {
                if (speedLimit > 0) {
                    let currentSpeed = GetEntitySpeed(vehicle) * 3.6;

                    while (currentSpeed > speedLimit) {
                        const maxSpeed = Math.max(speedLimit, currentSpeed - 2);
                        currentSpeed = GetEntitySpeed(vehicle) * 3.6;

                        SetVehicleMaxSpeed(vehicle, maxSpeed / 3.6 - 0.25);
                        await wait(50);

                        const newState = await this.vehicleStateService.getVehicleState(vehicle);

                        if (newState.speedLimit !== speedLimit) {
                            return;
                        }
                    }

                    SetVehicleMaxSpeed(vehicle, speedLimit / 3.6 - 0.25);
                } else {
                    const maxSpeed = GetVehicleHandlingFloat(vehicle, 'CHandlingData', 'fInitialDriveMaxFlatVel');
                    SetVehicleMaxSpeed(vehicle, maxSpeed);

                    const passengerCount = Math.max(0, GetVehicleNumberOfPassengers(vehicle) - 1);
                    ModifyVehicleTopSpeed(vehicle, 1 - passengerCount * 0.02);
                }
            })
        );
    }

    @OnEvent(ClientEvent.VEHICLE_UPDATE_STATE)
    public updateVehicleState(vehicleNetworkId: number, state: VehicleVolatileState, registerState = true): void {
        if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
            return;
        }

        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!vehicleEntityId || !state) {
            return;
        }

        this.vehicleStateService.setVehicleState(vehicleEntityId, state, registerState);
    }

    @OnEvent(ClientEvent.VEHICLE_DELETE_STATE)
    public deleteVehicleState(vehicleNetworkId: number): void {
        if (!NetworkDoesNetworkIdExist(vehicleNetworkId)) {
            return;
        }

        const vehicleEntityId = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (vehicleEntityId) {
            this.vehicleStateService.deleteVehicleState(vehicleEntityId);
        }
    }

    @Tick(TickInterval.EVERY_5_MINUTE)
    public async checkState() {
        this.vehicleStateService.checkState();
    }

    @Tick(0)
    public async setVehicleIndicators() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        if (this.nuiMenu.getOpened() !== null) {
            return;
        }

        if (GetPedInVehicleSeat(vehicle, -1) !== ped) {
            return;
        }

        const toggleLeft = IsControlJustPressed(0, 189);
        const toggleRight = IsControlJustPressed(0, 190);
        const toggleWindowsUp = IsControlJustPressed(0, 188);
        const toggleWindowsDown = IsControlJustPressed(0, 187);

        if (toggleLeft || toggleRight || toggleWindowsUp || toggleWindowsDown) {
            const state = await this.vehicleStateService.getVehicleState(vehicle);

            this.vehicleStateService.updateVehicleState(
                vehicle,
                {
                    indicators: {
                        left: toggleLeft ? !state.indicators.left : state.indicators.left,
                        right: toggleRight ? !state.indicators.right : state.indicators.right,
                    },
                    openWindows: toggleWindowsDown ? true : toggleWindowsUp ? false : state.openWindows,
                },
                true,
                true
            );
        }
    }
}

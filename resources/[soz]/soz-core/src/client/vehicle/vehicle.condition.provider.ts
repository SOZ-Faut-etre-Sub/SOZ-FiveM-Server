import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { VehicleEntityState } from '../../shared/vehicle/vehicle';
import { NuiMenu } from '../nui/nui.menu';
import { TargetFactory } from '../target/target.factory';
import { VehicleService } from './vehicle.service';
import { VehicleStateService } from './vehicle.state.service';

type CurrentVehiclePosition = {
    vehicle: number;
    position: Vector3;
};

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
export class VehicleConditionProvider {
    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private currentVehiclePositionForMileage: CurrentVehiclePosition | null = null;

    private adminNoStall = false;

    @Once(OnceStep.Start)
    public initStateSelector() {
        // Body health
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.condition.bodyHealth],
            createVehicleChangeCallback((vehicle: number, bodyHealth: number) => {
                SetVehicleBodyHealth(vehicle, bodyHealth);

                if (bodyHealth > 999.99) {
                    SetVehicleDeformationFixed(vehicle);
                }
            })
        );

        // Fuel level
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.condition.fuelLevel],
            createVehicleChangeCallback((vehicle: number, fuelLevel: number) => {
                SetVehicleFuelLevel(vehicle, fuelLevel);
            })
        );

        // Oil level
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.condition.oilLevel],
            createVehicleChangeCallback((vehicle: number, oilLevel: number) => {
                const maxOilVolume = GetVehicleHandlingFloat(vehicle, 'CHandlingData', 'fOilVolume');

                if (maxOilVolume) {
                    const realOilLevel = (oilLevel * maxOilVolume) / 100;
                    SetVehicleOilLevel(vehicle, realOilLevel);
                }
            })
        );

        // Dirt level
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.condition.dirtLevel],
            createVehicleChangeCallback((vehicle: number, dirtLevel: number) => {
                SetVehicleDirtLevel(vehicle, dirtLevel);

                if (dirtLevel < 0.1) {
                    WashDecalsFromVehicle(vehicle, 1.0);
                }
            })
        );

        // Engine health
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.condition.engineHealth],
            createVehicleChangeCallback((vehicle: number, engineHealth: number) => {
                SetVehicleEngineHealth(vehicle, engineHealth);
            })
        );

        // Petrol tank health
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.condition.tankHealth],
            createVehicleChangeCallback((vehicle: number, tankHealth: number) => {
                SetVehiclePetrolTankHealth(vehicle, tankHealth);
            })
        );

        // Wheel
        this.vehicleStateService.addVehicleStateSelector(
            [
                (state: VehicleEntityState) => state.condition.tireHealth,
                (state: VehicleEntityState) => state.condition.tireBurstCompletely,
                (state: VehicleEntityState) => state.condition.tireBurstState,
            ],
            createVehicleChangeCallback(this.applyVehicleTire.bind(this))
        );

        // Door broken
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.condition.doorStatus],
            createVehicleChangeCallback((vehicle: number, doorStatus: { [key: number]: boolean }) => {
                for (const [key, value] of Object.entries(doorStatus)) {
                    if (value) {
                        SetVehicleDoorBroken(vehicle, parseInt(key, 10), true);
                    }
                }
            })
        );

        // Windows broken
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.condition.windowStatus],
            createVehicleChangeCallback((vehicle: number, windowStatus: { [key: number]: boolean }) => {
                for (const [key, value] of Object.entries(windowStatus)) {
                    if (value) {
                        SmashVehicleWindow(vehicle, parseInt(key, 10));
                    } else {
                        FixVehicleWindow(vehicle, parseInt(key, 10));
                    }
                }
            })
        );

        // Indicators and lights
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.indicators.left],
            createVehicleChangeCallback((vehicle: number, left: boolean) => {
                SetVehicleIndicatorLights(vehicle, 1, left);
            }, false)
        );

        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.indicators.right],
            createVehicleChangeCallback((vehicle: number, right: boolean) => {
                SetVehicleIndicatorLights(vehicle, 1, right);
            }, false)
        );

        // Windows
        this.vehicleStateService.addVehicleStateSelector(
            [(state: VehicleEntityState) => state.openWindows],
            createVehicleChangeCallback((vehicle: number, openWindows: boolean) => {
                if (openWindows) {
                    RollDownWindow(vehicle, 0);
                    RollDownWindow(vehicle, 1);
                } else {
                    RollUpWindow(vehicle, 0);
                    RollUpWindow(vehicle, 1);
                }
            }, false)
        );
    }

    public applyVehicleTire(
        vehicle: number,
        tireHealth: { [key: number]: number },
        tireBurstCompletely: { [key: number]: boolean },
        tireBurstState: { [key: number]: boolean }
    ) {
        const wheelNumber = 6;

        for (let i = 0; i < wheelNumber; i++) {
            SetVehicleWheelHealth(vehicle, i, tireHealth[i] || 1000.0);
        }

        for (let i = 0; i < wheelNumber; i++) {
            if (tireBurstCompletely[i]) {
                SetVehicleTyreBurst(vehicle, i, true, 1000.0);
            } else if (tireBurstState[i]) {
                SetVehicleTyreBurst(vehicle, i, false, tireHealth[i] || 1000.0);
            } else {
                SetVehicleTyreFixed(vehicle, i);
            }
        }
    }

    @Once(OnceStep.PlayerLoaded)
    public async init() {
        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/nettoyer.png',
                label: 'Laver (kit)',
                item: 'cleaningkit',
                action: entity => {
                    const networkId = NetworkGetNetworkIdFromEntity(entity);

                    TriggerServerEvent(ServerEvent.VEHICLE_USE_CLEANING_KIT, networkId);
                },
                canInteract: () => {
                    return true;
                },
            },
            {
                icon: 'c:mechanic/reparer.png',
                label: 'Réparer (kit)',
                item: 'repairkit',
                action: entity => {
                    const networkId = NetworkGetNetworkIdFromEntity(entity);

                    TriggerServerEvent(ServerEvent.VEHICLE_USE_REPAIR_KIT, networkId);
                },
                canInteract: () => {
                    return true;
                },
            },
            {
                icon: 'c:mechanic/repair_wheel.png',
                label: 'Anti crevaison (kit)',
                item: 'wheel_kit',
                action: entity => {
                    const networkId = NetworkGetNetworkIdFromEntity(entity);

                    TriggerServerEvent(ServerEvent.VEHICLE_USE_WHEEL_KIT, networkId);
                },
                canInteract: () => {
                    return true;
                },
            },
        ]);
    }

    @OnEvent(ClientEvent.VEHICLE_CHECK_CONDITION)
    public async checkCondition(vehicleNetworkId: number) {
        if (!NetworkDoesEntityExistWithNetworkId(vehicleNetworkId)) {
            return;
        }

        const vehicle = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!vehicle || !DoesEntityExist(vehicle)) {
            return;
        }

        if (!IsEntityAVehicle(vehicle)) {
            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            return;
        }

        // Check dead status
        const state = await this.vehicleStateService.getVehicleState(vehicle);

        this.checkVehicleWater(vehicle, state);

        // Check vehicle condition
        this.vehicleStateService.updateVehicleCondition(vehicle, this.vehicleService.getVehicleCondition(vehicle));
    }

    @Tick(200)
    public async updateVehicleMaxSpeed() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            return;
        }

        const owner = NetworkGetEntityOwner(vehicle);

        if (owner !== PlayerId()) {
            return;
        }

        const state = await this.vehicleStateService.getVehicleState(vehicle);

        if (state.speedLimit > 0) {
            const currentSpeed = GetEntitySpeed(vehicle) * 3.6;
            const speedLimit = Math.max(state.speedLimit, currentSpeed - 5);

            SetVehicleMaxSpeed(vehicle, speedLimit / 3.6 - 0.25);
        } else {
            const maxSpeed = GetVehicleHandlingFloat(vehicle, 'CHandlingData', 'fInitialDriveMaxFlatVel');
            SetVehicleMaxSpeed(vehicle, maxSpeed);

            const passengerCount = Math.max(0, GetVehicleNumberOfPassengers(vehicle) - 1);
            ModifyVehicleTopSpeed(vehicle, 1 - passengerCount * 0.02);
        }
    }

    private checkVehicleWater(vehicle: number, state: VehicleEntityState) {
        if (!state.isPlayerVehicle || state.dead) {
            return;
        }

        const isDead = IsEntityDead(vehicle);

        if (isDead) {
            let reason = 'unknown';

            if (IsEntityInWater(vehicle)) {
                reason = 'water';
            } else if (IsEntityOnFire(vehicle)) {
                reason = 'fire';
            }

            SetVehicleEngineOn(vehicle, false, true, false);
            SetVehicleUndriveable(vehicle, true);

            const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

            TriggerServerEvent(ServerEvent.VEHICLE_SET_DEAD, vehicleNetworkId, reason);
        }
    }

    @Tick(500)
    public checkVehicleMileage() {
        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);

        if (!vehicle) {
            this.currentVehiclePositionForMileage = null;

            return;
        }

        if (!NetworkHasControlOfEntity(vehicle)) {
            this.currentVehiclePositionForMileage = null;

            return;
        }

        if (this.currentVehiclePositionForMileage && this.currentVehiclePositionForMileage.vehicle !== vehicle) {
            this.currentVehiclePositionForMileage = {
                vehicle,
                position: GetEntityCoords(vehicle, true) as Vector3,
            };

            return;
        }

        const lastVehiclePosition = this.currentVehiclePositionForMileage;
        this.currentVehiclePositionForMileage = {
            vehicle,
            position: GetEntityCoords(vehicle, true) as Vector3,
        };

        if (lastVehiclePosition === null) {
            return;
        }

        const diffDistance = getDistance(lastVehiclePosition.position, this.currentVehiclePositionForMileage.position);
        const networkId = NetworkGetNetworkIdFromEntity(vehicle);

        if (diffDistance < 0.1) {
            return;
        }

        TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_MILEAGE, networkId, diffDistance);

        const [isTrailerExists, trailerEntity] = GetVehicleTrailerVehicle(vehicle);

        if (isTrailerExists) {
            const trailerNetworkId = NetworkGetNetworkIdFromEntity(trailerEntity);

            TriggerServerEvent(ServerEvent.VEHICLE_UPDATE_MILEAGE, trailerNetworkId, diffDistance);
        }
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

            this.vehicleStateService.updateVehicleState(vehicle, {
                indicators: {
                    left: toggleLeft ? !state.indicators.left : state.indicators.left,
                    right: toggleRight ? !state.indicators.right : state.indicators.right,
                },
                openWindows: toggleWindowsDown ? true : toggleWindowsUp ? false : state.openWindows,
            });
        }
    }

    public setAdminNoStall(value: boolean) {
        this.adminNoStall = value;
    }

    public getAdminNoStall(): boolean {
        return this.adminNoStall;
    }
}

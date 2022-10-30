import { DealershipConfig, DealershipConfigItem, DealershipType } from '../../config/dealership';
import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { VehicleStateService } from '../../server/vehicle/vehicle.state.service';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { RpcEvent } from '../../shared/rpc';
import { Vehicle, VehicleCategory, VehicleDealershipMenuData } from '../../shared/vehicle/vehicle';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { ResourceLoader } from '../resources/resource.loader';
import { TargetFactory } from '../target/target.factory';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleDealershipProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(Notifier)
    private notifier: Notifier;

    private lastVehicleShowroom: number | null = null;

    @Once(OnceStep.PlayerLoaded)
    public async onPlayerLoaded() {
        for (const [dealership, config] of Object.entries(DealershipConfig)) {
            this.blipFactory.create(`dealership_${dealership}`, {
                name: config.blip.name,
                sprite: config.blip.sprite,
                color: config.blip.color,
                coords: {
                    x: config.position[0],
                    y: config.position[1],
                    z: config.position[2],
                },
            });

            this.targetFactory.createForPed({
                model: config.ped,
                invincible: true,
                freeze: true,
                spawnNow: true,
                coords: {
                    x: config.position[0],
                    y: config.position[1],
                    z: config.position[2],
                    w: config.position[3],
                },
                target: {
                    options: [
                        {
                            icon: 'c:dealership/list.png',
                            label: 'Accéder au catalogue',
                            blackoutGlobal: true,
                            action: () => {
                                this.openDealership(dealership as DealershipType, config);
                            },
                            canInteract: () => true,
                        },
                    ],
                    distance: 2.5,
                },
            });
        }
    }

    @OnNuiEvent<{ vehicle: Vehicle; dealership: DealershipConfigItem }>(NuiEvent.VehicleDealershipShowVehicle)
    public async showVehicle({ vehicle, dealership }): Promise<void> {
        if (this.lastVehicleShowroom) {
            SetEntityAsMissionEntity(this.lastVehicleShowroom, true, true);
            DeleteVehicle(this.lastVehicleShowroom);

            this.lastVehicleShowroom = null;
        }

        await this.resourceLoader.loadModel(vehicle.hash);

        const vehicleEntity = CreateVehicle(
            vehicle.hash,
            dealership.showroom.position[0],
            dealership.showroom.position[1],
            dealership.showroom.position[2],
            dealership.showroom.position[3],
            false,
            false
        );

        this.resourceLoader.unloadModel(vehicle.hash);

        SetVehicleOnGroundProperly(vehicleEntity);
        SetEntityInvincible(vehicleEntity, true);
        SetVehicleDoorsLocked(vehicleEntity, 6);
        FreezeEntityPosition(vehicleEntity, true);
        SetVehicleNumberPlateText(vehicleEntity, 'SOZ');

        this.lastVehicleShowroom = vehicleEntity;
    }

    @OnNuiEvent<{ vehicle: Vehicle; dealershipId: string; dealership: DealershipConfigItem }>(
        NuiEvent.VehicleDealershipBuyVehicle
    )
    public async buyVehicle({ vehicle, dealershipId, dealership }): Promise<void> {
        const bought = await emitRpc(RpcEvent.VEHICLE_DEALERSHIP_BUY, vehicle, dealershipId, dealership);

        if (bought) {
            this.clearMenu();
            this.nuiMenu.closeMenu();
        }
    }

    @OnNuiEvent<{ menuType: MenuType; menuData: VehicleDealershipMenuData }>(NuiEvent.MenuClosed)
    public async onMenuClose({ menuType }) {
        if (menuType !== MenuType.VehicleDealership) {
            return;
        }

        this.clearMenu();
    }

    private clearMenu() {
        if (this.lastVehicleShowroom) {
            SetEntityAsMissionEntity(this.lastVehicleShowroom, true, true);
            DeleteVehicle(this.lastVehicleShowroom);

            this.lastVehicleShowroom = null;
        }

        RenderScriptCams(false, false, 0, false, false);
        DestroyAllCams(true);
        SetFocusEntity(GetPlayerPed(PlayerId()));
    }

    public async openDealership(dealershipType: DealershipType, config: DealershipConfigItem) {
        const vehicles = await emitRpc<Vehicle[]>(RpcEvent.VEHICLE_DEALERSHIP_GET_LIST, dealershipType);
        const categories: Record<
            string,
            {
                name: string;
                vehicles: Vehicle[];
            }
        > = {};

        for (const vehicle of vehicles) {
            if (!categories[vehicle.category]) {
                categories[vehicle.category] = {
                    name: VehicleCategory[vehicle.category],
                    vehicles: [],
                };
            }

            categories[vehicle.category].vehicles.push(vehicle);
        }

        let vehicle = this.vehicleService.getClosestVehicle({
            position: config.showroom.position,
            maxDistance: 3.0,
        });

        while (vehicle) {
            const state = this.vehicleStateService.getVehicleState(vehicle);

            if (state.id) {
                this.notifier.notify('Un véhicule joueur est trop proche du showroom.', 'error');

                return;
            }

            SetEntityAsMissionEntity(vehicle, true, true);
            DeleteVehicle(vehicle);

            vehicle = this.vehicleService.getClosestVehicle({
                position: config.showroom.position,
                maxDistance: 3.0,
            });
        }

        this.nuiMenu.openMenu(MenuType.VehicleDealership, {
            name: config.blip.name,
            dealership: config,
            dealershipId: dealershipType,
            categories: Object.values(categories).sort((a, b) => a.name.localeCompare(b.name)),
        });

        const camera = CreateCamWithParams(
            'DEFAULT_SCRIPTED_CAMERA',
            config.showroom.camera[0],
            config.showroom.camera[1],
            config.showroom.camera[2],
            0.0,
            0.0,
            0.0,
            60.0,
            false,
            0
        );

        PointCamAtCoord(camera, config.showroom.position[0], config.showroom.position[1], config.showroom.position[2]);
        SetCamActive(camera, true);
        RenderScriptCams(true, true, 1, true, true);
    }
}

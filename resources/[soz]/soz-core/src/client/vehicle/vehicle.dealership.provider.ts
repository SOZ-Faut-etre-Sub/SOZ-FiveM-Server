import { DealershipConfig, DealershipConfigItem, DealershipType } from '../../config/dealership';
import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { MenuType } from '../../shared/nui/menu';
import { RpcEvent } from '../../shared/rpc';
import { Vehicle, VehicleCategory } from '../../shared/vehicle/vehicle';
import { BlipFactory } from '../blip';
import { NuiMenu } from '../nui/nui.menu';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class VehicleDealershipProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

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

    public showVehicle(model: string, dealership: DealershipConfigItem) {}

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

        this.nuiMenu.openMenu(MenuType.VehicleDealership, {
            name: config.blip.name,
            dealership: config,
            categories: Object.values(categories).sort((a, b) => a.name.localeCompare(b.name)),
        });
    }
}

import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { BoxZone } from '../../shared/polyzone/box.zone';
import { MultiZone } from '../../shared/polyzone/multi.zone';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcEvent } from '../../shared/rpc';
import {
    getVehicleCustomPrice,
    VehicleCustomMenuData,
    VehicleLsCustom,
    VehicleLsCustomBaseConfig,
    VehicleLsCustomLevel,
    VehicleModification,
} from '../../shared/vehicle/vehicle';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { VehicleRepository } from '../resources/vehicle.repository';
import { TargetFactory } from '../target/target.factory';
import { VehicleService } from './vehicle.service';

@Provider()
export class VehicleCustomProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(VehicleRepository)
    private vehicleRepository: VehicleRepository;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    private lsCustomZone = new MultiZone([
        new BoxZone([-339.46, -136.73, 39.01], 10, 10, {
            heading: 70,
            minZ: 38.01,
            maxZ: 42.01,
        }),
        new BoxZone([-1154.88, -2005.4, 13.18], 10, 10, {
            heading: 45,
            minZ: 12.18,
            maxZ: 16.18,
        }),
        new BoxZone([731.87, -1087.88, 22.17], 10, 10, {
            heading: 0,
            minZ: 21.17,
            maxZ: 25.17,
        }),
        new BoxZone([110.98, 6627.06, 31.89], 10, 10, {
            heading: 45,
            minZ: 30.89,
            maxZ: 34.89,
        }),
        new BoxZone([1175.88, 2640.3, 37.79], 10, 10, {
            heading: 45,
            minZ: 36.79,
            maxZ: 40.79,
        }),
    ]);

    @Once(OnceStep.PlayerLoaded)
    onStart(): void {
        for (const zoneIndex in this.lsCustomZone.zones) {
            const zone = this.lsCustomZone.zones[zoneIndex];

            this.blipFactory.create(`ls_custom_${zoneIndex}`, {
                sprite: 72,
                color: 46,
                coords: {
                    x: zone.center[0],
                    y: zone.center[1],
                    z: zone.center[2],
                },
                name: 'LS Custom',
            });
        }

        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/Ameliorer.png',
                label: 'Améliorer sa voiture',
                blackoutGlobal: true,
                action: vehicle => {
                    this.upgradeVehicle(vehicle);
                },
                canInteract: () => {
                    const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

                    return this.lsCustomZone.isPointInside(position);
                },
            },
        ]);
    }

    @OnNuiEvent<{ menuType: MenuType; menuData: VehicleCustomMenuData }>(NuiEvent.MenuClosed)
    public async onMenuClose({ menuType, menuData }) {
        if (menuType !== MenuType.VehicleCustom) {
            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(menuData.vehicle);
        const vehicleCurrentModification = await emitRpc<VehicleModification>(
            RpcEvent.VEHICLE_CUSTOM_GET_MODS,
            vehicleNetworkId
        );

        this.vehicleService.applyVehicleModification(menuData.vehicle, vehicleCurrentModification);
    }

    @OnNuiEvent<{ vehicleEntityId: number; vehicleModification: VehicleModification }>(NuiEvent.VehicleCustomApply)
    public async applyVehicleModification({ vehicleEntityId, vehicleModification }): Promise<void> {
        this.vehicleService.applyVehicleModification(vehicleEntityId, vehicleModification);
    }

    @OnNuiEvent<{ vehicleEntityId: number; vehicleModification: Partial<VehicleModification> }>(
        NuiEvent.VehicleCustomConfirmModification
    )
    public async confirmVehicleCustom({ vehicleEntityId, vehicleModification }): Promise<void> {
        const vehicleLsCustom = this.buildVehicleLsCustomConfig(vehicleEntityId);

        if (!vehicleLsCustom) {
            this.notifier.notify('Vous ne pouvez pas améliorer cette voiture', 'error');
            this.nuiMenu.closeMenu();

            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);
        const vehicleCurrentModification = await emitRpc<VehicleModification>(
            RpcEvent.VEHICLE_CUSTOM_GET_MODS,
            vehicleNetworkId
        );

        const price = getVehicleCustomPrice(vehicleLsCustom, vehicleCurrentModification, vehicleModification);
        const newVehicleModification = await emitRpc<VehicleModification>(
            RpcEvent.VEHICLE_CUSTOM_SET_MODS,
            vehicleNetworkId,
            vehicleModification,
            price
        );

        this.vehicleService.applyVehicleModification(vehicleEntityId, newVehicleModification);
        this.nuiMenu.closeMenu();
    }

    public async upgradeVehicle(vehicleEntityId: number) {
        const vehicleLsCustom = this.buildVehicleLsCustomConfig(vehicleEntityId);

        if (!vehicleLsCustom) {
            this.notifier.notify('Vous ne pouvez pas améliorer cette voiture', 'error');

            return;
        }

        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);
        const vehicleModification = await emitRpc<VehicleModification>(
            RpcEvent.VEHICLE_CUSTOM_GET_MODS,
            vehicleNetworkId
        );

        this.nuiMenu.openMenu(MenuType.VehicleCustom, {
            vehicle: vehicleEntityId,
            custom: vehicleLsCustom,
            currentModification: vehicleModification,
        });
    }

    private buildVehicleLsCustomConfig(vehicleEntityId: number): VehicleLsCustom | null {
        const custom = {};
        const model = GetEntityModel(vehicleEntityId);
        const vehicle = this.vehicleRepository.getByModelHash(model);

        if (!vehicle) {
            return null;
        }

        for (const [modType, config] of Object.entries(VehicleLsCustomBaseConfig)) {
            const maxLevels = Math.min(config.priceByLevels.length, GetNumVehicleMods(vehicleEntityId, config.mod));
            const levels: VehicleLsCustomLevel[] = [];

            for (let i = 0; i < maxLevels; i++) {
                const modTextLabel = GetModTextLabel(vehicleEntityId, config.mod, i);
                let modName = GetLabelText(modTextLabel);

                if (modName === 'NULL') {
                    modName = (config.prefix ? config.prefix : config.label) + ' ' + i;
                }

                levels.push({
                    price: config.priceByLevels[i] * vehicle.price,
                    name: modName,
                });
            }

            if (levels.length > 0) {
                custom[modType] = {
                    label: config.label,
                    levels,
                };
            }
        }

        return custom;
    }
}

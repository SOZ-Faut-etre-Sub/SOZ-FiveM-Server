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
    VehicleConfiguration,
    VehicleCustomMenuData,
    VehicleUpgradeOptions,
} from '../../shared/vehicle/modification';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { VehicleRepository } from '../resources/vehicle.repository';
import { TargetFactory } from '../target/target.factory';
import { VehicleModificationService } from './vehicle.modification.service';
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

    @Inject(VehicleModificationService)
    private vehicleModificationService: VehicleModificationService;

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
        new BoxZone([99.01, 6633.45, 31.5], 19.0, 7.2, {
            heading: 315.0,
            minZ: 28.5,
            maxZ: 34.502,
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
    }

    public isPedInsideCustomZone(): boolean {
        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

        return this.lsCustomZone.isPointInside(position);
    }

    @OnNuiEvent<{ menuType: MenuType; menuData: VehicleCustomMenuData }>(NuiEvent.MenuClosed)
    public async onMenuClose({ menuType, menuData }) {
        if (menuType !== MenuType.VehicleCustom && menuType !== MenuType.BennysUpgradeVehicle) {
            return;
        }

        if (menuData.vehicle) {
            SetVehicleUndriveable(menuData.vehicle, false);
            SetVehicleLights(menuData.vehicle, 0);

            if (menuData.originalConfiguration) {
                this.vehicleModificationService.applyVehicleConfiguration(
                    menuData.vehicle,
                    menuData.originalConfiguration
                );
            }
        }
    }

    @OnNuiEvent<{ vehicleEntityId: number; vehicleConfiguration: VehicleConfiguration }>(NuiEvent.VehicleCustomApply)
    public async applyVehicleConfiguration({ vehicleEntityId, vehicleConfiguration }): Promise<VehicleUpgradeOptions> {
        if (!vehicleEntityId || !vehicleConfiguration) {
            return null;
        }

        this.vehicleModificationService.applyVehicleConfiguration(vehicleEntityId, vehicleConfiguration);

        return this.vehicleModificationService.createOptions(vehicleEntityId);
    }

    @OnNuiEvent<{ vehicleEntityId: number; vehicleConfiguration: Partial<VehicleConfiguration> }>(
        NuiEvent.VehicleCustomConfirmModification
    )
    public async confirmVehicleCustom({
        vehicleEntityId,
        vehicleConfiguration,
        originalConfiguration,
        usePricing,
    }): Promise<void> {
        const options = this.vehicleModificationService.createOptions(vehicleEntityId);
        const vehicle = this.vehicleRepository.getByModelHash(GetEntityModel(vehicleEntityId));
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        if (usePricing && (!vehicle || !vehicle.price)) {
            this.notifier.notify(
                "Cette voiture n'est pas enregistré auprès des autorités et ne peut donc pas être modifiée, veuillez prendre contact avec les autorités.",
                'error'
            );

            SetVehicleUndriveable(vehicleEntityId, false);

            this.vehicleService.applyVehicleConfiguration(vehicleEntityId, originalConfiguration);
            this.nuiMenu.closeMenu();

            return;
        }

        const price = usePricing
            ? getVehicleCustomPrice(vehicle.price, options, originalConfiguration, vehicleConfiguration)
            : 0;

        const newVehicleConfiguration = await emitRpc<VehicleConfiguration>(
            RpcEvent.VEHICLE_CUSTOM_SET_MODS,
            vehicleNetworkId,
            vehicleConfiguration,
            originalConfiguration,
            price
        );

        SetVehicleUndriveable(vehicleEntityId, false);

        this.vehicleService.applyVehicleConfiguration(vehicleEntityId, newVehicleConfiguration);
        this.nuiMenu.closeMenu();
    }

    public async upgradeVehicle(vehicleEntityId: number) {
        const options = this.vehicleModificationService.createOptions(vehicleEntityId);
        const vehicle = this.vehicleRepository.getByModelHash(GetEntityModel(vehicleEntityId));

        if (!vehicle || !vehicle.price) {
            this.notifier.notify(
                "Cette voiture n'est pas enregistré auprès des autorités et ne peut donc pas être modifiée, veuillez prendre contact avec les autorités.",
                'error'
            );

            return;
        }

        const vehicleConfiguration = await this.vehicleService.getVehicleConfiguration(vehicleEntityId);

        SetVehicleUndriveable(vehicleEntityId, true);

        this.nuiMenu.openMenu(MenuType.VehicleCustom, {
            vehicle: vehicleEntityId,
            vehiclePrice: vehicle.price,
            options,
            originalConfiguration: { ...vehicleConfiguration },
            currentConfiguration: vehicleConfiguration,
        });
    }
}

import { LS_CUSTOM_ZONE } from '@public/config/ls_custom';

import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { ClientEvent, NuiEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import {
    getVehicleConfigurationDiff,
    getVehicleCustomPrice,
    VehicleConfiguration,
    VehicleCustomMenuData,
    VehicleUpgradeOptions,
} from '../../shared/vehicle/modification';
import { VehicleSeat } from '../../shared/vehicle/vehicle';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { VehicleRepository } from '../repository/vehicle.repository';
import { VehicleModificationService } from './vehicle.modification.service';
import { VehicleService } from './vehicle.service';
import { VehicleStateService } from './vehicle.state.service';

@Provider()
export class VehicleCustomProvider {
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

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    public isPedInsideCustomZone(): boolean {
        const position = GetEntityCoords(PlayerPedId(), true) as Vector3;

        return LS_CUSTOM_ZONE.isPointInside(position);
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
                if (menuType === MenuType.VehicleCustom) {
                    this.vehicleService.applyVehicleConfigurationPerformance(
                        menuData.vehicle,
                        menuData.originalConfiguration
                    );
                } else {
                    this.vehicleService.applyVehicleConfiguration(menuData.vehicle, menuData.originalConfiguration);
                }
            }
        }
    }

    @OnNuiEvent<{
        vehicleEntityId: number;
        vehicleConfiguration: VehicleConfiguration;
        originalConfiguration: VehicleConfiguration;
    }>(NuiEvent.VehicleCustomApply)
    public async applyVehicleConfiguration({
        vehicleEntityId,
        vehicleConfiguration,
        originalConfiguration,
        onlyPerformance,
    }): Promise<VehicleUpgradeOptions> {
        if (!vehicleEntityId || !vehicleConfiguration) {
            return null;
        }

        const diff = getVehicleConfigurationDiff(originalConfiguration, vehicleConfiguration);

        if (onlyPerformance) {
            this.vehicleService.applyVehicleConfigurationPerformance(vehicleEntityId, diff);
        } else {
            this.vehicleService.applyVehicleConfiguration(vehicleEntityId, diff);
        }

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
        onlyPerformance,
    }): Promise<void> {
        const options = this.vehicleModificationService.createOptions(vehicleEntityId);
        const vehicle = this.vehicleRepository.getByModelHash(GetEntityModel(vehicleEntityId));
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicleEntityId);

        if (usePricing && (!vehicle || !vehicle.price)) {
            this.notifier.notify(
                "Ce véhicule n'est pas enregistré auprès des autorités et ne peut donc pas être modifié, veuillez prendre contact avec les autorités.",
                'error'
            );

            SetVehicleUndriveable(vehicleEntityId, false);
            SetVehicleLights(vehicleEntityId, 0);

            if (onlyPerformance) {
                this.vehicleService.applyVehicleConfigurationPerformance(vehicleEntityId, originalConfiguration);
            } else {
                this.vehicleService.applyVehicleConfiguration(vehicleEntityId, originalConfiguration);
            }

            this.nuiMenu.closeMenu();

            return;
        }

        const price = usePricing
            ? getVehicleCustomPrice(vehicle.price, options, originalConfiguration, vehicleConfiguration)
            : 0;

        const newVehicleConfiguration = await emitRpc<VehicleConfiguration>(
            RpcServerEvent.VEHICLE_CUSTOM_SET_MODS,
            vehicleNetworkId,
            vehicleConfiguration,
            originalConfiguration,
            price
        );

        SetVehicleUndriveable(vehicleEntityId, false);
        SetVehicleLights(vehicleEntityId, 0);

        if (onlyPerformance) {
            this.vehicleService.applyVehicleConfigurationPerformance(vehicleEntityId, newVehicleConfiguration);
        } else {
            this.vehicleService.applyVehicleConfiguration(vehicleEntityId, newVehicleConfiguration);
        }

        this.nuiMenu.closeMenu();
    }

    public async upgradeVehicle(vehicleEntityId: number, admin: boolean) {
        const options = this.vehicleModificationService.createOptions(vehicleEntityId);
        const vehicle = this.vehicleRepository.getByModelHash(GetEntityModel(vehicleEntityId));

        if (!vehicle || !vehicle.price) {
            this.notifier.notify(
                "Ce véhicule n'est pas enregistré auprès des autorités et ne peut donc pas être modifié, veuillez prendre contact avec les autorités.",
                'error'
            );

            return;
        }

        const vehicleCondition = await this.vehicleStateService.getVehicleCondition(vehicleEntityId);

        if (this.vehicleService.isInBadCondition(vehicleEntityId, vehicleCondition)) {
            this.notifier.notify(
                'Ce véhicule est trop endommagé pour être modifié, veuillez le réparer avant de le modifier.',
                'error'
            );

            return;
        }

        if (vehicleCondition.dirtLevel > 5.0) {
            this.notifier.notify(
                'Ce véhicule est trop sale pour être modifié, veuillez le laver avant de le modifier.',
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
            admin: admin,
        });
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    @OnEvent(ClientEvent.BASE_CHANGE_VEHICLE_SEAT)
    public async onVehicleEnterSyncModification(vehicleEntityId: number, seat: number) {
        if (seat !== VehicleSeat.Driver) {
            return;
        }

        let i = 0;

        while (!NetworkHasControlOfEntity(vehicleEntityId) && i < 20) {
            await wait(500);
            i++;
        }

        if (!NetworkHasControlOfEntity(vehicleEntityId)) {
            return;
        }

        const configuration = await this.vehicleService.getVehicleConfiguration(vehicleEntityId);
        this.vehicleService.applyVehicleConfigurationPerformance(vehicleEntityId, configuration);

        if (GetVehicleHasKers(vehicleEntityId)) {
            SetVehicleKersAllowed(vehicleEntityId, false);
        }
    }
}

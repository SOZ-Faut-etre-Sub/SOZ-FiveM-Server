import { LS_CUSTOM_ZONE } from '@public/config/ls_custom';
import { Feature } from '@public/shared/features';

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
    getVehicleCrimiCustomPrice,
    getVehicleCustomPrice,
    VehicleConfiguration,
    VehicleCustomInput,
    VehicleCustomMenuData,
    VehicleUpgradeOptions,
} from '../../shared/vehicle/modification';
import { isVehicleModelElectric, LSCustomMode, VehicleClass, VehicleSeat } from '../../shared/vehicle/vehicle';
import { FeatureProvider } from '../feature/feature.provider';
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

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

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

    @OnNuiEvent(NuiEvent.VehicleCustomConfirmModification)
    public async confirmVehicleCustom(input: VehicleCustomInput): Promise<void> {
        const options = this.vehicleModificationService.createOptions(input.vehicleEntityId);
        const vehicle = this.vehicleRepository.getByModelHash(GetEntityModel(input.vehicleEntityId));
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(input.vehicleEntityId);
        const whatIf = this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode);

        if (input.mode != LSCustomMode.Admin && (!vehicle || !vehicle.price)) {
            this.notifier.notify(
                "Ce véhicule n'est pas enregistré auprès des autorités et ne peut donc pas être modifié, veuillez prendre contact avec les autorités.",
                'error'
            );

            SetVehicleUndriveable(input.vehicleEntityId, false);
            SetVehicleLights(input.vehicleEntityId, 0);

            if (input.onlyPerformance) {
                this.vehicleService.applyVehicleConfigurationPerformance(
                    input.vehicleEntityId,
                    input.originalConfiguration
                );
            } else {
                this.vehicleService.applyVehicleConfiguration(input.vehicleEntityId, input.originalConfiguration);
            }

            this.nuiMenu.closeMenu();

            return;
        }

        const price =
            input.mode != LSCustomMode.Admin
                ? getVehicleCustomPrice(vehicle.price, options, input.originalConfiguration, input.vehicleConfiguration)
                : 0;
        const crimiPrice =
            input.mode == LSCustomMode.CrimiPerfo
                ? getVehicleCrimiCustomPrice(
                      vehicle.price,
                      options,
                      input.originalConfiguration,
                      input.vehicleConfiguration,
                      whatIf
                  )
                : null;

        const newVehicleConfiguration = await emitRpc<VehicleConfiguration>(
            RpcServerEvent.VEHICLE_CUSTOM_SET_MODS,
            vehicleNetworkId,
            input.vehicleConfiguration,
            input.originalConfiguration,
            price,
            true,
            input.mode,
            crimiPrice
        );

        SetVehicleUndriveable(input.vehicleEntityId, false);
        SetVehicleLights(input.vehicleEntityId, 0);

        if (input.onlyPerformance) {
            this.vehicleService.applyVehicleConfigurationPerformance(input.vehicleEntityId, newVehicleConfiguration);
        } else {
            this.vehicleService.applyVehicleConfiguration(input.vehicleEntityId, newVehicleConfiguration);
        }

        this.nuiMenu.closeMenu(true);
    }

    public async upgradeVehicle(vehicleEntityId: number, mode: LSCustomMode) {
        const options = this.vehicleModificationService.createOptions(vehicleEntityId);
        const vehicle = this.vehicleRepository.getByModelHash(GetEntityModel(vehicleEntityId));

        if (!vehicle || !vehicle.price) {
            this.notifier.notify(
                "Ce véhicule n'est pas enregistré auprès des autorités et ne peut donc pas être modifié, veuillez prendre contact avec les autorités.",
                'error'
            );

            return;
        }

        if (mode === LSCustomMode.LsCustom) {
            const volatile = await this.vehicleStateService.getVehicleState(vehicleEntityId);
            if (volatile.isCrimiImport) {
                this.notifier.notify("Ce véhicule ne vient pas d'un ~r~concessionnaire agréé~s~.", 'error');
                return;
            }
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

        const advancedFlag = isVehicleModelElectric(GetEntityModel(vehicleEntityId))
            ? 0
            : GetVehicleHandlingInt(vehicleEntityId, 'CCarHandlingData', 'strAdvancedFlags');

        const vehicleConfiguration = await this.vehicleService.getVehicleConfiguration(vehicleEntityId);

        SetVehicleUndriveable(vehicleEntityId, true);

        this.nuiMenu.openMenu(MenuType.VehicleCustom, {
            vehicle: vehicleEntityId,
            vehiclePrice: vehicle.price,
            options,
            originalConfiguration: { ...vehicleConfiguration },
            currentConfiguration: vehicleConfiguration,
            mode: mode,
            advenced: advancedFlag > 0,
        });
    }

    @OnEvent(ClientEvent.BASE_ENTERED_VEHICLE)
    @OnEvent(ClientEvent.BASE_CHANGE_VEHICLE_SEAT)
    public async onVehicleEnterSyncModification(vehicleEntityId: number, seat: number) {
        if (seat !== VehicleSeat.Driver) {
            return;
        }

        if (!NetworkGetEntityIsNetworked(vehicleEntityId)) {
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

        SetVehicleKersAllowed(vehicleEntityId, GetVehicleClass(vehicleEntityId) === VehicleClass.Cycles);
    }
}

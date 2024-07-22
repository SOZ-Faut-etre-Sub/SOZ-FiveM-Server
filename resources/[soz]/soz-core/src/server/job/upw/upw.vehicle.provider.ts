import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';
import { isVehicleModelElectric } from '@public/shared/vehicle/vehicle';

import { Logger } from '../../../core/logger';
import { VehicleStateService } from '../../vehicle/vehicle.state.service';

@Provider()
export class UpwVehicleProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(Logger)
    private logger: Logger;

    @OnEvent(ServerEvent.UPW_CHANGE_BATTERY)
    public async onChangeBattery(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!vehicleEntity) {
            this.logger.error(`[UPW] Vehicle entity not found for network id ${vehicleNetworkId}`);

            return;
        }

        if (!isVehicleModelElectric(GetEntityModel(vehicleEntity))) {
            this.notifier.notify(source, "Ce véhicule n'a pas de batterie Lithium-ion", 'error');
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'battery_change',
            'Changement de la batterie...',
            10000,
            {
                name: 'car_bomb_mechanic',
                dictionary: 'mp_car_bomb',
                options: {
                    onlyUpperBody: true,
                    repeat: true,
                },
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableCombat: true,
                disableMouse: false,
            }
        );

        if (!completed) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (
            !inventory.canSwapItems(
                [{ name: 'lithium_battery', amount: 1 }],
                [{ name: 'empty_lithium_battery', amount: 1 }]
            )
        ) {
            this.notifier.notify(source, 'Impossible de ~r~changer~s~ la batterie.', 'error');

            return;
        }

        if (!inventory.remove('lithium_battery', 1, false)) {
            this.notifier.notify(source, "~r~Vous n'avez pas de batterie Lithium-ion.~s~", 'error');

            return;
        }

        inventory.add('empty_lithium_battery', 1);

        this.vehicleStateService.updateVehicleCondition(vehicleNetworkId, {
            oilLevel: 100.0,
        });

        this.notifier.notify(source, 'Vous avez ~g~changé~s~ la batterie du véhicule.', 'success');
    }
}

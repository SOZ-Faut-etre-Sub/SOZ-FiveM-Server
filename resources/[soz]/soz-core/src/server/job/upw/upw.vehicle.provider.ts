import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { isVehicleModelElectric } from '@public/shared/vehicle/vehicle';

@Provider()
export class UpwVehicleProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ServerEvent.UPW_CHANGE_BATTERY)
    public async onChangeBattery(source: number, vehicleNetworkId: number) {
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetworkId);

        if (!vehicleEntity) {
            console.error(`[UPW] Vehicle entity not found for network id ${vehicleNetworkId}`);

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

        if (!this.inventoryManager.addItemToInventory(source, 'empty_lithium_battery', 1).success) {
            this.notifier.notify(source, 'Vous êtes ~r~trop chargé~s~ pour récupérer la batterie vide.', 'error');
            return;
        }

        if (!this.inventoryManager.removeItemFromInventory(source, 'lithium_battery', 1)) {
            this.notifier.notify(source, "~r~Vous n'avez pas de batterie Lithium-ion.~s~", 'error');
            return;
        }

        const owner = NetworkGetEntityOwner(vehicleEntity);

        TriggerClientEvent(ClientEvent.VEHICLE_SYNC_CONDITION, owner, vehicleNetworkId, {
            oilLevel: 100,
        });

        this.notifier.notify(source, 'Vous avez ~g~changé~s~ la batterie du véhicule.', 'success');
    }
}

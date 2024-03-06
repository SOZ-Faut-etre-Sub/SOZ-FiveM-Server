import { VehicleBusinessCustomPrice } from '@private/shared/business.vehicle';
import { LSCustomMode } from '@public/shared/vehicle/vehicle';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { TaxType } from '../../shared/bank';
import { RpcServerEvent } from '../../shared/rpc';
import {
    getDefaultVehicleConfiguration,
    VehicleConfiguration,
    VehicleModificationPricing,
} from '../../shared/vehicle/modification';
import { PriceService } from '../bank/price.service';
import { PrismaService } from '../database/prisma.service';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { VehicleStateService } from './vehicle.state.service';

const LsCustomUpgrades = ['engine', 'brakes', 'transmission', 'suspension', 'armor', 'turbo'];

@Provider()
export class VehicleCustomProvider {
    @Inject(VehicleStateService)
    private vehicleStateService: VehicleStateService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PriceService)
    private priceService: PriceService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Rpc(RpcServerEvent.VEHICLE_CUSTOM_SET_MODS)
    public async setMods(
        source: number,
        vehicleNetworkId: number,
        mods: VehicleConfiguration,
        originalConfiguration: VehicleConfiguration,
        price: number | null = null,
        notify = true,
        mode = LSCustomMode.Normal
    ) {
        // @TODO Price client side
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        const taxedPrice = await this.priceService.getPrice(price ?? 0, TaxType.VEHICLE);

        const playerVehicle = state.volatile.id
            ? await this.prismaService.playerVehicle.findUnique({
                  where: {
                      id: state.volatile.id,
                  },
              })
            : null;

        if (mode == LSCustomMode.Normal && taxedPrice && this.playerMoneyService.get(source) < taxedPrice) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');

            return originalConfiguration;
        }
        if (
            mode == LSCustomMode.Crimi &&
            price &&
            this.inventoryManager.getItemCount(source, 'veh_strip_piece') <
                Math.ceil(price / VehicleBusinessCustomPrice)
        ) {
            const item = this.itemService.getItem('veh_strip_piece');
            this.notifier.notify(source, `Vous n'avez pas assez de ${item.label}`, 'error');

            return originalConfiguration;
        }
        if (taxedPrice && mode == LSCustomMode.Normal) {
            // LS Custom upgrade parts
            const upgradedParts = this.getLSCustomUpgradedPart(originalConfiguration, mods);

            if (
                upgradedParts > 0 &&
                !this.inventoryManager.removeItemFromInventory(
                    'ls_custom_storage',
                    'ls_custom_upgrade_part',
                    upgradedParts
                )
            ) {
                this.notifier.notify(
                    source,
                    `Le stock du LS Custom n'est pas suffisant. Impossible d'améliorer votre véhicule !`,
                    'error'
                );

                return originalConfiguration;
            }

            this.playerMoneyService.remove(source, price);
        } else if (price && mode == LSCustomMode.Crimi) {
            this.inventoryManager.removeItemFromInventory(
                source,
                'veh_strip_piece',
                Math.ceil(price / VehicleBusinessCustomPrice)
            );
        }

        if (playerVehicle) {
            await this.prismaService.playerVehicle.update({
                where: {
                    id: playerVehicle.id,
                },
                data: {
                    mods: JSON.stringify(mods),
                },
            });
        }

        if (taxedPrice && mode == LSCustomMode.Normal) {
            this.notifier.notify(source, `Vous avez payé $${taxedPrice.toFixed(0)} pour modifier votre véhicule.`);
        } else if (notify) {
            this.notifier.notify(source, 'Le véhicule a été modifié');
        }

        this.vehicleStateService.updateVehicleConfiguration(vehicleNetworkId, mods);

        return mods;
    }

    public getLSCustomUpgradedPart(originalConfig: VehicleConfiguration, newConfig: VehicleConfiguration): number {
        let totalParts = 0;
        for (const part of LsCustomUpgrades) {
            if (VehicleModificationPricing[part].type === 'list') {
                const oldPart = originalConfig.modification[part] == null ? -1 : originalConfig.modification[part];
                const newPart = newConfig.modification[part] == null ? -1 : newConfig.modification[part];
                totalParts += Math.max(newPart - oldPart, 0);
            }
            if (VehicleModificationPricing[part].type === 'toggle') {
                const oldPart = originalConfig.modification[part] || false;
                const newPart = newConfig.modification[part] || false;
                if (newPart && !oldPart) {
                    totalParts++;
                }
            }
        }
        return totalParts;
    }

    @Rpc(RpcServerEvent.VEHICLE_CUSTOM_GET_MODS)
    public async getMods(source: number, vehicleNetworkId: number): Promise<VehicleConfiguration> {
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);

        if (!state.volatile.id) {
            return null;
        }

        const playerVehicle = await this.prismaService.playerVehicle.findUnique({
            where: {
                id: state.volatile.id,
            },
        });

        if (!playerVehicle) {
            return null;
        }

        return {
            ...getDefaultVehicleConfiguration(),
            ...JSON.parse(playerVehicle.mods || '{}'),
        };
    }
}

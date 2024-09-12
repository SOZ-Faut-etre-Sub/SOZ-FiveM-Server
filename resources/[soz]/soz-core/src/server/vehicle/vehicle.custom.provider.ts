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
import { Monitor } from '../monitor/monitor';
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

    @Inject(Monitor)
    private monitor: Monitor;

    @Rpc(RpcServerEvent.VEHICLE_CUSTOM_SET_MODS)
    public async setMods(
        source: number,
        vehicleNetworkId: number,
        mods: VehicleConfiguration,
        originalConfiguration: VehicleConfiguration,
        price: number | null = null,
        notify = true,
        mode = LSCustomMode.LsCustom,
        crimiPrice: Record<string, number>
    ) {
        // @TODO Price client side
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);
        const taxedPrice = await this.priceService.getPrice(price ?? 0, TaxType.VEHICLE);

        const playerVehicle = state.volatile.isPlayerVehicle;

        if (mode == LSCustomMode.LsCustom && taxedPrice && this.playerMoneyService.get(source) < taxedPrice) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');

            return originalConfiguration;
        }
        if (
            mode == LSCustomMode.CrimiCusto &&
            price &&
            !this.inventoryManager.hasEnoughItem(
                source,
                'veh_strip_piece_std',
                Math.ceil(price / VehicleBusinessCustomPrice),
                true
            )
        ) {
            const item = this.itemService.getItem('veh_strip_piece_std');
            this.notifier.notify(source, `Vous n'avez pas assez de  ~r~${item.label}.`, 'error');

            return originalConfiguration;
        }

        if (mode == LSCustomMode.CrimiPerfo && crimiPrice) {
            let message = '';
            for (const itemName of Object.keys(crimiPrice)) {
                if (!this.inventoryManager.hasEnoughItem(source, itemName, crimiPrice[itemName], true)) {
                    const item = this.itemService.getItem(itemName);
                    message += `~b~${crimiPrice[itemName]}~s~ ~r~${item.label}~s~~n~`;
                }
            }

            if (message.length > 0) {
                this.notifier.notify(
                    source,
                    'Vous ne possédez pas les:~n~' +
                        message +
                        ' sur vous pour effectuer cette modification de performance.',
                    'error'
                );
                return originalConfiguration;
            }
        }
        if (price && mode == LSCustomMode.LsCustom) {
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

            if (!(await this.playerMoneyService.buy(source, price, TaxType.VEHICLE))) {
                this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
                return originalConfiguration;
            }
        } else if (price && mode == LSCustomMode.CrimiCusto) {
            this.inventoryManager.removeNotExpiredItem(
                source,
                'veh_strip_piece_std',
                Math.ceil(price / VehicleBusinessCustomPrice)
            );
        } else if (crimiPrice && mode == LSCustomMode.CrimiPerfo) {
            for (const itemName of Object.keys(crimiPrice)) {
                this.inventoryManager.removeNotExpiredItem(source, itemName, crimiPrice[itemName]);
            }
        }

        if (playerVehicle) {
            await this.prismaService.playerVehicle.update({
                where: {
                    id: state.volatile.id,
                },
                data: {
                    mods: JSON.stringify(mods),
                },
            });
        }

        if (taxedPrice && mode == LSCustomMode.LsCustom) {
            this.notifier.notify(source, `Vous avez payé $${taxedPrice.toFixed(0)} pour modifier votre véhicule.`);
        } else if (notify) {
            this.notifier.notify(source, 'Le véhicule a été modifié');
        }

        this.vehicleStateService.updateVehicleConfiguration(vehicleNetworkId, mods);

        this.monitor.traceEvent('vehicle_update_config', {
            player_source: source,
            vehicle_plate: state.volatile.plate,
            type: mode,
            money: price,
            message: JSON.stringify(mods),
        });

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
        if (originalConfig.manualGearbox != newConfig.manualGearbox) {
            totalParts++;
        }

        return totalParts;
    }

    @Rpc(RpcServerEvent.VEHICLE_CUSTOM_GET_MODS)
    public async getMods(source: number, vehicleNetworkId: number): Promise<VehicleConfiguration> {
        const state = this.vehicleStateService.getVehicleState(vehicleNetworkId);

        return {
            ...getDefaultVehicleConfiguration(),
            ...state.configuration,
        };
    }
}

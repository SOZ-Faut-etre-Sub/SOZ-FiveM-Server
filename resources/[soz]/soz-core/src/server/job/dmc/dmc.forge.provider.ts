import { Once, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { InventoryOpenProvider } from '@public/server/inventory/inventory.open.provider';
import { Notifier } from '@public/server/notifier';
import { StateGlobalProvider } from '@public/server/store/state.global.provider';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { DmcConverterConfig, DmcConverterState, DmcIncineratorConfig } from '@public/shared/job/dmc';
import { RpcServerEvent } from '@public/shared/rpc';

import { InventoryType } from '../../../shared/inventory';

@Provider()
export class DmcForgeProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(StateGlobalProvider)
    private stateGlobalProvider: StateGlobalProvider;

    @Inject(InventoryOpenProvider)
    private inventoryOpenProvider: InventoryOpenProvider;

    private converterState: DmcConverterState = {
        enabled: false,
        temperature: 0,
        targetTemperature: 0,
    };

    @Once()
    public async onModuleInit() {
        this.inventoryFactory.addAccessChecker(
            (_id, type) => type === InventoryType.MetalConverter,
            source => {
                if (this.converterState.temperature === this.converterState.targetTemperature) {
                    return true;
                }

                this.notifier.error(source, `Impossible d'accéder au Convertisseur lorsque sa température s'ajuste.`);

                return false;
            }
        );
    }

    @Rpc(RpcServerEvent.DMC_GET_CONVERTER_STATE)
    public getConverterState() {
        return this.converterState;
    }

    @OnEvent(ServerEvent.DMC_TOGGLE_CONVERTER)
    public toggleConverter(source: number, value: boolean) {
        this.converterState.enabled = value;
        if (!value) {
            this.converterState.temperature = 0;
            this.converterState.targetTemperature = 0;
        }
        this.notifier.notify(source, `Vous avez ${value ? '~g~allumé' : '~r~éteint'}~s~ le Convertisseur.`, 'info');
    }

    @OnEvent(ServerEvent.DMC_SET_CONVERTER_TARGET_TEMPERATURE)
    public setConverterTargetTemperature(source: number, temperature: number) {
        this.converterState.targetTemperature = temperature;
        const readyTotal = Math.ceil(Math.abs(this.converterState.temperature - temperature) / 10);
        const readyMinutes = Math.floor(readyTotal / 60);
        const readySeconds = readyTotal % 60;
        this.notifier.notify(
            source,
            `La température du Convertisseur a été ajusté à ~g~${temperature}°C~s~ ! Il sera prêt dans ~r~${readyMinutes}m${readySeconds}s~s~.`,
            'info'
        );

        if (temperature != this.converterState.temperature) {
            this.inventoryOpenProvider.closeInventory(DmcConverterConfig.converterStorage);
        }
    }

    @Tick(TickInterval.EVERY_SECOND)
    public handleConverterTemperature() {
        if (!this.converterState.enabled) {
            return;
        }

        const globalState = this.stateGlobalProvider.getGlobalState();
        if (globalState.blackoutLevel > 3 || globalState.blackout || globalState.jobEnergy.dmc < 1) {
            this.converterState.temperature = 0;
            this.converterState.targetTemperature = 0;
            this.converterState.enabled = false;
            return;
        }

        const differenceTemperature = this.converterState.targetTemperature - this.converterState.temperature;
        const modifyTemperature = Math.max(Math.min(differenceTemperature, 10), -10);
        this.converterState.temperature += modifyTemperature;
    }

    @Tick(DmcConverterConfig.converterDelay)
    public async handleConverterItems() {
        if (!this.converterState.enabled) {
            return;
        }

        const inventory = await this.inventoryFactory.get(DmcConverterConfig.converterStorage);

        if (!inventory) {
            return;
        }

        exports['soz-upw'].ConsumeJobTerminal(JobType.DMC, DmcConverterConfig.energyPerTick);

        for (const output_item of Object.keys(DmcConverterConfig.recipes)) {
            const recipe = DmcConverterConfig.recipes[output_item];
            if (this.converterState.temperature != recipe.temperature) {
                continue;
            }
            let canCraft = true;
            for (const input_item of Object.keys(recipe.input)) {
                const amount = recipe.input[input_item];
                const itemCount = inventory.getItemCount(input_item);
                if (itemCount < amount) {
                    canCraft = false;
                    break;
                }
            }
            // Not enough items to craft this recipe, try next one
            if (!canCraft) {
                continue;
            }

            // Do craft
            // Remove input items
            for (const input_item of Object.keys(recipe.input)) {
                const amount = recipe.input[input_item];
                inventory.remove(input_item, amount);
            }

            // Add output items
            inventory.add(output_item, recipe.outputAmount);

            // Only 1 recipe by cycle, so we break here
            return;
        }
    }

    @Tick(DmcIncineratorConfig.incineratorDelay)
    public async handleIncineratorItems() {
        const globalState = this.stateGlobalProvider.getGlobalState();
        if (globalState.blackoutLevel > 3 || globalState.blackout || globalState.jobEnergy.dmc < 1) {
            return;
        }
        const inventory = await this.inventoryFactory.get(DmcIncineratorConfig.incineratorStorage);
        const itemsToProcess = [];
        let remainingItemsToProcess = DmcIncineratorConfig.incineratorProcessingAmount;

        for (const item of Object.values(inventory.items())) {
            if (remainingItemsToProcess == 0) {
                break;
            }
            const amountToProcess = Math.min(item.amount, remainingItemsToProcess);
            itemsToProcess.push({
                ...item,
                amount: amountToProcess,
            });
            remainingItemsToProcess -= amountToProcess;
        }

        for (const item of itemsToProcess) {
            inventory.removeAtSlot(item.item.slot, item.amount);
        }
    }

    public canAccessConverter() {
        return this.converterState.temperature == this.converterState.targetTemperature;
    }
}

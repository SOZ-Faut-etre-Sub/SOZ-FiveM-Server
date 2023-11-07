import { OnEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { Tick, TickInterval } from '@public/core/decorators/tick';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { Notifier } from '@public/server/notifier';
import { StateGlobalProvider } from '@public/server/store/state.global.provider';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { DmcConverterConfig, DmcConverterState, DmcIncineratorConfig } from '@public/shared/job/dmc';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class DmcForgeProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(StateGlobalProvider)
    private stateGlobalProvider: StateGlobalProvider;

    private converterState: DmcConverterState = {
        enabled: false,
        temperature: 0,
        targetTemperature: 0,
    };

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
            TriggerEvent('inventory:server:closeInventoryAllUsers', DmcConverterConfig.converterStorage);
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
    public handleConverterItems() {
        if (!this.converterState.enabled) {
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
                const itemCount = this.inventoryManager.getItemCount(DmcConverterConfig.converterStorage, input_item);
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
                this.inventoryManager.removeItemFromInventory(
                    DmcConverterConfig.converterStorage,
                    input_item,
                    amount,
                    null,
                    null
                );
            }
            // Add output items
            this.inventoryManager.addItemToInventoryNotPlayer(
                DmcConverterConfig.converterStorage,
                output_item,
                recipe.outputAmount,
                null
            );

            // Only 1 recipe by cycle, so we break here
            return;
        }
    }

    @Tick(DmcIncineratorConfig.incineratorDelay)
    public handleIncineratorItems() {
        const globalState = this.stateGlobalProvider.getGlobalState();
        if (globalState.blackoutLevel > 3 || globalState.blackout || globalState.jobEnergy.dmc < 1) {
            return;
        }
        const allItems = this.inventoryManager.getAllItems(DmcIncineratorConfig.incineratorStorage);
        const itemsToProcess = [];
        let remainingItemsToProcess = DmcIncineratorConfig.incineratorProcessingAmount;
        for (const item of allItems) {
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
            this.inventoryManager.removeItemFromInventory(
                DmcIncineratorConfig.incineratorStorage,
                item.item.name,
                item.amount,
                item.item.metadata,
                item.item.slot
            );
        }
    }

    @Exportable('CanAccessConverter')
    public CanAccessConverter() {
        return this.converterState.temperature == this.converterState.targetTemperature;
    }
}

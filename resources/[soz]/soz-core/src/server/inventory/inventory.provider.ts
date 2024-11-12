import { OnEvent } from '@public/core/decorators/event';
import { ClientEvent, ServerEvent } from '@public/shared/event';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { Tick } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { BankMoneyType } from '../../shared/bank';
import {
    ADD_ERROR_MESSAGE,
    INVENTORY_ITEM_CREATORS,
    InventoryItem,
    InventorySort,
    InventoryType,
    MERGE_ERROR_MESSAGE,
} from '../../shared/inventory';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { getRandomInt } from '../../shared/random';
import { isOk } from '../../shared/result';
import { RpcServerEvent } from '../../shared/rpc';
import { ItemService } from '../item/item.service';
import { LockBinService } from '../job/bluebird/lock.bin.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';
import { Inventory } from './inventory';
import { InventoryFactory } from './inventory.factory';
import { InventoryPositionChecker } from './inventory.position.checker';

/**
 * Exposition of some methods from the InventoryManager to the clients
 */
@Provider()
export class InventoryProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(LockBinService)
    private lockBinService: LockBinService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(InventoryPositionChecker)
    private inventoryPositionChecker: InventoryPositionChecker;

    @Inject(Monitor)
    private monitor: Monitor;

    @Tick()
    public async populateInventories() {
        for (const [, inventory] of this.inventoryFactory.getLoadedInventories().entries()) {
            const createConfig = INVENTORY_ITEM_CREATORS[inventory.type()];

            if (!createConfig) {
                continue;
            }

            for (const itemName of Object.keys(createConfig)) {
                const creatorConfig = createConfig[itemName];
                const shouldCreate = getRandomInt(0, 100) <= creatorConfig.chance;

                if (!shouldCreate) {
                    continue;
                }

                const amount = getRandomInt(creatorConfig.min, creatorConfig.max);

                if (amount > 0) {
                    inventory.add(itemName, amount);
                }
            }

            await inventory.observe();
        }

        await wait(getRandomInt(1, 3) * 3600 * 100);
    }

    @Rpc(RpcServerEvent.BIN_IS_NOT_LOCKED)
    public isBinLock(source: number, id: string) {
        return !this.lockBinService.isLock(id);
    }

    @Rpc(RpcServerEvent.INVENTORY_GET_ITEM_COUNT)
    public async getItemCount(source: number, storageId: string, itemId: string) {
        const inventory = await this.inventoryFactory.get(storageId);

        return inventory.getItemCount(itemId);
    }

    @OnEvent(ServerEvent.INVENTORY_REMOVE_PLAYER_ITEM)
    public async onRemoveItem(source: number, item: string, amount: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory) {
            return;
        }

        inventory.remove(item, amount);
    }

    @OnEvent(ServerEvent.INVENTORY_ITEM_SHOW)
    public async onShow(source: number, target: number, inventoryId: string, slotId: number) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        const invItem = inventory.getItemAtSlot(slotId);

        if (invItem) {
            this.itemService.executeShowCallback(source, target, invItem);
        }
    }

    @OnEvent(ServerEvent.INVENTORY_GIVE_MONEY)
    public async onGiveMoney(source: number, targetId: number, amount: number, moneyPriority: BankMoneyType) {
        const player = this.playerService.getPlayer(source);
        const target = this.playerService.getPlayer(targetId);

        if (!player || !target) {
            return;
        }

        if (amount <= 0) {
            return;
        }

        const playerPosition = GetEntityCoords(GetPlayerPed(source)) as Vector3;
        const targetPosition = GetEntityCoords(GetPlayerPed(targetId)) as Vector3;

        if (getDistance(playerPosition, targetPosition) > 2) {
            this.notifier.error(source, "Personne n'est à portée de vous");

            return;
        }

        let moneyToGive = 0;
        let markedMoneyToGive = 0;

        const moneyAmount = this.playerMoneyService.get(source, 'money');
        const markedMoneyAmount = this.playerMoneyService.get(source, 'marked_money');

        if (amount > markedMoneyAmount + moneyAmount) {
            this.notifier.error(source, "Vous n'avez pas assez d'argent");

            return;
        }

        if (moneyPriority === 'money') {
            moneyToGive = Math.min(amount, moneyAmount);
            markedMoneyToGive = amount - moneyToGive;
        } else {
            markedMoneyToGive = Math.min(amount, markedMoneyAmount);
            moneyToGive = amount - markedMoneyToGive;
        }

        this.playerMoneyService.remove(source, moneyToGive, 'money');
        this.playerMoneyService.remove(source, markedMoneyToGive, 'marked_money');

        this.playerMoneyService.add(targetId, moneyToGive, 'money');
        this.playerMoneyService.add(targetId, markedMoneyToGive, 'marked_money');

        this.notifier.notify(source, `Vous avez donné ~r~${amount}$`);
        this.notifier.notify(targetId, `Vous avez reçu ~g~${amount}$`);

        this.monitor.traceEvent('give_money', {
            player_source: source,
            target_source: targetId,
            money: amount,
            money_type: moneyPriority,
        });

        TriggerClientEvent(ClientEvent.ANIMATION_GIVE, source);
        TriggerClientEvent(ClientEvent.ANIMATION_GIVE, targetId);
    }

    @OnEvent(ServerEvent.INVENTORY_DROP_ITEM)
    public async onDropItem(source: number, inventoryId: string, inventoryItemSlot: number) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        if (!inventory) {
            return;
        }

        if (!this.inventoryPositionChecker.checkPlayerDistance(source, inventoryId)) {
            this.notifier.error(source, "Vous n'êtes pas à portée de l'inventaire.");

            return;
        }

        const inventoryItem = inventory.getItemAtSlot(inventoryItemSlot);

        if (!inventoryItem) {
            this.notifier.error(source, "Vous n'avez rien jeter.");

            return;
        }

        if (!inventory.removeAtSlot(inventoryItem.slot, inventoryItem.amount)) {
            this.notifier.error(source, "Vous n'avez rien jeter.");

            return;
        }

        const item = this.itemService.getItem(inventoryItem.name);

        this.notifier.notify(
            source,
            `Vous avez jeté ~o~${inventoryItem.amount} ~b~${item?.label || inventoryItem.name}`
        );

        TriggerClientEvent(ClientEvent.ANIMATION_GIVE, source);
    }

    @OnEvent(ServerEvent.INVENTORY_MOVE_ITEM)
    public async onMoveItem(
        source: number,
        sourceInventoryId: string,
        sourceSlot: number,
        targetInventoryId: string,
        targetSlot: number | null,
        amount: number | null
    ) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const playerInventoryId = `player_${player.citizenid}`;
        const sourceInventory = await this.inventoryFactory.get(sourceInventoryId);
        const targetInventory = await this.inventoryFactory.get(targetInventoryId);

        if (!sourceInventory || !targetInventory) {
            return;
        }

        const sourceItem = sourceInventory.getItemAtSlot(sourceSlot);

        if (!sourceItem) {
            return;
        }

        if (
            !this.inventoryPositionChecker.checkPlayerDistance(source, sourceInventoryId) ||
            !this.inventoryPositionChecker.checkPlayerDistance(source, targetInventoryId)
        ) {
            this.notifier.error(source, "Vous n'êtes pas à portée de l'inventaire.");

            return;
        }

        if (!amount) {
            amount = sourceItem.amount;
        }

        // 1. Case : no target item, simply move item if possible
        if (!targetSlot) {
            await this.moveItem(source, sourceInventory, targetInventory, sourceItem, amount, targetSlot);

            return;
        }

        // 2. case : try to merge items
        const mergeResult = targetInventory.merge(
            targetSlot,
            sourceItem,
            amount,
            sourceInventory.id === targetInventory.id
        );

        if (isOk(mergeResult)) {
            sourceInventory.removeAtSlot(sourceSlot, mergeResult.ok);
            await sourceInventory.observe();
            await targetInventory.observe();

            if (sourceInventory.id !== targetInventory.id) {
                this.notifyMoveItem(source, sourceInventory, targetInventory, sourceItem, mergeResult.ok);

                this.monitor.traceEvent('merge_item', {
                    player_source: source,
                    item_id: sourceItem.name,
                    amount,
                    inventory_source_id: sourceInventory.id,
                    inventory_target_id: targetInventory.id,
                });
            }

            return;
        }

        const error = mergeResult.err;

        if (error === 'no_item_to_merge') {
            await this.moveItem(source, sourceInventory, targetInventory, sourceItem, amount, targetSlot);

            return;
        }

        // 4. Case we swap items
        if (error === 'cannot_merge') {
            const targetItem = targetInventory.getItemAtSlot(targetSlot);

            if (!targetItem) {
                return;
            }

            if (targetInventory.id !== sourceInventory.id) {
                if (
                    !sourceInventory.canSwapItems(
                        [
                            {
                                name: sourceItem.name,
                                amount,
                                metadata: sourceItem.metadata,
                            },
                        ],
                        [
                            {
                                name: targetItem.name,
                                amount: targetItem.amount,
                                metadata: targetItem.metadata,
                            },
                        ]
                    )
                ) {
                    this.notifier.error(source, 'Impossible de porter cet objet');

                    return;
                }

                if (
                    !targetInventory.canSwapItems(
                        [
                            {
                                name: targetItem.name,
                                amount: targetItem.amount,
                                metadata: targetItem.metadata,
                            },
                        ],
                        [
                            {
                                name: sourceItem.name,
                                amount,
                                metadata: sourceItem.metadata,
                            },
                        ]
                    )
                ) {
                    this.notifier.error(source, 'Pas assez de place pour échanger les objets.');

                    return;
                }

                // Check onlyone
                const sourceItemDef = this.itemService.getItem(sourceItem.name);
                const targetItemDef = this.itemService.getItem(targetItem.name);

                if (
                    sourceItemDef?.onlyone &&
                    targetInventory.hasEnoughItem(sourceItem.name, 1, false) &&
                    targetItem.name !== sourceItem.name
                ) {
                    this.notifier.error(
                        source,
                        "Impossible d'ajouter l'objet, ~r~un seul exemplaire~s~ par inventaire."
                    );

                    return;
                }

                if (
                    targetItemDef?.onlyone &&
                    sourceInventory.hasEnoughItem(targetItem.name, 1, false) &&
                    targetItem.name !== sourceItem.name
                ) {
                    this.notifier.error(
                        source,
                        "Impossible d'ajouter l'objet, ~r~un seul exemplaire~s~ par inventaire."
                    );

                    return;
                }
            }

            sourceInventory.removeAtSlot(sourceItem.slot, amount);
            targetInventory.removeAtSlot(targetItem.slot, targetItem.amount);

            targetInventory.add(sourceItem.name, amount, sourceItem.metadata, targetSlot, true);
            sourceInventory.add(targetItem.name, targetItem.amount, targetItem.metadata, sourceSlot, true);

            await sourceInventory.observe(); // Force refresh of the inventory
            await targetInventory.observe(); // Force refresh of the inventory

            const sourceItemDef = this.itemService.getItem(sourceItem.name);
            const targetItemDef = this.itemService.getItem(targetItem.name);

            if (targetInventory.id !== sourceInventory.id) {
                let targetPlayerId = null;

                if (playerInventoryId === sourceInventory.id && targetInventory.getPlayerCitizenId()) {
                    targetPlayerId = targetInventory.getPlayerCitizenId();
                } else if (playerInventoryId === targetInventory.id && sourceInventory.getPlayerCitizenId()) {
                    targetPlayerId = sourceInventory.getPlayerCitizenId();
                }

                if (targetPlayerId) {
                    const targetPlayer = this.playerService.getPlayerByCitizenId(targetPlayerId);

                    if (targetPlayer) {
                        this.notifier.notify(
                            targetPlayer.source,
                            `On vous a échangé ~o~${targetItem.amount} ~b~${targetItemDef?.label || targetItem.name}~s~ contre ~o~${amount} ~b~${sourceItemDef?.label || sourceItem.name}`
                        );
                    }
                }

                this.monitor.traceEvent('move_item', {
                    player_source: source,
                    item_id: sourceItem.name,
                    amount,
                    inventory_source_id: sourceInventory.id,
                    inventory_target_id: targetInventory.id,
                });

                this.monitor.traceEvent('move_item', {
                    player_source: source,
                    item_id: targetItem.name,
                    amount: targetItem.amount,
                    inventory_source_id: targetInventory.id,
                    inventory_target_id: sourceInventory.id,
                });
            }

            return;
        }

        this.notifier.error(source, MERGE_ERROR_MESSAGE[error]);
    }

    @OnEvent(ServerEvent.INVENTORY_SORT)
    public async onSort(source: number, inventoryId: string, sort: InventorySort) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        if (!inventory) {
            return;
        }

        if (!this.inventoryPositionChecker.checkPlayerDistance(source, inventoryId)) {
            this.notifier.error(source, "Vous n'êtes pas à portée de l'inventaire.");

            return;
        }

        inventory.sort(sort);
        await inventory.observe();
    }

    @OnEvent(ServerEvent.INVENTORY_USE_ITEM)
    public async onUseItem(source: number, inventoryId: string, slot: number) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        if (!inventory) {
            return;
        }

        if (!this.inventoryPositionChecker.checkPlayerDistance(source, inventoryId)) {
            this.notifier.error(source, "Vous n'êtes pas à portée de l'inventaire.");

            return;
        }

        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const inventoryItem = inventory.getItemAtSlot(slot);

        if (!inventoryItem) {
            return;
        }

        if (player.metadata.isdead || player.metadata.ishandcuffed || player.metadata.inlaststand) {
            return;
        }

        if (inventoryItem.type === 'weapon') {
            TriggerClientEvent(ClientEvent.WEAPON_USE_WEAPON, source, inventoryItem);
        } else {
            await this.itemService.useItem(source, inventoryItem, inventory);
        }

        await inventory.observe();

        this.monitor.traceEvent('use_item', {
            player_source: source,
            item_id: inventoryItem.name,
            inventory_id: inventoryId,
        });
    }

    @OnEvent(ServerEvent.INVENTORY_FORCE_CONSUME)
    public async onForceConsume(source: number, inventoryId: string, inventoryItem: InventoryItem) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        if (!inventory) {
            return;
        }

        if (!this.inventoryPositionChecker.checkPlayerDistance(source, inventoryId)) {
            this.notifier.error(source, "Vous n'êtes pas à portée de l'inventaire.");

            return;
        }

        if (inventory.type() !== InventoryType.Player) {
            return;
        }

        const citizenId = inventoryId.replace('player_', '');
        const target = this.playerService.getPlayerByCitizenId(citizenId);

        if (!target) {
            return;
        }

        if (target.metadata.isdead || target.metadata.inlaststand) {
            this.notifier.error(source, "Le joueur est dans un état où il ne peut pas consommer d'objet.");

            return;
        }

        await this.itemService.useItem(target.source, inventoryItem, inventory);

        const itemObject = this.itemService.getItem(inventoryItem.name);

        this.notifier.notify(
            source,
            `Vous avez forcé le joueur à utiliser ~b~${itemObject.label || inventoryItem.name}`
        );

        this.notifier.notify(
            target.source,
            `Vous avez été forcé à utiliser ~b~${itemObject.label || inventoryItem.name}`
        );

        await inventory.observe();

        this.monitor.traceEvent('force_consume', {
            player_source: source,
            target_source: target.source,
            item_id: inventoryItem.name,
            inventory_id: inventoryId,
        });
    }

    @OnEvent(ServerEvent.INVENTORY_RENAME_ITEM)
    public async onRenameItem(source: number, inventoryId: string, slot: number, label: string | null) {
        const inventory = await this.inventoryFactory.get(inventoryId);

        if (!inventory) {
            return;
        }

        if (!this.inventoryPositionChecker.checkPlayerDistance(source, inventoryId)) {
            this.notifier.error(source, "Vous n'êtes pas à portée de l'inventaire.");

            return;
        }

        const inventoryItem = inventory.getItemAtSlot(slot);

        if (!inventoryItem) {
            return;
        }

        inventory.updateMetadataAtSlot(slot, {
            label,
        });

        this.notifier.notify(source, `Vous avez ajouté l'étiquette ~g~${label}`);

        await inventory.observe();
    }

    @OnEvent(ServerEvent.INVENTORY_GIVE_ITEM)
    public async onGiveItem(source: number, target: number, inventoryId: string, slot: number, amount: number) {
        const sourceInventory = await this.inventoryFactory.get(inventoryId);

        if (!sourceInventory) {
            return;
        }

        const sourceItem = sourceInventory.getItemAtSlot(slot);

        if (!sourceItem) {
            return;
        }

        const targetInventory = await this.inventoryFactory.getPlayerInventory(target);

        if (!targetInventory) {
            return;
        }

        if (
            !this.inventoryPositionChecker.checkPlayerDistance(source, sourceInventory.id) ||
            !this.inventoryPositionChecker.checkPlayerDistance(source, targetInventory.id)
        ) {
            this.notifier.error(source, "Vous n'êtes pas à portée de l'inventaire.");

            return;
        }

        if (targetInventory.id === sourceInventory.id) {
            this.notifier.error(source, "Vous ne pouvez pas donner d'objet à vous-même.");

            return;
        }

        const amountMoved = await this.moveItem(source, sourceInventory, targetInventory, sourceItem, amount);

        if (amountMoved <= 0) {
            return;
        }

        TriggerClientEvent(ClientEvent.ANIMATION_GIVE, source);
        TriggerClientEvent(ClientEvent.ANIMATION_GIVE, target);
    }

    private async moveItem(
        source: number,
        sourceInventory: Inventory,
        targetInventory: Inventory,
        sourceItem: InventoryItem,
        amount: number,
        targetSlot?: number
    ) {
        if (
            sourceInventory.id !== targetInventory.id &&
            !targetInventory.canCarryItem(sourceItem.name, amount, sourceItem.metadata)
        ) {
            while (amount > 0 && !targetInventory.canCarryItem(sourceItem.name, amount, sourceItem.metadata)) {
                amount -= 1;
            }

            if (amount === 0) {
                this.notifier.error(source, ADD_ERROR_MESSAGE['not_enough_space']);

                return 0;
            }
        }

        const itemObject = this.itemService.getItem(sourceItem.name);

        if (itemObject?.onlyone && targetInventory.hasEnoughItem(sourceItem.name, 1, false)) {
            this.notifier.error(source, "Impossible d'ajouter l'objet, ~r~un seul exemplaire~s~ par inventaire.");

            return 0;
        }

        if (!sourceInventory.removeAtSlot(sourceItem.slot, amount)) {
            this.notifier.error(source, "Impossible de retirer l'objet de l'inventaire.");

            return 0;
        }

        targetInventory.add(
            sourceItem.name,
            amount,
            sourceItem.metadata,
            targetSlot,
            sourceInventory.id === targetInventory.id
        );

        if (targetInventory.id !== sourceInventory.id) {
            this.monitor.traceEvent('transfer_item', {
                player_source: source,
                item_id: sourceItem.name,
                amount,
                inventory_source_id: sourceInventory.id,
                inventory_target_id: targetInventory.id,
            });

            this.notifyMoveItem(source, sourceInventory, targetInventory, sourceItem, amount);
        }

        await sourceInventory.observe(); // Force refresh of the inventory
        await targetInventory.observe(); // Force refresh of the inventory

        return amount;
    }

    private notifyMoveItem(
        source: number,
        sourceInventory: Inventory,
        targetInventory: Inventory,
        sourceItem: InventoryItem,
        amount: number
    ) {
        if (sourceInventory.id === targetInventory.id) {
            return;
        }

        const itemObject = this.itemService.getItem(sourceItem.name);
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const playerInventoryId = `player_${player.citizenid}`;

        if (playerInventoryId === sourceInventory.id) {
            if (targetInventory.getPlayerCitizenId()) {
                const targetPlayer = this.playerService.getPlayerByCitizenId(targetInventory.getPlayerCitizenId());

                if (targetPlayer) {
                    this.notifier.notify(
                        targetPlayer.source,
                        `Vous avez reçu ~o~${amount} ~b~${itemObject.label || sourceItem.name}`
                    );
                }
            }
        }

        if (playerInventoryId === targetInventory.id) {
            if (sourceInventory.getPlayerCitizenId()) {
                const targetPlayer = this.playerService.getPlayerByCitizenId(sourceInventory.getPlayerCitizenId());

                if (targetPlayer) {
                    this.notifier.notify(
                        targetPlayer.source,
                        `On vous a pris ~o~${amount} ~b~${itemObject.label || sourceItem.name}`
                    );
                }
            }
        }
    }
}

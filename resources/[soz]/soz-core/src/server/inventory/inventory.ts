import { uuidv4 } from '@core/utils';
import { ItemService } from '@public/server/item/item.service';
import { ServerEvent } from '@public/shared/event';
import { DrugPotItem, Item } from '@public/shared/item';
import { Err, Ok, Result } from '@public/shared/result';
import { addDays, addMinutes, startOfDay, startOfMinute } from 'date-fns';
import { generate, observe, Observer, Operation } from 'fast-json-patch';

import {
    AddError,
    CRATE_MAX_WEIGHT,
    CRATE_TYPE_ALLOWED,
    getItemWeight,
    GIFT_TYPE_ALLOWED,
    InventoryConfiguration,
    InventoryItem,
    InventoryItemMetadata,
    InventorySort,
    InventoryState,
    InventoryType,
    isInventoryItemExpired,
    isItemAllowed,
    isSameInventoryItem,
    MergeError,
} from '../../shared/inventory';

type subscriber = (
    changes: Operation[],
    items: Record<number, InventoryItem>,
    configuration: InventoryConfiguration
) => Promise<void> | void;

export class Inventory {
    private observer: Observer<InventoryItem> = null;

    private subscribers: Map<string, subscriber> = new Map();

    private _hasChanges = false;

    constructor(
        public readonly id: string,
        private _type: InventoryType,
        private _configuration: InventoryConfiguration,
        private readonly _items: Record<number, InventoryItem> = {},
        private _itemService: ItemService,
        private _accessChecker: (source: number, inventory: Inventory) => boolean | Promise<boolean>,
        private _stateCreator: (source: number, inventory: Inventory) => Promise<InventoryState> | InventoryState
    ) {
        this.observer = observe(this._items);
    }

    canAccess(source: number): boolean | Promise<boolean> {
        return this._accessChecker(source, this);
    }

    type(): InventoryType {
        return this._type;
    }

    async state(source: number): Promise<InventoryState> {
        return this._stateCreator(source, this);
    }

    items(): Record<number, Readonly<InventoryItem>> {
        return this._items;
    }

    configuration(): Readonly<InventoryConfiguration> {
        return this._configuration;
    }

    getItemAtSlot(slot: number): Readonly<InventoryItem> | null {
        return this.doGetItemAtSlot(slot);
    }

    getItemCount(id: string, allowExpired = true, metadata: InventoryItemMetadata = null): number {
        return this.filterItems(id, allowExpired, metadata).reduce((acc, item) => {
            return acc + item.amount;
        }, 0);
    }

    private doGetItemAtSlot(slot: number): InventoryItem | null {
        return this._items[slot] || null;
    }

    findItem(
        filter: (item: InventoryItem, index: number, list: InventoryItem[]) => boolean
    ): Readonly<InventoryItem> | undefined {
        return Object.values(this._items).find(filter);
    }

    getItem(id: string): Readonly<InventoryItem> | null {
        for (const item of Object.values(this._items)) {
            if (item.name === id) {
                return item;
            }
        }

        return null;
    }

    getStoredItems(metadata: InventoryItemMetadata): InventoryItem[] {
        if (!metadata?.storageElements) {
            return [];
        }

        if (Array.isArray(metadata?.storageElements)) {
            return metadata?.storageElements;
        } else {
            return Object.keys(metadata?.storageElements).map(key => metadata?.storageElements[key]);
        }
    }

    weight() {
        return this._itemService.getItemsWeight(Object.values(this._items));
    }

    canCarryItem(id: string, amount = 1, metadata: InventoryItemMetadata = null): boolean {
        return this.canCarryItems([{ name: id, amount, metadata }]);
    }

    canCarryItems(items: { name: string; amount?: number; metadata?: InventoryItemMetadata }[]) {
        const currentWeight = this.weight();
        const itemsWeight = this._itemService.getItemsWeight(items);
        const newWeight = currentWeight + itemsWeight;
        const maxWeight = this.maxWeight();

        return newWeight <= maxWeight;
    }

    canSwapItem(inputName: string, inputAmount: number, outputName: string, outputAmount: number) {
        return this.canSwapItems(
            [{ name: inputName, amount: inputAmount, metadata: null }],
            [{ name: outputName, amount: outputAmount, metadata: null }]
        );
    }

    canSwapItems(
        outItems: { name: string; amount: number; metadata?: InventoryItemMetadata | null }[],
        inItems: { name: string; amount: number; metadata?: InventoryItemMetadata | null }[]
    ) {
        const currentWeight = this.weight();
        const outWeight = this._itemService.getItemsWeight(outItems);
        const inWeight = this._itemService.getItemsWeight(inItems);
        const newWeight = currentWeight - outWeight + inWeight;
        const maxWeight = this.maxWeight();

        return newWeight <= maxWeight;
    }

    hasEnoughItem(
        itemId: string,
        amount: number = 1,
        skipExpiredItem: boolean = false,
        metadata: InventoryItemMetadata = null
    ) {
        const count = this.getItemCount(itemId, !skipExpiredItem, metadata);

        return count >= amount;
    }

    maxWeight() {
        return this._configuration.maxWeight;
    }

    add(
        id: string,
        amount = 1,
        metadata: InventoryItemMetadata = null,
        slot?: number,
        bypassCheck = false
    ): Result<InventoryItem, AddError> {
        const itemObject = this._itemService.getItem(id);

        if (!itemObject) {
            return Err('item_not_found');
        }

        amount = Math.round(amount);
        metadata = metadata || {};

        if (itemObject.type === 'weapon') {
            metadata = {
                serial: uuidv4(),
                tint: 0,
                health: 2000,
                maxHealth: 2000,
                ...metadata,
            };
        }

        if (itemObject.expiresIn && !metadata?.expiration) {
            metadata = {
                ...metadata,
                expiration: startOfMinute(addMinutes(new Date(), itemObject.expiresIn)).toUTCString(),
            };
        }

        if (itemObject.durability && !metadata?.expiration) {
            metadata = {
                ...metadata,
                expiration: startOfDay(addDays(new Date(), itemObject.durability)).toUTCString(),
            };
        }

        if (!metadata?.creation && itemObject.type === 'evidence') {
            metadata = {
                ...metadata,
                creation: new Date().toUTCString(),
            };
        }

        if (itemObject.storageItemType) {
            metadata = {
                id: uuidv4(),
                storageElements: [],
                ...metadata,
            };
        }

        if (!bypassCheck && !isItemAllowed(itemObject.type, id, metadata, this._configuration)) {
            return Err('not_allowed');
        }

        // Check weight
        if (!bypassCheck && !this.canCarryItem(id, amount, metadata)) {
            return Err('not_enough_space');
        }

        if (!bypassCheck && itemObject.onlyone && this.getItem(id) !== null && this._type === InventoryType.Player) {
            return Err('already_exists');
        }

        if (!bypassCheck && itemObject.unique && amount > 1 && slot) {
            return Err('invalid_slot');
        }

        const existingItemAtSlot = slot ? this.doGetItemAtSlot(slot) : null;

        if (existingItemAtSlot && !isSameInventoryItem(existingItemAtSlot, { name: id, metadata })) {
            slot = null;
        }

        if (itemObject.unique) {
            let lastSlot = null;

            for (let i = 0; i < amount; i++) {
                lastSlot = this.doAddItem(itemObject, 1, metadata, i === 0 ? slot : null);
            }

            return Ok(lastSlot);
        }

        const existingItem = slot ? existingItemAtSlot : this.filterItems(id, true, metadata)[0];
        let leftover = amount;

        if (existingItem && isSameInventoryItem(existingItem, { name: id, metadata })) {
            if (!itemObject.maxStack || existingItem.amount + amount <= itemObject.maxStack) {
                existingItem.amount += amount;
                this._hasChanges = true;

                return Ok(existingItem);
            }

            leftover -= itemObject.maxStack - existingItem.amount;
            existingItem.amount = itemObject.maxStack;
        }

        if (itemObject.maxStack) {
            let lastItem = null;

            while (leftover > 0) {
                const currentAmount = Math.min(leftover, itemObject.maxStack);
                leftover -= currentAmount;

                lastItem = this.doAddItem(itemObject, currentAmount, metadata, slot);
            }

            return Ok(lastItem);
        }

        return Ok(this.doAddItem(itemObject, amount, metadata, slot));
    }

    private doAddItem(
        item: Item,
        amount: number,
        metadata: InventoryItemMetadata = null,
        slot?: number
    ): InventoryItem {
        if (!slot) {
            const currentMaxSlot = Object.values(this._items).reduce(
                (max, item) => (item.slot > max ? item.slot : max),
                0
            );
            let foundSlot = null;

            for (let i = 1; i <= currentMaxSlot; i++) {
                if (this.getItemAtSlot(i) === null) {
                    foundSlot = i;
                    break;
                }
            }

            slot = foundSlot ?? currentMaxSlot + 1;
        }

        const inventoryItem: InventoryItem = {
            name: item.name,
            type: item.type,
            amount,
            metadata: { ...metadata },
            slot,
        };

        this._items[slot] = inventoryItem;
        this._hasChanges = true;

        if (this._type == InventoryType.Trunk) {
            TriggerEvent(ServerEvent.POLICE_DRUG_IN_TRUNK, this.id, item);
        }

        return inventoryItem;
    }

    merge(
        slot: number,
        inventoryItem: InventoryItem,
        amount: number = 1,
        isSameInventory: boolean
    ): Result<number, MergeError> {
        let existingItem = this.doGetItemAtSlot(slot);

        if (!existingItem) {
            return Err('no_item_to_merge');
        }

        const item = this._itemService.getItem(inventoryItem.name);
        const existingItemObject = this._itemService.getItem(existingItem.name);

        if (!item || !existingItemObject) {
            return Err('item_not_found');
        }

        // Case 1: Same item
        if (
            isSameInventoryItem(existingItem, inventoryItem) &&
            !item.unique &&
            (!item.maxStack || existingItem.amount + amount <= item.maxStack)
        ) {
            if (!isSameInventory) {
                const currentWeight = this.weight();

                while (amount > 0) {
                    const newWeight =
                        currentWeight +
                        getItemWeight(
                            inventoryItem.name,
                            amount,
                            this._itemService.getItem.bind(this._itemService),
                            inventoryItem.metadata
                        );

                    if (newWeight <= this.maxWeight()) {
                        break;
                    }

                    amount -= 1;
                }

                if (amount === 0) {
                    return Err('not_enough_space');
                }
            }

            existingItem.amount += amount;
            this._hasChanges = true;

            return Ok(amount);
        }

        // Case 2: Crate
        if (existingItem.type === 'crate' && CRATE_TYPE_ALLOWED.includes(inventoryItem.type)) {
            const crateWeight = getItemWeight(
                existingItem.name,
                existingItem.amount,
                this._itemService.getItem.bind(this._itemService),
                existingItem.metadata
            );
            const addedWeight = getItemWeight(
                inventoryItem.name,
                amount,
                this._itemService.getItem.bind(this._itemService),
                inventoryItem.metadata
            );

            if (crateWeight + addedWeight > CRATE_MAX_WEIGHT) {
                return Err('not_enough_space');
            }

            this._hasChanges = true;

            if (existingItem.name === 'empty_lunchbox') {
                this.removeAtSlot(existingItem.slot, 1);
                const lunchbox = this._itemService.getItem('lunchbox');

                existingItem = this.doAddItem(lunchbox, 1, {
                    crateElements: [],
                });
            }

            // Merge inside crate
            for (const crateItem of existingItem.metadata?.crateElements || []) {
                if (
                    crateItem.name === inventoryItem.name &&
                    crateItem.metadata?.expiration === inventoryItem.metadata?.expiration
                ) {
                    crateItem.amount += amount;

                    return Ok(amount);
                }
            }

            // Add new item to crate
            existingItem.metadata = {
                ...(existingItem.metadata || {}),
                crateElements: [
                    ...(existingItem.metadata?.crateElements || []),
                    {
                        name: inventoryItem.name,
                        amount,
                        metadata: inventoryItem.metadata,
                        label: item.label,
                    },
                ],
            };

            return Ok(amount);
        }

        // Case 3: Fishing bait + Fishing rod
        if (existingItem.type === 'fishing_rod' && inventoryItem.type === 'fishing_bait') {
            existingItem.metadata = {
                ...(existingItem.metadata || {}),
                bait: {
                    name: inventoryItem.name,
                    amount: 1,
                    type: inventoryItem.type,
                    metadata: inventoryItem.metadata,
                },
            };

            this._hasChanges = true;

            return Ok(1);
        }

        // Case 4: Kerosene + Chainsaw
        if (existingItem.name === 'chainsaw' && inventoryItem.name === 'kerosene_jerrycan') {
            existingItem.metadata = {
                ...(existingItem.metadata || {}),
                fuel: 20,
            };

            this._hasChanges = true;

            return Ok(1);
        }

        // Case 5: Drug pot to target
        if (existingItem.type === 'drug_pot') {
            const existingItemObject = this._itemService.getItem<DrugPotItem>(existingItem.name);
            const targetItemObject = this._itemService.getItem(existingItemObject.drug_pot.target);

            if (
                existingItemObject.drug_pot.ingredient === inventoryItem.name &&
                amount >= existingItemObject.drug_pot.nbIngredient
            ) {
                this.removeAtSlot(existingItem.slot, 1);

                if (this.doGetItemAtSlot(existingItem.slot)) {
                    this.doAddItem(targetItemObject, 1, {});
                } else {
                    this.doAddItem(targetItemObject, 1, {}, existingItem.slot);
                }

                this._hasChanges = true;

                return Ok(existingItemObject.drug_pot.nbIngredient);
            }
        }

        // Case 6: Detective board
        if (existingItem.name === 'detective_board' && inventoryItem.name === 'scientist_photo') {
            if (isInventoryItemExpired(inventoryItem)) {
                return Err('scientist_photo_expired');
            }

            if (!existingItem.metadata.photosInDetectiveBoard) {
                existingItem.metadata.photosInDetectiveBoard = [];
            }

            existingItem.metadata.photosInDetectiveBoard.push(inventoryItem.metadata.photoUrl);

            this._hasChanges = true;

            return Ok(0);
        }

        // Case 7: Armor plate
        if (inventoryItem.name === 'armor_plate' && existingItemObject.maxplates && existingItem.amount === 1) {
            if (!existingItem.metadata.plates || existingItem.metadata.plates < existingItemObject.maxplates) {
                existingItem.metadata.plates = existingItem.metadata.plates || 0;
                existingItem.metadata.plates += 1;

                return Ok(1);
            } else if (existingItem.metadata.plates === existingItemObject.maxplates) {
                return Err('max_plates_reached');
            }
        } else if (inventoryItem.name === 'armor_plate' && existingItemObject.maxplates && existingItem.amount > 1) {
            return Err('add_plates_on_stack');
        }

        // Case 8: Wrapping paper + items
        if (
            existingItem.name.startsWith('wrapping_') &&
            !inventoryItem.name.startsWith('gift_') &&
            !item.notGiveable &&
            !item.carrybox &&
            GIFT_TYPE_ALLOWED.includes(inventoryItem.type)
        ) {
            const gift = this._itemService.getItem(existingItem.name.replace('wrapping_', 'gift_'));
            if (!gift || !gift.name.startsWith('gift_')) {
                return Err('cannot_merge');
            }

            this.removeAtSlot(existingItem.slot, 1);
            this.doAddItem(gift, 1, {
                crateElements: [
                    {
                        name: inventoryItem.name,
                        amount: 1,
                        metadata: inventoryItem.metadata,
                        label: item.label,
                    },
                ],
            });

            this._hasChanges = true;
            return Ok(1);
        }

        return Err('cannot_merge');
    }

    remove(id: string, amount: number = 1, allowExpired = true, metadata: InventoryItemMetadata = null): boolean {
        const toRemove: { slot: number; amount: number }[] = [];

        for (const item of this.filterItems(id, allowExpired, metadata)) {
            const findAmount = toRemove.reduce((acc, { amount }) => acc + amount, 0);
            if (amount - findAmount >= item.amount) {
                toRemove.push({ slot: item.slot, amount: item.amount });
                if (amount - findAmount === item.amount) {
                    break;
                }
            } else {
                toRemove.push({ slot: item.slot, amount: amount - findAmount });
                break;
            }
        }

        const findAmount = toRemove.reduce((acc, { amount }) => acc + amount, 0);

        if (findAmount < amount) {
            return false;
        }

        for (const { slot, amount } of toRemove) {
            this.removeAtSlot(slot, amount);
        }

        return true;
    }

    updateMetadataAtSlot(slot: number, metadata: InventoryItemMetadata) {
        const currentItem = this.doGetItemAtSlot(slot);

        if (!currentItem) {
            return;
        }

        if (!currentItem.metadata) {
            currentItem.metadata = {};
        }

        for (const key of Object.keys(metadata)) {
            currentItem.metadata[key] = metadata[key];
        }

        this._hasChanges = true;
    }

    removeAtSlot(slot: number, amount: number | 'all'): boolean {
        const inventoryItem = this._items[slot];

        if (!inventoryItem) {
            return false;
        }

        this._hasChanges = true;

        if (amount !== 'all' && inventoryItem.amount > amount) {
            inventoryItem.amount -= amount;

            return true;
        }

        delete this._items[slot];

        return true;
    }

    clear() {
        for (const slot of Object.keys(this._items)) {
            delete this._items[slot];
        }

        this._hasChanges = true;
    }

    updateConfiguration(configuration: Partial<InventoryConfiguration>) {
        this._configuration = {
            ...this._configuration,
            ...configuration,
        };

        this._hasChanges = true;
    }

    sort(sort: InventorySort) {
        const itemsAsArray = Object.values(this._items);
        const sortFunction = SortAlgorithms[sort];

        itemsAsArray.sort((a, b) => {
            return sortFunction(a, b, this._itemService.getItem.bind(this._itemService));
        });

        let maxSlot = 0;

        for (const [index, item] of itemsAsArray.entries()) {
            item.slot = index + 1;
            this._items[item.slot] = item;
            maxSlot = item.slot;
        }

        for (const slot of Object.keys(this._items)) {
            const slotNumber = parseInt(slot, 10);

            if (slotNumber > maxSlot) {
                delete this._items[slot];
            }
        }

        this._hasChanges = true;
    }

    subscribe(subscriber: subscriber): string {
        const id = uuidv4();

        this.subscribers.set(id, subscriber);

        return id;
    }

    unsubscribe(id: string) {
        this.subscribers.delete(id);
    }

    getPlayerCitizenId(): string | null {
        if (this._type !== InventoryType.Player) {
            return null;
        }

        return this.id.replace('player_', '');
    }

    public async observe() {
        if (!this._hasChanges) {
            return;
        }

        this._hasChanges = false;
        const patch = generate(this.observer);
        const promises = [];

        for (const subscriber of this.subscribers.values()) {
            promises.push(subscriber(patch, this._items, this._configuration));
        }

        await Promise.all(promises);
    }

    private filterItems(id: string, allowExpired: boolean, metadata: InventoryItemMetadata | null): InventoryItem[] {
        return Object.values(this._items).filter(item => {
            if (item.name !== id) {
                return false;
            }

            if (!allowExpired && isInventoryItemExpired(item)) {
                return false;
            }

            if (metadata) {
                for (const key of Object.keys(metadata)) {
                    if (!item.metadata) {
                        return false;
                    }

                    if (metadata[key] !== item.metadata[key]) {
                        return false;
                    }
                }
            }

            return true;
        });
    }
}

const SortAlgorithms: Record<
    InventorySort,
    (itemA: InventoryItem, itemB: InventoryItem, resolver: (id: string) => Item | null) => number
> = {
    [InventorySort.AlphabeticalAsc]: (itemA, itemB, resolver) => {
        const labelA = resolver(itemA.name)?.label || itemA.name;
        const labelB = resolver(itemB.name)?.label || itemB.name;

        return labelA.localeCompare(labelB);
    },
    [InventorySort.AlphabeticalDesc]: (itemA, itemB, resolver) => {
        const labelA = resolver(itemA.name)?.label || itemA.name;
        const labelB = resolver(itemB.name)?.label || itemB.name;

        return labelB.localeCompare(labelA);
    },
    [InventorySort.WeightAsc]: (itemA, itemB, resolver) => {
        return (
            getItemWeight(itemA.name, itemA.amount, resolver, itemA.metadata) -
            getItemWeight(itemB.name, itemB.amount, resolver, itemB.metadata)
        );
    },
    [InventorySort.WeightDesc]: (itemA, itemB, resolver) => {
        return (
            getItemWeight(itemB.name, itemB.amount, resolver, itemB.metadata) -
            getItemWeight(itemA.name, itemA.amount, resolver, itemA.metadata)
        );
    },
    [InventorySort.TypeAsc]: (itemA, itemB) => {
        return itemA.type.localeCompare(itemB.type);
    },
    [InventorySort.TypeDesc]: (itemA, itemB) => {
        return itemB.type.localeCompare(itemA.type);
    },
};

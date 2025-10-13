import { InventoryConfiguration, InventoryItem } from '@public/shared/inventory';
import { PlayerData } from '@public/shared/player';

import { addMethodMetadata } from './reflect';

export const PlayerListenerMetadataKey = 'soz_core.decorator.player';
export const PlayerInventoryListenerMetadataKey = 'soz_core.decorator.player_inventory';
export const PlayerClothesInventoryListenerMetadataKey = 'soz_core.decorator.player_clothes_inventory';

export const PlayerUpdate = () => {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<(data?: PlayerData) => any>
    ) => {
        addMethodMetadata(PlayerListenerMetadataKey, {}, target, propertyKey);

        return descriptor;
    };
};

export const PlayerInventoryUpdate = () => {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<
            (items?: Record<number, InventoryItem>, configuration?: InventoryConfiguration) => any
        >
    ) => {
        addMethodMetadata(PlayerInventoryListenerMetadataKey, {}, target, propertyKey);

        return descriptor;
    };
};

export const PlayerClothesInventoryUpdate = () => {
    return (
        target: any,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<(items?: Record<number, InventoryItem>) => any>
    ) => {
        addMethodMetadata(PlayerClothesInventoryListenerMetadataKey, {}, target, propertyKey);

        return descriptor;
    };
};

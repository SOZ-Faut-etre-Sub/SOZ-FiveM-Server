import { InventoryItem } from '@public/shared/inventory';
import { PlayerData } from '@public/shared/player';

import { ItemIconProps } from '../../Inventory/ItemSlot';
import { getBestClothesPartId } from './getBestPartId';

const IMAGE_BASE_PATH = 'images/shop/content';

export function getApparelItemIcon(player: PlayerData, item: InventoryItem | ItemIconProps): string | null {
    if (!player || !item) return null;
    if (!item.metadata.components && !item.metadata.props) return null;

    const apparelType = item.metadata.components ? 'components' : 'props';
    const apparelPartId = getBestClothesPartId(item.metadata[apparelType]);

    const apparelOutfit = item.metadata[apparelType][apparelPartId];

    return getApparelIcon(
        player,
        apparelType,
        Number(apparelPartId),
        apparelOutfit.Collection,
        apparelOutfit.Drawable,
        apparelOutfit.Texture
    );
}

export function getApparelIcon(
    player: PlayerData,
    type: 'components' | 'props',
    id: number,
    collection: string | undefined,
    drawable: string,
    texture: string
): string | null {
    if (!player) return null;

    return [
        IMAGE_BASE_PATH,
        player.skin.Model.Hash,
        type === 'components' ? `comp_${id}` : `prop_${id}`,
        collection || 'base',
        drawable,
        `${texture}.webp`,
    ].join('/');
}

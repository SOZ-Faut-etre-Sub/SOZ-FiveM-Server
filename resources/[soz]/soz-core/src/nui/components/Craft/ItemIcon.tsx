import { useAssetPath } from '@public/nui/hook/assets';
import { Item } from '@public/shared/item';
import { FunctionComponent } from 'react';

interface ItemIconProps {
    item: Item;
    className?: string;
}

export const ItemIcon: FunctionComponent<ItemIconProps> = ({ item, className }) => {
    const { getPath } = useAssetPath();

    const FALLBACK_ICON = getPath('images/default/cat.webp');

    return (
        <img
            alt={item.label}
            className={className}
            src={getPath(`images/items/${item.name}.webp`)}
            onError={e => (e.currentTarget.src = FALLBACK_ICON)}
        />
    );
};

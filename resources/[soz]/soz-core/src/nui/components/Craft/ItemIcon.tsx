import { Item } from '@public/shared/item';
import { FunctionComponent } from 'react';

const FALLBACK_ICON = 'https://soz.zerator.com/static/game/images/default/cat.webp';

interface ItemIconProps {
    item: Item;
    className?: string;
}

export const ItemIcon: FunctionComponent<ItemIconProps> = ({ item, className }) => {
    return (
        <img
            alt={item.label}
            className={className}
            src={`https://soz.zerator.com/static/game/images/items/${item.name}.webp`}
            onError={e => (e.currentTarget.src = FALLBACK_ICON)}
        />
    );
};

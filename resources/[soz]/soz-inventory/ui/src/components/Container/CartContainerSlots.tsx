import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import style from './CartContainerSlots.module.css';
import Draggable from '../Draggable/Draggable';
import { Droppable } from '../Droppable/Droppable';
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { ShopItem } from '../../types/shop';

type Props = {
    id: string;
    columns?: number;
    rows: number;
    items: (ShopItem & {id: number})[]
    validateAction: (cartContent: ShopItem[]) => void;
    cartAmount: number;
    cartContent: ShopItem[]
    taxValue: number;
    moneyType: string;
}

export const CartContainerSlots: FunctionComponent<Props> = ({id, columns = 5, rows, items, validateAction, cartAmount, cartContent, taxValue, moneyType}) => {
    const [description, setDescription] = useState<string|null>('');
    const [inContextMenu, setInContextMenu] = useState<Record<string, boolean>>({});

    const createInContext = useCallback(
        (id: string | number) => {
            return (inContext: boolean) =>
                setInContextMenu((contextMenu) => {
                    return { ...contextMenu, [id]: inContext };
                });
        },
        [setInContextMenu]
    );

    useEffect(() => {
        setDescription(null);
    }, [items]);

    const cartAmountTtc = Math.round(cartAmount + cartAmount * taxValue);

    return (
        <>
            <div className={style.CartHeader}>
                <ShoppingBagIcon className={style.CartHeaderIcon} />
                    <p>Glisse et dépose dans ton panier</p>
            </div>
            <div
                className={style.Wrapper}
                style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gridTemplateRows: `repeat(${rows+1}, 1fr)`,
                }}
            >

                {[...Array((columns*(rows+1)) - ( 0))].map((_, i) => (
                    <Droppable key={i} id={`${id}_${i - 1}`} containerName={id} slot={i+1}>
                        <Draggable
                            id={`${id}_drag`}
                            containerName={id}
                            key={i}
                            item={items.find(it => (it.slot -1) === i)}
                            setInContext={createInContext(i)}
                        />
                    </Droppable>
                ))}
            </div>
            <div className={style.CartFooter}>
                    <p>PRIX : {cartAmountTtc.toLocaleString('fr-fr') ?? cartAmountTtc} {['marked_money', 'money'].includes(moneyType ?? '') ? '$' : (                    
                            <img
                            alt=""
                            className={style.Price}
                            src={`https://cfx-nui-soz-core/public/images/items/${moneyType}.webp`}
                            onError={(e) => e.currentTarget.src = 'https://cfx-nui-soz-core/public/images/default/cat.webp'}
                        />)}
                    </p>
                    <button
                        disabled={cartAmount == 0}
                        className={style.CartButton}
                        onClick={()=>{validateAction(cartContent)}}
                    >
                        Acheter
                    </button>
            </div>
            {description && (
                <footer className={style.Description} dangerouslySetInnerHTML={{__html: description}} />
            )}
        </>
    )
}

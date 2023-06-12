import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InventoryItem, SozInventoryModel } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './ShopContainer.module.css';
import { ShopContainerSlots } from '../ShopContainerSlots';
import { closeNUI, askForAmount } from '../../../hooks/nui';
import { clsx } from 'clsx';
import playerBanner from '/banner/player.jpg';
import { DndContext, DragEndEvent, rectIntersection, } from '@dnd-kit/core';
import { getKeyModifier } from '../../../hooks/getKeyModifier'
import { useShopRow } from '../../../hooks/useShopRow';
import { object } from 'prop-types';
import { CartContainerSlots } from '../CartContainerSlots';
import { dragged } from 'sortablejs';
import { ShopItem } from '../../../types/shop';

export const ShopContainer = () => {
    const [cartAmount, setCartAmount] = useState<number>(0);
    const [shopContent, setShopContent] = useState<InventoryItem[] | null>();
    const [cartContent, setCartContent] = useState<InventoryItem[]> ([]);

    const closeMenu = useCallback(() => {
        setShopContent(null);
        setCartContent([]);
    }, [setShopContent, setCartContent]);

    const targetInventoryBanner = 'https://nui-img/soz/menu_shop_supermarket'

    const interactAction = useCallback(
        (action: string, item: InventoryItem, shortcut: number) => {
            fetch(`https://soz-inventory/player/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({ ...item, shortcut }),
            }).then(() => closeNUI(() => closeMenu()));
        },
        [closeMenu]
    );

    const onMessageReceived = useCallback(
        (event: MessageEvent) => {
            if (event.data.action === 'openShop') {
                if (event.data.shopContent === undefined) return;
                try {
                    setShopContent(event.data.shopContent);
                } catch (e: any) {
                    closeNUI(() => { closeMenu();})
                }
            }
        },
        [closeMenu, setShopContent],
    );

    const onKeyDownReceived = useCallback(
        (event: KeyboardEvent) => {
            if (!event.repeat && event.key === 'Escape') {
                closeNUI(() => { closeMenu();})
            }
        },
        [closeMenu],
    );

    const askForAmount = useCallback((event: any) => {
        if (!event.active.data.current) return;

        fetch(`https://soz-inventory/player/askForAmount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({})
        }).then((amount) => {
            return amount;
        });
    }, []);

    const putInCart = useCallback((event: DragEndEvent) => {
        if (!event.active.data.current) return;
        if (!event.over?.data.current) return;
        const keyEvent = event?.activatorEvent as KeyboardEvent

        if (event.over.data.current.container === 'shop' && event.active.data.current.container === 'shop') {
            return;
        }

        
        if (event.over.data.current.container === 'cart' && event.active.data.current.container === 'cart') {
            let oldItem = event.active.data.current.item
            setCartContent(cartContent => cartContent.filter(item => item.slot !== oldItem.slot))

            let draggedItem: ShopItem = structuredClone(event.active.data.current.item)
            draggedItem.slot = event.over.data.current.slot
            setCartContent(cartContent => [...cartContent, draggedItem])

            return;
        }

        if (event.active.data.current.container === 'cart' && event.over.data.current.container === 'shop' ) {
            const draggedItem = event.active.data.current.item
            setCartContent(cartContent => cartContent.filter(item => item.slot !== draggedItem.slot))
            setCartAmount(cartAmount - (draggedItem.amount * draggedItem.price))
            return;
        }
        if (event.active.data.current.container === 'shop' && event.over.data.current.container === 'cart' ) {
            let draggedItem: ShopItem = structuredClone(event.active.data.current.item)
            draggedItem.slot = event.over.data.current.slot
            
            fetch(`https://soz-inventory/player/askForAmount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({})
        }).then((res) => res.json())
        .then((amount) => {
            draggedItem.amount = amount
            setCartContent(cartContent => [...cartContent, draggedItem])
            setCartAmount(cartAmount + (draggedItem.amount * draggedItem.price))
            return;
        })}
    }, [shopContent, cartContent, setCartContent, setShopContent]);

    useEffect(() => {
        window.addEventListener('message', onMessageReceived);
        window.addEventListener('keydown', onKeyDownReceived);

        // onMessageReceived({ data: { ...debugStorageInventory } } as MessageEvent);

        return () => {
            window.removeEventListener('message', onMessageReceived);
            window.removeEventListener('keydown', onKeyDownReceived);
        };
    }, [onMessageReceived, onKeyDownReceived]);

console.log(cartContent, 'CART CONTENT')
    
    const shopRow = useMemo(() => {
        return useShopRow(shopContent || []);
    }, [shopContent]);

    const cartRow = useMemo(() => {
        return useShopRow(shopContent || []);
    }, [cartContent]);

    if (!shopContent) {
        return null;
    }
    return (
        <div className={style.Wrapper}>
            <DndContext
                autoScroll={{
                    enabled: false,
                }}
                collisionDetection={rectIntersection}
                onDragEnd={putInCart}
            >


                <div className={clsx(style.StorageContainer, style.Show)}>
                    <ContainerWrapper
                        display={true}
                        banner={targetInventoryBanner}
                    >
                         <ShopContainerSlots
                            id='shop'
                            rows={shopRow}
                            items={shopContent.map((item, i) => ({ ...item, id: i }))}
                        />
                    </ContainerWrapper>
                </div>
                <div className={clsx(style.CartContainer, style.Show)}>
                    <ContainerWrapper
                        display={true}
                        banner={playerBanner}
                    >
                         <CartContainerSlots
                            id='cart'
                            rows={4}
                            items={cartContent.map((item, i) => ({ ...item, id: i }))}
                        /> 
                    </ContainerWrapper>
                    <p style={{color:'white'}}>{cartAmount}</p>

                </div>
            </DndContext>
        </div>
    );
};

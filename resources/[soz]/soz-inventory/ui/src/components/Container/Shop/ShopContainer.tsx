import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './ShopContainer.module.css';
import { ShopContainerSlots } from '../ShopContainerSlots';
import { closeNUI, askForAmount } from '../../../hooks/nui';
import { clsx } from 'clsx';
import { DndContext, DragEndEvent, rectIntersection, } from '@dnd-kit/core';
import { useShopRow } from '../../../hooks/useShopRow';
import { CartContainerSlots } from '../CartContainerSlots';
import { ShopItem } from '../../../types/shop';

export const ShopContainer = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const [cartAmount, setCartAmount] = useState<number>(0);
    const [shopContent, setShopContent] = useState<ShopItem[] | null>();
    const [cartContent, setCartContent] = useState<ShopItem[]>([]);
    const [shopHeaderTexture, setShopHeaderTexture] = useState<string>('')

    const closeMenu = useCallback(() => {
        setDisplay(false)
        setShopContent(null);
        setCartContent([]);
        setCartAmount(0);
    }, [setShopContent, setCartContent, setCartAmount, setDisplay]);

    const onMessageReceived = useCallback(
        (event: MessageEvent) => {
            if (event.data.action === 'openShop') {
                if (event.data.shopContent === undefined) return;
                try {
                    setShopContent(event.data.shopContent);
                    setShopHeaderTexture(event.data.shopHeaderTexture)
                    setDisplay(true);
                } catch (e: any) {
                    closeNUI(() => { closeMenu(); })
                }
            } else if (event.data.action === 'openPlayerInventory' || event.data.action === 'openInventory' || event.data.action === 'openPlayerKeyInventory') {
                closeMenu();
            }
        },
        [closeMenu, setShopContent],
    );

    const onKeyDownReceived = useCallback(
        (event: KeyboardEvent) => {
            if (display && !event.repeat && event.key === 'Escape') {
                closeNUI(() => { closeMenu(); })
            }
        },
        [closeMenu, display],
    );

    const calcCartPrice = (cartContent: ShopItem[]) => {
        return cartContent.reduce((accumulator: number, cartItem: ShopItem) => {
            return accumulator + (cartItem.amount * cartItem.price);
        }, 0);
    };

    const validateCart = useCallback((cartContent: ShopItem[]) => {
        fetch(`https://soz-inventory/player/validateCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(cartContent)
        }).then(() => {
            closeNUI(() => closeMenu());
        });
    }, [closeMenu]);

    const putInCart = useCallback((event: DragEndEvent) => {
        if (!event.active.data.current) return;

        if ((event.active.data.current.container === 'cart' && !event.over)) {
            const draggedItem = event.active.data.current.item
            setCartContent(cartContent => cartContent.filter(item => item.slot !== draggedItem.slot))
            setCartAmount(cartAmount - (draggedItem.amount * draggedItem.price))
            return;
        }

        if (!event.over?.data.current) return;



        const keyEvent = event?.activatorEvent as KeyboardEvent

        if (event.over.data.current.container === 'shop' && event.active.data.current.container === 'shop') {
            return;
        }



        if (event.over.data.current.container === 'cart' && event.active.data.current.container === 'cart') {
            if (cartContent.find((item) => item.slot == event?.over?.data?.current?.slot)) return

            let oldItem = event.active.data.current.item
            setCartContent(cartContent => cartContent.filter(item => item.slot !== oldItem.slot))

            let draggedItem: ShopItem = structuredClone(event.active.data.current.item)
            draggedItem.slot = event.over.data.current.slot
            setCartContent(cartContent => [...cartContent, draggedItem])

            return;
        }

        if ((event.active.data.current.container === 'cart' && event.over.data.current.container === 'shop')) {
            const draggedItem = event.active.data.current.item
            setCartContent(cartContent => cartContent.filter(item => item.slot !== draggedItem.slot))
            setCartAmount(cartAmount - (draggedItem.amount * draggedItem.price))
            return;
        }

        if (event.active.data.current.container === 'shop' && event.over.data.current.container === 'cart') {

            let draggedItem: ShopItem = structuredClone(event.active.data.current.item)
            draggedItem.slot = event.over.data.current.slot            
            const existingItem = cartContent.find((item) => item.name == draggedItem.name && item.metadata?.label === draggedItem.metadata?.label)
            const existingSlot = cartContent.find((item) => item.slot == event?.over?.data?.current?.slot)
            
            if (!existingItem && existingSlot) return

            fetch(`https://soz-inventory/player/askForAmount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({})
            }).then((res) => res.json())
                .then((amount) => {
                    const amountInt = parseInt(amount);
                    if (isNaN(amountInt) || amountInt <= 0) {
                        return;
                    }

                    draggedItem.amount = amountInt;
                    let newCartAmount = cartAmount + (draggedItem.amount * draggedItem.price)
                    let updatedCart: ShopItem[] = []

                    if (existingItem) {
                        updatedCart = cartContent.map(item => {
                            {
                                if (item.name === draggedItem.name && item.metadata?.label === draggedItem.metadata?.label) {
                                    return { ...item, amount: item.amount + draggedItem.amount }
                                }
                                return item
                            }
                        })

                        newCartAmount = calcCartPrice(cartContent) + draggedItem.price * draggedItem.amount
                    }

                    setCartContent(existingItem ? updatedCart : cartContent => [...cartContent, draggedItem])
                    setCartAmount(newCartAmount)
                    return;
                })
        }
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
            {display &&
                <DndContext
                    autoScroll={{
                        enabled: false,
                    }}
                    collisionDetection={rectIntersection}
                    onDragEnd={putInCart}
                >
                    <div className={clsx(style.StorageContainer)}>
                        <ContainerWrapper
                            display={true}
                            banner={`https://nui-img/soz/${shopHeaderTexture}`}
                            maxWeight={-1}
                        >
                            <ShopContainerSlots
                                id='shop'
                                rows={shopRow}
                                items={shopContent.map((item, i) => ({ ...item, id: i }))}
                            />

                            <CartContainerSlots
                                cartAmount={cartAmount}
                                cartContent={cartContent}
                                id='cart'
                                rows={2}
                                items={cartContent.map((item, i) => ({ ...item, id: i }))}
                                validateAction={validateCart}
                            />
                        </ContainerWrapper>
                    </div>
                </DndContext>
            }
        </div>
    );
};

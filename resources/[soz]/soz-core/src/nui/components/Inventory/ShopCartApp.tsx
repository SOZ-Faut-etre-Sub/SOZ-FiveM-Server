import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    MouseSensor,
    rectIntersection,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import classNames from 'classnames';
import { Fragment, FunctionComponent, useState } from 'react';
import { createPortal } from 'react-dom';

import { BankMoneyType, TaxType } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event/nui';
import { isSameInventoryItem } from '../../../shared/inventory';
import { AskInput } from '../../../shared/nui/input';
import { RpcServerEvent } from '../../../shared/rpc';
import { ShopContent } from '../../../shared/shop';
import { CartElement, ShopItem } from '../../../shared/shop/superette';
import { fetchNui } from '../../fetch';
import { useKeyPress } from '../../hook/control';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useGetPrice } from '../../hook/price';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';
import { InventoryDiv } from './Inventory';
import { ItemDescription } from './ItemDescription';
import { EmptySlot, getItemIcon, getItemSlotClassnames } from './ItemSlot';

type DraggableDateShopItem = {
    type: 'shop_item';
    item: ShopItem;
};

type DraggableDataCartItem = {
    type: 'cart_item';
    index: number;
};

type DraggableData = DraggableDateShopItem | DraggableDataCartItem;

type ShopData = {
    moneyType: string | BankMoneyType;
    shopId: string;
    rpcServerEvent: RpcServerEvent;
};

export const ShopCartApp: FunctionComponent = () => {
    const [shopContent, setShopContent] = useState<ShopContent>(null);
    const [cartContent, setCartContent] = useState<CartElement[]>([]);
    const [currentShopItem, setCurrentShopItem] = useState<ShopItem>(null);
    const open = shopContent !== null;

    useNuiEvent('inventory', 'OpenShop', data => {
        setShopContent(data);
        setCartContent([]);
    });

    useNuiEvent('inventory', 'CloseShop', () => {
        setShopContent(null);
        setCartContent([]);
    });

    useNuiFocus(open, open, false);
    useKeyPress('Escape', () => {
        setShopContent(null);
        setCartContent([]);
    });
    useKeyPress('Backspace', () => {
        setShopContent(null);
        setCartContent([]);
    });
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const sensors = useSensors(mouseSensor);

    if (!open) {
        return null;
    }

    const addItem = async (item: ShopItem, modifier?: 'ctrl' | 'shift' | 'alt') => {
        let targetAmount = 1;

        if (modifier === 'ctrl') {
            targetAmount = 2;
        }

        if (modifier === 'shift') {
            targetAmount = 10;
        }

        if (modifier === 'alt') {
            const amountStr = await fetchNui<AskInput, string>(NuiEvent.AskInput, {
                title: 'Quantité',
                defaultValue: targetAmount.toString(),
                maxCharacters: 40,
            });

            if (amountStr === null) {
                return;
            }

            targetAmount = parseInt(amountStr);

            if (isNaN(targetAmount)) {
                return;
            }
        }

        setCartContent(prev => {
            const newCartItem = {
                name: item.name,
                type: item.type,
                slot: 0,
                amount: targetAmount,
                metadata: item.metadata || {},
                price: item.price,
                unique: item.unique,
                weight: item.weight,
            };
            const existingItem = prev.findIndex(cartItem => isSameInventoryItem(cartItem, newCartItem));

            if (existingItem === -1 || item.unique) {
                const newCartContent = [...prev];

                if (item.unique && newCartItem.amount > 1) {
                    for (let i = 0; i < newCartItem.amount; i++) {
                        newCartContent.push({ ...newCartItem, amount: 1 });
                    }
                } else {
                    newCartContent.push(newCartItem);
                }

                return newCartContent;
            }

            prev[existingItem].amount += targetAmount;

            return [...prev];
        });
    };

    const removeItem = (index: number) => {
        setCartContent(prev => {
            prev.splice(index, 1);

            return [...prev];
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        if (!event.active.data.current) {
            return;
        }

        const data = event.active.data.current as DraggableData;

        if (!event.over && data.type === 'cart_item') {
            removeItem(data.index);
        }

        const keyEvent = event.activatorEvent as KeyboardEvent;
        const modifier = keyEvent?.ctrlKey ? 'ctrl' : keyEvent?.shiftKey ? 'shift' : keyEvent?.altKey ? 'alt' : null;

        if (event.over && data.type === 'shop_item' && event.over.id === 'droppable_cart_content') {
            await addItem(data.item, modifier);
        }
    };
    const nbLines = Math.max(Math.ceil(shopContent.items.length / 5), 4);

    return (
        <DndContext
            autoScroll={{
                enabled: false,
            }}
            collisionDetection={rectIntersection}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <div className="absolute h-full w-full font-prompt">
                <div className="m-8">
                    <div className="flex max-h-[40vh]">
                        <div className="max-h-full w-[390px] xl:ml-[94vh]">
                            <InventoryDiv title={shopContent.title} useGrid>
                                {[...Array(nbLines)].map((_, i) => {
                                    return (
                                        <Fragment key={i}>
                                            {[...Array(5)].map((_, j) => {
                                                const index = i * 5 + j;
                                                const item = shopContent.items[index] || null;

                                                if (!item) {
                                                    return (
                                                        <EmptySlot
                                                            droppable={false}
                                                            key={index}
                                                            inventoryId={'shop'}
                                                            slot={index}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <ShopItem
                                                        addItem={addItem}
                                                        index={index}
                                                        item={item}
                                                        setCurrentShopItem={setCurrentShopItem}
                                                        key={index}
                                                        tax={shopContent.tax}
                                                        moneyType={shopContent.moneyType}
                                                    />
                                                );
                                            })}
                                        </Fragment>
                                    );
                                })}
                            </InventoryDiv>
                        </div>
                        <div
                            className="ml-4"
                            style={{
                                width: 'fit-content',
                                maxWidth: '36vh',
                            }}
                        >
                            <ItemDescription
                                position="right"
                                inventoryItem={
                                    currentShopItem
                                        ? {
                                              name: currentShopItem.name,
                                              type: currentShopItem.type,
                                              slot: 0,
                                              amount: currentShopItem.amount || 1,
                                              metadata: currentShopItem.metadata || {},
                                          }
                                        : null
                                }
                            />
                        </div>
                    </div>
                    <CartInventory
                        removeItem={removeItem}
                        items={cartContent}
                        tax={shopContent.tax}
                        shopData={shopContent}
                    />
                </div>
            </div>
        </DndContext>
    );
};

const ShopItem: FunctionComponent<{
    index: number;
    item: ShopItem;
    setCurrentShopItem: (item: ShopItem) => void;
    addItem: (item: ShopItem) => Promise<void>;
    moneyType: string | BankMoneyType;
    tax?: TaxType;
}> = ({ index, item, setCurrentShopItem, addItem, moneyType, tax }) => {
    const {
        attributes,
        listeners,
        setNodeRef: setDraggableNodeRef,
        isDragging,
    } = useDraggable({
        id: `draggable_cart_item_${index}_${item.name}`,
        data: {
            type: 'shop_item',
            item,
        },
    });
    const getPrice = useGetPrice();

    const itemForIcon = {
        name: item.name,
        type: item.type,
        slot: 0,
        amount: item.amount || 1,
        metadata: item.metadata || {},
    };

    return (
        <>
            <div
                className="aspect-square w-[70px] h-[70px]"
                onMouseEnter={() => setCurrentShopItem(item)}
                onMouseLeave={() => {
                    setCurrentShopItem(null);
                }}
                onDoubleClick={() => {
                    addItem(item);
                }}
            >
                <GlassMorphismContainer borderClassName="rounded-xl aspect-square" showBorderOnHover>
                    <div className={getItemSlotClassnames(false)}>
                        <div ref={setDraggableNodeRef} {...listeners} {...attributes}>
                            <div className="relative">
                                <img
                                    className="h-full w-full aspect-square"
                                    src={getItemIcon(itemForIcon)}
                                    alt={item.name}
                                />
                                <div
                                    className={classNames('absolute text-xs', {
                                        'text-gray-200': moneyType !== 'marked_money',
                                        'text-red-500': moneyType === 'marked_money',
                                    })}
                                    style={{
                                        bottom: 0,
                                        right: 0,
                                        margin: '0.1rem 0.2rem',
                                    }}
                                >
                                    {getPrice(item.price, tax)} $
                                </div>
                                {item.amount && item.amount > 1 && (
                                    <div
                                        className="absolute text-gray-200 text-xs"
                                        style={{
                                            top: 0,
                                            right: 0,
                                            margin: '0.1rem 0.2rem',
                                        }}
                                    >
                                        {item.amount}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </GlassMorphismContainer>
            </div>
            {createPortal(
                <DragOverlay dropAnimation={null}>
                    {isDragging && <img className="absolute z-50" src={getItemIcon(itemForIcon)} alt={item.name} />}
                </DragOverlay>,
                document.body
            )}
        </>
    );
};

const CartInventory: FunctionComponent<{
    items: CartElement[];
    tax?: TaxType;
    shopData: ShopData;
    removeItem: (index: number) => void;
}> = ({ items, tax, shopData, removeItem }) => {
    const [currentCartItem, setCurrentCartItem] = useState<CartElement>(null);
    const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
        id: `droppable_cart_content`,
    });
    const getPrice = useGetPrice();
    const amount = items.reduce((acc, item) => acc + item.amount * item.price, 0);
    const nbLines = Math.max(Math.ceil(items.length / 5), 2);

    return (
        <div className="flex max-h-[30vh] mt-4">
            <div ref={setDroppableNodeRef} className={classNames('max-h-full rounded w-[390px] xl:ml-[94vh]')}>
                <InventoryDiv price={getPrice(amount, tax)} maxHeight="max-h-[20vh]" isCart title="Panier" useGrid>
                    {[...Array(nbLines)].map((_, i) => {
                        return (
                            <Fragment key={i}>
                                {[...Array(5)].map((_, j) => {
                                    const index = i * 5 + j;
                                    const item = items[index] || null;

                                    if (!item) {
                                        return (
                                            <EmptySlot
                                                droppable={false}
                                                key={index}
                                                inventoryId={'shop'}
                                                slot={index}
                                                isOver={isOver}
                                            />
                                        );
                                    }

                                    return (
                                        <CartItem
                                            removeItem={removeItem}
                                            cartItem={item}
                                            index={index}
                                            setCurrentCartItem={setCurrentCartItem}
                                            key={index}
                                            isOver={isOver}
                                        />
                                    );
                                })}
                            </Fragment>
                        );
                    })}
                </InventoryDiv>
                <div className="p-2 flex justify-between items-center w-full text-white">
                    <span></span>
                    <button
                        className="bg-spring-green-500/50 hover:bg-spring-green-500 p-2 rounded text-white"
                        onClick={() => {
                            fetchNui(NuiEvent.InventoryShopValidate, {
                                items: items,
                                tax,
                                moneyType: shopData.moneyType,
                                shopId: shopData.shopId,
                                rpcServerEvent: shopData.rpcServerEvent,
                            });
                        }}
                    >
                        Valider le panier
                    </button>
                </div>
            </div>
            <div
                className="ml-4"
                style={{
                    width: 'fit-content',
                    maxWidth: '36vh',
                }}
            >
                <ItemDescription position="right" inventoryItem={currentCartItem} />
            </div>
        </div>
    );
};

const CartItem: FunctionComponent<{
    cartItem: CartElement;
    index: number;
    setCurrentCartItem: (item: CartElement) => void;
    removeItem: (index: number) => void;
    isOver?: boolean;
}> = ({ cartItem, index, setCurrentCartItem, removeItem, isOver = false }) => {
    const {
        attributes,
        listeners,
        setNodeRef: setDraggableNodeRef,
        isDragging,
    } = useDraggable({
        id: `draggable_cart_item_${index}`,
        data: {
            type: 'cart_item',
            index,
        },
    });

    return (
        <>
            <div
                onMouseEnter={() => setCurrentCartItem(cartItem)}
                onMouseLeave={() => {
                    setCurrentCartItem(null);
                }}
                onDoubleClick={() => {
                    removeItem(index);
                }}
            >
                <GlassMorphismContainer borderClassName="rounded-xl aspect-square" showBorderOnHover={!isOver}>
                    <div
                        ref={setDraggableNodeRef}
                        {...listeners}
                        {...attributes}
                        className={getItemSlotClassnames(isOver)}
                    >
                        <div className="relative">
                            <img className="h-full w-full" src={getItemIcon(cartItem)} alt={cartItem.name} />
                            <div
                                className="absolute text-gray-200 text-xs"
                                style={{
                                    bottom: 0,
                                    right: 0,
                                    margin: '0.1rem 0.2rem',
                                }}
                            >
                                {cartItem.amount > 1 && <>{cartItem.amount}</>}
                            </div>
                        </div>
                    </div>
                </GlassMorphismContainer>
            </div>
            {createPortal(
                <DragOverlay dropAnimation={null}>
                    {isDragging && <img className="absolute z-50" src={getItemIcon(cartItem)} alt={cartItem.name} />}
                </DragOverlay>,
                document.body
            )}
        </>
    );
};

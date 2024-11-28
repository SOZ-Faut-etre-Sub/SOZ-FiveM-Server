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
import { InventoryItem, isSameInventoryItem } from '../../../shared/inventory';
import { AskInput } from '../../../shared/nui/input';
import { RpcServerEvent } from '../../../shared/rpc';
import { ShopContent } from '../../../shared/shop';
import { CartElement, ShopItem } from '../../../shared/shop/superette';
import { fetchNui } from '../../fetch';
import { useKeyPress } from '../../hook/control';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useGetPrice } from '../../hook/price';
import { BorderBox } from '../Styleguide/BorderBox';
import { InventoryDiv } from './Inventory';
import { ItemDescription } from './ItemDescription';
import { EmptySlot, getItemIcon, getItemSlotClassnames } from './ItemSlot';
import { useInventorySize, useItemSize } from './size';

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
    const [currentDescription, setCurrentDescription] = useState<InventoryItem>(null);
    const open = shopContent !== null;
    const inventorySize = useInventorySize(5);

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
                    <div className="flex">
                        <div
                            className="max-h-full wide:ml-[94vh]"
                            style={{
                                width: `${inventorySize.width + 10}px`,
                            }}
                        >
                            <InventoryDiv
                                description={<ItemDescription inventoryItem={currentDescription} position="right" />}
                                title={shopContent.title}
                            >
                                <div
                                    className="overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                                    style={{
                                        width: `${inventorySize.width + 10}px`,
                                        maxHeight: `${inventorySize.maxHeight}px`,
                                    }}
                                >
                                    <div
                                        className="grid grid-cols-5"
                                        style={{
                                            gap: `${inventorySize.gapSize}px`,
                                            width: `${inventorySize.width}px`,
                                        }}
                                    >
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
                                                                setCurrentDescription={setCurrentDescription}
                                                                addItem={addItem}
                                                                index={index}
                                                                item={item}
                                                                key={index}
                                                                tax={shopContent.tax}
                                                                moneyType={shopContent.moneyType}
                                                            />
                                                        );
                                                    })}
                                                </Fragment>
                                            );
                                        })}
                                    </div>
                                </div>
                            </InventoryDiv>
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
    setCurrentDescription: (item: InventoryItem) => void;
    addItem: (item: ShopItem) => Promise<void>;
    moneyType: string | BankMoneyType;
    tax?: TaxType;
}> = ({ index, item, addItem, moneyType, tax, setCurrentDescription }) => {
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
    const itemSize = useItemSize();

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
                style={{
                    width: `${itemSize}px`,
                    height: `${itemSize}px`,
                }}
                onMouseEnter={() =>
                    setCurrentDescription({
                        name: item.name,
                        type: item.type,
                        slot: 0,
                        amount: item.amount || 1,
                        metadata: item.metadata || {},
                    })
                }
                onMouseLeave={() => {
                    setCurrentDescription(null);
                }}
                onDoubleClick={() => {
                    addItem(item);
                }}
            >
                <BorderBox duration="duration-0" borderClassName="rounded-xl aspect-square" showBorderOnHover>
                    <div className={getItemSlotClassnames(false)}>
                        <div ref={setDraggableNodeRef} {...listeners} {...attributes}>
                            <div
                                className="relative"
                                style={{
                                    width: `${itemSize}px`,
                                    height: `${itemSize}px`,
                                }}
                            >
                                <img
                                    className="h-full w-full object-contain"
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
                </BorderBox>
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
    const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
        id: `droppable_cart_content`,
    });
    const [currentDescription, setCurrentDescription] = useState<InventoryItem>(null);
    const getPrice = useGetPrice();
    const inventorySize = useInventorySize(4);
    const amount = items.reduce((acc, item) => acc + item.amount * item.price, 0);
    const nbLines = Math.max(Math.ceil(items.length / 5), 2);

    return (
        <div className="flex max-h-[30vh] mt-4">
            <div
                ref={setDroppableNodeRef}
                className={classNames('max-h-full rounded wide:ml-[94vh]')}
                style={{
                    width: `${inventorySize.width}px`,
                }}
            >
                <InventoryDiv price={getPrice(amount, tax)} isCart title="Panier">
                    <div
                        className="overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                        style={{
                            width: `${inventorySize.width + 10}px`,
                            maxHeight: `${inventorySize.maxHeight}px`,
                        }}
                    >
                        <div
                            className="grid grid-cols-5 w-full max-h-full"
                            style={{
                                gap: `${inventorySize.gapSize}px`,
                                width: `${inventorySize.width}px`,
                            }}
                        >
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
                                                    setCurrentDescription={setCurrentDescription}
                                                    key={index}
                                                    isOver={isOver}
                                                />
                                            );
                                        })}
                                    </Fragment>
                                );
                            })}
                        </div>
                    </div>
                </InventoryDiv>
                <div className="flex px-1 py-2 justify-between items-center w-full text-white">
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
                <ItemDescription inventoryItem={currentDescription} position="right" />
            </div>
        </div>
    );
};

const CartItem: FunctionComponent<{
    cartItem: CartElement;
    index: number;
    setCurrentDescription: (item: InventoryItem) => void;
    removeItem: (index: number) => void;
    isOver?: boolean;
}> = ({ cartItem, index, setCurrentDescription, removeItem, isOver = false }) => {
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
    const itemSize = useItemSize();

    return (
        <>
            <div
                onMouseEnter={() => setCurrentDescription(cartItem)}
                onMouseLeave={() => {
                    setCurrentDescription(null);
                }}
                onDoubleClick={() => {
                    removeItem(index);
                }}
                className="aspect-square"
                style={{
                    width: `${itemSize}px`,
                    height: `${itemSize}px`,
                }}
            >
                <BorderBox duration="duration-0" borderClassName="rounded-xl aspect-square" showBorderOnHover={!isOver}>
                    <div
                        ref={setDraggableNodeRef}
                        {...listeners}
                        {...attributes}
                        className={getItemSlotClassnames(isOver)}
                    >
                        <div
                            className="relative"
                            style={{
                                width: `${itemSize}px`,
                                height: `${itemSize}px`,
                            }}
                        >
                            <img
                                className="h-full w-full object-contain"
                                src={getItemIcon(cartItem)}
                                alt={cartItem.name}
                            />
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
                </BorderBox>
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

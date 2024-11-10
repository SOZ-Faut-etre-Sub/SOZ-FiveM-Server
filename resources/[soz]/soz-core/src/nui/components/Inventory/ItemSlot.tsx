import { DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { FunctionComponent, useState } from 'react';
import { createPortal } from 'react-dom';

import { getItemWeight, InventoryConfiguration, InventoryItem, isItemAllowed } from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { usePlayer } from '../../hook/data';
import { BorderBox } from '../Styleguide/GlassMorphismContainer';
import { ActionItem, getActions } from './Actions';

export const getItemSlotClassnames = (isOver: boolean) => {
    return classNames('cursor-pointer aspect-square flex justify-center items-center text-white', {
        'bg-white/10': isOver,
    });
};

type ItemSlotProps = {
    inventoryId: string;
    prefixId?: string;
    inventoryItem: InventoryItem | 'money' | 'wallet' | 'keychain' | null;
    targetConfiguration?: InventoryConfiguration;
    item: Item | null;
    slot: number;
    setCurrentInventoryItem: (item: InventoryItem) => void;
    resolver: (id: string) => Item | null;
    showWeight?: boolean;
    allowActions?: boolean;
    allowForceConsume?: boolean;
    allowHidden?: boolean;
    onDoubleClick?: (inventoryItem: InventoryItem | 'money' | 'wallet' | 'keychain' | null, item?: Item | null) => void;
};

export const ItemSlot: FunctionComponent<ItemSlotProps> = ({
    inventoryId,
    prefixId,
    inventoryItem,
    targetConfiguration,
    item,
    slot,
    setCurrentInventoryItem,
    resolver,
    allowActions = false,
    showWeight = false,
    allowForceConsume = false,
    allowHidden = false,
    onDoubleClick,
}) => {
    const hidden =
        allowHidden &&
        (item?.notSearchable || (inventoryItem instanceof Object && inventoryItem.metadata?.notSearchable));
    const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
        id: `${prefixId}droppable_${inventoryId}_${slot}`,
        data: { inventoryId, slot, type: 'inventoryItem' },
        disabled: hidden,
    });
    const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0 });
    const playerData = usePlayer();
    const [imageSrc, setImageSrc] = useState<string | null>(inventoryItem ? getItemIcon(inventoryItem) : null);
    const disabled =
        hidden ||
        (targetConfiguration &&
            inventoryItem instanceof Object &&
            !isItemAllowed(inventoryItem.type, inventoryItem.name, targetConfiguration));

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableNodeRef,
        isDragging,
    } = useDraggable({
        id: `${prefixId}draggable_${inventoryId}_${slot}`,
        data: { inventoryId, slot, inventoryItem, item, type: 'inventoryItem' },
        disabled,
    });

    if (!inventoryItem || hidden) {
        return (
            <div className="aspect-square w-[70px] h-[70px]">
                <BorderBox duration="duration-0" borderClassName="rounded-xl aspect-square" showBorderOnHover={!isOver}>
                    <div ref={setDroppableNodeRef} className={getItemSlotClassnames(isOver)}></div>
                </BorderBox>
            </div>
        );
    }

    const actions =
        allowActions || allowForceConsume ? getActions(inventoryItem, item, allowForceConsume, playerData) : [];

    return (
        <>
            <div
                className="aspect-square w-[70px] h-[70px] relative"
                onMouseEnter={() => {
                    if (inventoryItem instanceof Object) {
                        setCurrentInventoryItem(inventoryItem);
                    }
                }}
                onMouseLeave={() => {
                    setCurrentInventoryItem(null);

                    if (contextData.visible) {
                        setContextData({
                            visible: false,
                            posX: 0,
                            posY: 0,
                        });
                    }
                }}
                onContextMenu={event => {
                    if (inventoryItem && !disabled) {
                        setContextData({
                            visible: true,
                            posX: event.screenX,
                            posY: event.screenY,
                        });
                    }
                }}
            >
                <BorderBox duration="duration-0" borderClassName="rounded-xl aspect-square" showBorderOnHover={!isOver}>
                    <div
                        ref={!disabled && slot > 0 ? setDroppableNodeRef : null}
                        onDoubleClick={() => {
                            !disabled && onDoubleClick && onDoubleClick(inventoryItem, item);
                        }}
                        className={getItemSlotClassnames(isOver)}
                    >
                        <div ref={disabled ? null : setDraggableNodeRef} {...listeners} {...attributes}>
                            <div
                                className={classNames('relative', {
                                    grayscale: disabled,
                                    'opacity-70': disabled,
                                })}
                            >
                                <img
                                    className="aspect-square"
                                    src={imageSrc}
                                    onError={() => {
                                        setImageSrc('https://cfx-nui-soz-core/public/images/default/cat.webp');
                                    }}
                                    alt="Name"
                                />
                                {showWeight && (
                                    <div
                                        className="absolute text-gray-200 text-xs"
                                        style={{
                                            bottom: 0,
                                            left: 0,
                                            margin: '0.1rem 0.2rem',
                                        }}
                                    >
                                        {inventoryItem && inventoryItem instanceof Object && (
                                            <>
                                                {getItemWeight(
                                                    inventoryItem.name,
                                                    inventoryItem.amount,
                                                    resolver,
                                                    inventoryItem.metadata
                                                ) / 1000}{' '}
                                                kg
                                            </>
                                        )}
                                    </div>
                                )}
                                {inventoryItem === 'money' && (
                                    <div
                                        className="absolute text-gray-200 text-[0.78rem]"
                                        style={{
                                            bottom: 0,
                                            right: 0,
                                            margin: '0.1rem 0.2rem',
                                        }}
                                    >
                                        {playerData?.money.money + playerData?.money.marked_money}$
                                    </div>
                                )}
                                {inventoryItem === 'wallet' && (
                                    <div
                                        className="absolute text-gray-200 text-[0.75rem]"
                                        style={{
                                            bottom: 0,
                                            right: 0,
                                            margin: '0.1rem 0.2rem',
                                        }}
                                    >
                                        Portefeuille
                                    </div>
                                )}
                                {inventoryItem === 'keychain' && (
                                    <div
                                        className="absolute text-gray-200 text-[0.75rem]"
                                        style={{
                                            bottom: 0,
                                            right: 0,
                                            margin: '0.1rem 0.2rem',
                                        }}
                                    >
                                        Porte-clés
                                    </div>
                                )}
                                {inventoryItem && inventoryItem instanceof Object && (
                                    <div
                                        className="absolute text-gray-200 text-[0.78rem]"
                                        style={{
                                            bottom: 0,
                                            right: 0,
                                            margin: '0.1rem 0.2rem',
                                        }}
                                    >
                                        {inventoryItem.amount > 1 && <>{inventoryItem.amount}</>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </BorderBox>
                {(allowActions || allowForceConsume) &&
                    createPortal(
                        <div
                            className="font-prompt absolute text-white rounded p-2 h-auto w-fit flex flex-col justify-center items-center bg-black/80"
                            style={{
                                left: contextData.posX,
                                top: contextData.posY,
                                zIndex: 1000,
                                display: contextData.visible ? 'block' : 'none',
                            }}
                        >
                            {actions.map((action, index) => {
                                return (
                                    <ActionItem
                                        key={index}
                                        action={action}
                                        inventoryId={inventoryId}
                                        inventoryItem={inventoryItem}
                                        item={item}
                                    />
                                );
                            })}
                        </div>,
                        document.body
                    )}
            </div>
            {createPortal(
                <DragOverlay dropAnimation={null}>
                    {isDragging && <img className="absolute z-50" src={imageSrc} alt={item?.label} />}
                </DragOverlay>,
                document.body
            )}
        </>
    );
};

type EmptySlotProps = {
    slot?: number;
    droppable?: boolean;
    inventoryId: string;
    prefixId?: string;
    isOver?: boolean;
};

export const EmptySlot: FunctionComponent<EmptySlotProps> = ({
    slot,
    inventoryId,
    droppable = true,
    prefixId,
    isOver = false,
}) => {
    const { isOver: isItemOver, setNodeRef: setDroppableNodeRef } = useDroppable({
        id: `${prefixId}droppable_${inventoryId}_${slot}`,
        data: { inventoryId, slot, type: 'inventoryItem' },
    });

    return (
        <div className="aspect-square w-[70px] h-[70px]">
            <BorderBox duration="duration-0" borderClassName="rounded-xl aspect-square" showBorderOnHover={!isOver}>
                <div
                    ref={droppable ? setDroppableNodeRef : null}
                    className={getItemSlotClassnames(isOver || isItemOver)}
                ></div>
            </BorderBox>
        </div>
    );
};

type ItemIconProps = {
    name: string;
    metadata?: {
        type?: string;
        tier?: number;
    };
};

export const getItemIcon = (inventoryItem: ItemIconProps | 'money' | 'keychain' | 'wallet'): string => {
    if (inventoryItem === 'money') {
        return `https://cfx-nui-soz-core/public/images/inventory/icon/money.webp`;
    }

    if (inventoryItem === 'keychain') {
        return `https://cfx-nui-soz-core/public/images/inventory/icon/keychain.webp`;
    }

    if (inventoryItem === 'wallet') {
        return `https://cfx-nui-soz-core/public/images/inventory/icon/wallet.webp`;
    }

    let path = inventoryItem.name;

    if (inventoryItem.name === 'vehicle_key') {
        return `https://cfx-nui-soz-core/public/images/inventory/icon/vehicle_key.webp`;
    }
    if (inventoryItem.name === 'apartment_key') {
        return `https://cfx-nui-soz-core/public/images/inventory/icon/apartment_key.webp`;
    }
    if (inventoryItem.name === 'health') {
        return `https://cfx-nui-soz-core/public/images/inventory/icon/health.webp`;
    }
    if (inventoryItem.name === 'license') {
        return `https://cfx-nui-soz-core/public/images/inventory/icon/license.webp`;
    }
    if (inventoryItem.name === 'identity') {
        return `https://cfx-nui-soz-core/public/images/inventory/icon/identity.webp`;
    }
    if (inventoryItem.name === 'bank') {
        return `https://cfx-nui-soz-core/public/images/inventory/icon/bank.webp`;
    }

    // if inventoryItem is an InventoryItem
    if ((inventoryItem.name === 'outfit' || inventoryItem.name === 'armor') && inventoryItem.metadata?.type) {
        path += `_${inventoryItem.metadata?.type}`;
    } else if (inventoryItem.name === 'cabinet_zkea') {
        path += `_${inventoryItem.metadata?.tier}`;
    }

    return `https://cfx-nui-soz-core/public/images/items/${path}.webp`;
};

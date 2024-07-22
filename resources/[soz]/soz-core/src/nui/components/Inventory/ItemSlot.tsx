import { DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';
import { FunctionComponent, useState } from 'react';
import { createPortal } from 'react-dom';

import { NuiEvent } from '../../../shared/event/nui';
import { getItemWeight, InventoryConfiguration, InventoryItem, isItemAllowed } from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { ActionItem, getActions } from './Actions';

export const getItemSlotClassnames = (isOver: boolean) => {
    return classNames(
        'cursor-pointer rounded border border-gray-900/25 aspect-square flex justify-center items-center text-white',
        {
            'bg-black/20 hover:bg-green-500/10': !isOver,
            'bg-white/10': isOver,
        }
    );
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
    allowShortcuts?: boolean;
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
    allowShortcuts = false,
    allowForceConsume = false,
    allowHidden = false,
    onDoubleClick,
}) => {
    const hidden =
        allowHidden &&
        (item?.notSearchable || (inventoryItem instanceof Object && inventoryItem.metadata?.notSearchable));
    const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
        id: `${prefixId}droppable_${inventoryId}_${slot}`,
        data: { inventoryId, slot },
        disabled: hidden,
    });
    const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0 });
    const playerData = usePlayer();
    const disabled =
        hidden ||
        (targetConfiguration &&
            inventoryItem instanceof Object &&
            !isItemAllowed(inventoryItem.type, inventoryItem.name, targetConfiguration));

    const shortcutStr = playerData
        ? Object.keys(playerData.metadata.shortcuts || {}).find(shortcutStr => {
              const shortcutData = playerData.metadata.shortcuts[shortcutStr] || null;

              if (!shortcutData) {
                  return false;
              }

              if (!inventoryItem || !(inventoryItem instanceof Object)) {
                  return false;
              }

              if (shortcutData.name === inventoryItem?.name && inventoryItem.type !== 'weapon') {
                  return true;
              }

              if (
                  shortcutData.name === inventoryItem?.name &&
                  inventoryItem.type === 'weapon' &&
                  shortcutData.metadata.serial === inventoryItem.metadata.serial
              ) {
                  return true;
              }

              return false;
          })
        : null;

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableNodeRef,
        isDragging,
    } = useDraggable({
        id: `${prefixId}draggable_${inventoryId}_${slot}`,
        data: { inventoryId, slot, inventoryItem, item },
        disabled,
    });

    if (!inventoryItem || hidden) {
        return <div ref={setDroppableNodeRef} className={getItemSlotClassnames(isOver)}></div>;
    }

    const actions = allowActions ? getActions(inventoryItem, item, allowForceConsume) : [];

    return (
        <>
            <div
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
                            posX: event.clientX,
                            posY: event.clientY,
                        });
                    }
                }}
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
                        <img className="aspect-square" src={getItemIcon(inventoryItem)} alt="Name" />
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
                        {shortcutStr && allowShortcuts && (
                            <div
                                className="absolute bg-gray-500 rounded text-gray-200 text-xs"
                                style={{
                                    top: 0,
                                    right: 0,
                                    margin: '0.1rem 0.2rem',
                                    padding: '0.1rem 0.3rem',
                                }}
                            >
                                {shortcutStr}
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
                {allowActions && (
                    <div
                        className="fixed rounded p-2 h-auto w-fit flex flex-col justify-center items-center bg-black/80"
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
                        {shortcutStr && inventoryItem instanceof Object && (
                            <div
                                onClick={() => {
                                    fetchNui(NuiEvent.InventorySetShortcut, {
                                        slot: inventoryItem.slot,
                                        shortcut: null,
                                    });
                                }}
                                className="p-1 rounded hover:bg-white/15"
                            >
                                Supprimer raccourci
                            </div>
                        )}
                        {allowShortcuts &&
                            inventoryItem instanceof Object &&
                            item &&
                            item.useable &&
                            inventoryItem.type !== 'weapon' && (
                                <div className="p-1 flex rounded">
                                    {[...Array(7)].map((_, index) => {
                                        return (
                                            <div
                                                onClick={() => {
                                                    fetchNui(NuiEvent.InventorySetShortcut, {
                                                        slot: inventoryItem.slot,
                                                        shortcut: index + 3,
                                                    });
                                                }}
                                                className="px-1 mr-1 rounded bg-white/15 hover:bg-white/40"
                                                key={index}
                                            >
                                                {index + 3}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                    </div>
                )}
            </div>
            {createPortal(
                <DragOverlay dropAnimation={null}>
                    {isDragging && <img className="absolute z-50" src={getItemIcon(inventoryItem)} alt={item?.label} />}
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
};

export const EmptySlot: FunctionComponent<EmptySlotProps> = ({ slot, inventoryId, droppable = true, prefixId }) => {
    const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
        id: `${prefixId}droppable_${inventoryId}_${slot}`,
        data: { inventoryId, slot },
    });

    return <div ref={droppable ? setDroppableNodeRef : null} className={getItemSlotClassnames(isOver)}></div>;
};

export const getItemIcon = (inventoryItem: InventoryItem | 'money' | 'keychain' | 'wallet'): string => {
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

    if ((inventoryItem.name === 'outfit' || inventoryItem.name === 'armor') && inventoryItem.metadata?.type) {
        path += `_${inventoryItem.metadata?.type}`;
    } else if (inventoryItem.name === 'cabinet_zkea') {
        path += `_${inventoryItem.metadata?.tier}`;
    }

    return `https://cfx-nui-soz-core/public/images/items/${path}.webp`;
};

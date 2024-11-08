import {
    DndContext,
    DragOverlay,
    MouseSensor,
    rectIntersection,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { DrugSkill } from '@private/shared/drugs';
import classNames from 'classnames';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { NuiEvent } from '../../../shared/event/nui';
import { InventoryItem } from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { fetchNui } from '../../fetch';
import { useKeyPress } from '../../hook/control';
import { useItemResolver, usePlayer, usePlayerInventoryConfiguration, usePlayerInventoryItems } from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { BorderBox, GameCanvasBox } from '../Styleguide/GlassMorphismContainer';
import { createHandleDragAndDrop } from './Actions';
import { Inventory } from './Inventory';
import { getItemIcon, getItemSlotClassnames } from './ItemSlot';

export const PlayerInventoryApp: FunctionComponent = () => {
    const [open, setOpen] = useState(false);
    const inventoryItems = usePlayerInventoryItems();
    const configuration = usePlayerInventoryConfiguration();
    const player = usePlayer();

    useNuiEvent('inventory', 'SetOpen', open => {
        setOpen(open);
    });

    useNuiFocus(open, open, false);
    useKeyPress('Escape', () => {
        setOpen(false);
    });

    useKeyPress('F2', () => {
        setOpen(false);
    });

    useKeyPress('Backspace', () => {
        setOpen(false);
    });

    useEffect(() => {
        fetchNui(NuiEvent.InventoryOpenPlayerInventory, { isOpen: open });
    }, [open]);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const sensors = useSensors(mouseSensor);

    const onDoubleClick = useCallback(
        (inventoryItem: InventoryItem | 'money' | 'wallet' | 'keychain' | null, item?: Item | null) => {
            if (inventoryItem === 'money') {
                return fetchNui(NuiEvent.InventoryActionGiveMoney, {
                    mode: 'closest',
                    money: 'money',
                });
            }

            if (inventoryItem === 'wallet') {
                return fetchNui(NuiEvent.InventoryActionOpenWallet);
            }

            if (inventoryItem === 'keychain') {
                return fetchNui(NuiEvent.InventoryActionOpenKeychain);
            }

            if (item && item.useable) {
                fetchNui(NuiEvent.InventoryActionUse, {
                    inventoryId: `player_${player?.citizenid}`,
                    inventoryItem,
                });
            }

            if (item && item.type === 'fish' && player.metadata.drugs_skills.includes(DrugSkill.Zoologiste)) {
                fetchNui(NuiEvent.InventoryActionUse, {
                    inventoryId: `player_${player?.citizenid}`,
                    inventoryItem,
                });
            }
        },
        [player]
    );

    if (!open || !player) {
        return null;
    }

    return (
        <DndContext
            autoScroll={{
                enabled: false,
            }}
            collisionDetection={rectIntersection}
            onDragEnd={createHandleDragAndDrop(true)}
            sensors={sensors}
        >
            <div className="z-10 absolute h-full w-full font-prompt">
                <main className="m-8 w-[400px] wide:ml-[94vh]">
                    <Inventory
                        title="Inventaire"
                        configuration={configuration}
                        inventoryItems={inventoryItems}
                        inventoryId={`player_${player?.citizenid}`}
                        player
                        onDoubleClick={onDoubleClick}
                        itemDescriptionPosition="right"
                    />
                    <div className="w-full">
                        <header className="relative w-full">
                            <div className="drop-shadow-bg h-[40px] flex w-full justify-between items-center">
                                <h1 className="font-semibold uppercase text-white text-2xl">Raccourcis</h1>
                            </div>
                        </header>
                        <div className="relative w-full">
                            <div
                                className={classNames(
                                    'overflow-visible w-[390px] scrollbar scrollbar-w-1 scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'
                                )}
                            >
                                <GameCanvasBox blur={false}>
                                    <div className="grid grid-cols-5 gap-[10px]">
                                        {[...Array(10).keys()].map(index => {
                                            return (
                                                <ShortcutSlot
                                                    inventoryItems={inventoryItems}
                                                    key={index}
                                                    shortcut={index + 1}
                                                />
                                            );
                                        })}
                                    </div>
                                </GameCanvasBox>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DndContext>
    );
};

type ShortcutSlotProps = {
    inventoryItems: Record<number, InventoryItem>;
    shortcut: number;
};

const ShortcutSlot: FunctionComponent<ShortcutSlotProps> = ({ shortcut, inventoryItems }) => {
    const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
        id: `shortcut_${shortcut}`,
        data: {
            type: 'shortcut',
            shortcut,
        },
    });
    const player = usePlayer();
    const resolver = useItemResolver();

    const shortcutData = player.metadata.shortcuts[shortcut % 10] || null;
    const item = shortcutData ? resolver(shortcutData.name) : null;
    const hasItem = item && Object.values(inventoryItems).some(inventoryItem => inventoryItem.name === item?.name);

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableNodeRef,
        isDragging,
    } = useDraggable({
        id: `shortcut_${shortcut}`,
        data: {
            type: 'shortcut',
            shortcut,
        },
    });

    const [imageSrc, setImageSrc] = useState<string | null>(shortcutData ? getItemIcon(shortcutData) : null);

    useEffect(() => {
        if (shortcutData) {
            setImageSrc(getItemIcon(shortcutData));
        }
    }, [shortcutData]);

    return (
        <>
            <div className="aspect-square w-[70px] h-[70px]">
                <BorderBox duration="duration-0" borderClassName="rounded-xl aspect-square" showBorderOnHover={!isOver}>
                    <div ref={setDroppableNodeRef} className={getItemSlotClassnames(isOver)}>
                        {item && (
                            <div ref={setDraggableNodeRef} {...listeners} {...attributes}>
                                <img
                                    className={classNames('aspect-square', {
                                        grayscale: !hasItem,
                                        'opacity-70': !hasItem,
                                    })}
                                    src={imageSrc}
                                    onError={() => {
                                        setImageSrc('https://loremflickr.com/70/70');
                                    }}
                                    alt="Name"
                                />
                            </div>
                        )}
                    </div>
                    <div
                        className="drop-shadow-bg text-white font-prompt absolute"
                        style={{
                            top: 0,
                            right: 0,
                            margin: '0.1rem 0.2rem',
                            padding: '0.1rem 0.3rem',
                        }}
                    >
                        {shortcut === 10 ? '0' : shortcut}
                    </div>
                </BorderBox>
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

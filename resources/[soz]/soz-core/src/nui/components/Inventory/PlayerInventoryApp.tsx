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
import { animated, useTransition } from '@react-spring/web';
import classNames from 'classnames';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { NuiEvent } from '../../../shared/event/nui';
import { InventoryItem } from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { fetchNui } from '../../fetch';
import { useAssetPath } from '../../hook/assets';
import { useKeyPress } from '../../hook/control';
import {
    useItemResolver,
    usePlayer,
    usePlayerClothingInventoryItems,
    usePlayerInventoryConfiguration,
    usePlayerInventoryItems,
} from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { BorderBox } from '../Styleguide/BorderBox';
import { GameCanvasBox } from '../Styleguide/GameCanvasBox';
import { createHandleDragAndDrop } from './Actions';
import { Inventory } from './Inventory';
import { getItemIcon, getItemSlotClassnames } from './ItemSlot';
import PlayerClothingPanel from './PlayerClothingPanel';
import { useInventorySize, useItemSize } from './size';

export const PlayerInventoryApp: FunctionComponent = () => {
    const [open, setOpen] = useState(false);
    const [isPlayerClothingInventoryOpened, setIsPlayerClothingInventoryOpened] = useState(false);
    const inventoryItems = usePlayerInventoryItems();
    const clothingItems = usePlayerClothingInventoryItems();
    const configuration = usePlayerInventoryConfiguration();
    const player = usePlayer();
    const inventorySize = useInventorySize(6);
    const { getPath } = useAssetPath();

    useNuiEvent('inventory', 'SetOpen', open => {
        setOpen(open);
        if (!open) {
            setIsPlayerClothingInventoryOpened(false);
        }
    });

    useNuiFocus(open, open, open, null, open);
    useKeyPress('Escape', () => {
        setOpen(false);
        setIsPlayerClothingInventoryOpened(false);
    });

    useKeyPress('Backspace', () => {
        setOpen(false);
        setIsPlayerClothingInventoryOpened(false);
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

            if (item && (item.useable || item.type === 'weapon')) {
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

    const transitions = useTransition(isPlayerClothingInventoryOpened, {
        from: { transform: 'translateX(-50%) rotateY(90deg)', opacity: 0 },
        enter: { transform: 'translateX(0%) rotateY(0deg)', opacity: 1 },
        leave: { transform: 'translateX(-50%) rotateY(90deg)', opacity: 0 },
    });

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
            <div className="z-10 absolute h-full w-full font-prompt flex">
                <main
                    className="m-8 wide:ml-[94vh] flex flex-col"
                    style={{
                        width: `${inventorySize.width + 10}px`,
                    }}
                >
                    <Inventory
                        title="Inventaire"
                        configuration={configuration}
                        inventoryItems={inventoryItems}
                        inventoryId={`player_${player?.citizenid}`}
                        player
                        onDoubleClick={onDoubleClick}
                        itemDescriptionPosition="right"
                        headerRightTitle={
                            <div className="flex items-center">
                                <span>Vêtements</span>
                                <img className="h-5 pl-2" src={getPath('images/inventory/icon/cloth.webp')} />
                            </div>
                        }
                        headerRightClick={() => setIsPlayerClothingInventoryOpened(prev => !prev)}
                    />
                    <div className="relative w-full mt-4">
                        <header className="w-full">
                            <div className="drop-shadow-bg h-[40px] flex w-full justify-between items-center">
                                <h1 className="font-semibold uppercase text-white text-2xl">Raccourcis</h1>
                            </div>
                        </header>
                        <GameCanvasBox blur={false} cantBeHidden>
                            <div
                                className={classNames(
                                    'overflow-y-scroll scrollbar scrollbar-w-[5px] scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'
                                )}
                                style={{
                                    width: `${inventorySize.width + 10}px`,
                                }}
                            >
                                <div
                                    className="grid grid-cols-5 gap-[10px]"
                                    style={{
                                        gap: `${inventorySize.gapSize}px`,
                                        width: `${inventorySize.width}px`,
                                    }}
                                >
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
                            </div>
                        </GameCanvasBox>
                    </div>
                </main>

                {transitions((styles, item) => {
                    if (!item) return null;

                    return (
                        <animated.main
                            className="m-8 flex flex-col"
                            style={{
                                ...styles,
                                width: `${inventorySize.width + 10}px`,
                            }}
                        >
                            <PlayerClothingPanel
                                title="Vêtements"
                                configuration={configuration}
                                inventoryItems={clothingItems}
                                inventoryId={`player_clothing_${player?.citizenid}`}
                                onDoubleClick={onDoubleClick}
                            />
                        </animated.main>
                    );
                })}
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
    const { getPath } = useAssetPath();

    const shortcutData = player.metadata.shortcuts[shortcut % 10] || null;
    const item = shortcutData ? resolver(shortcutData.name) : null;
    const hasItem =
        item &&
        Object.values(inventoryItems).some(
            inventoryItem =>
                inventoryItem.name === shortcutData?.name &&
                inventoryItem.metadata?.type === shortcutData?.metadata?.type &&
                inventoryItem.metadata?.serial === shortcutData?.metadata?.serial
        );

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

    const [imageSrc, setImageSrc] = useState<string | null>(
        shortcutData ? getPath(getItemIcon(player, shortcutData)) : null
    );

    useEffect(() => {
        if (shortcutData) {
            setImageSrc(getPath(getItemIcon(player, shortcutData)));
        }
    }, [shortcutData]);
    const itemSize = useItemSize();

    return (
        <>
            <div
                className="aspect-square"
                style={{
                    width: `${itemSize}px`,
                    height: `${itemSize}px`,
                }}
            >
                <BorderBox duration="duration-0" borderClassName="rounded-xl aspect-square" showBorderOnHover={!isOver}>
                    <div
                        ref={setDroppableNodeRef}
                        className={getItemSlotClassnames(isOver)}
                        style={{
                            width: `${itemSize}px`,
                            height: `${itemSize}px`,
                        }}
                    >
                        {item && (
                            <div ref={setDraggableNodeRef} {...listeners} {...attributes}>
                                <img
                                    className={classNames('aspect-square', {
                                        grayscale: !hasItem,
                                        'opacity-70': !hasItem,
                                    })}
                                    src={imageSrc}
                                    onError={() => {
                                        setImageSrc(getPath('images/default/cat.webp'));
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

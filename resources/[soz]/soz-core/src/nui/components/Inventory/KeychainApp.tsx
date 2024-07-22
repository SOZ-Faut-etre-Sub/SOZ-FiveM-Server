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
import { FunctionComponent, useState } from 'react';
import { createPortal } from 'react-dom';

import { NuiEvent } from '../../../shared/event/nui';
import { InventoryKey } from '../../../shared/inventory';
import { fetchNui } from '../../fetch';
import { useKeyPress } from '../../hook/control';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { InventoryDiv } from './Inventory';
import { getItemSlotClassnames } from './ItemSlot';

export const KeychainApp: FunctionComponent = () => {
    const [keys, setKeys] = useState<InventoryKey[]>(null);
    const open = keys !== null;
    const [currentKey, setCurrentKey] = useState<InventoryKey>(null);

    useNuiEvent('inventory', 'OpenKeychain', ({ keys }) => {
        setKeys(keys);
    });

    useNuiEvent('inventory', 'CloseKeychain', () => {
        setKeys(null);
    });

    useNuiFocus(open, open, false);
    useKeyPress('Escape', () => {
        setKeys(null);
    });
    useKeyPress('Backspace', () => {
        fetchNui(NuiEvent.InventoryGoBackPlayerInventory);
        setKeys(null);
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

    return (
        <DndContext
            sensors={sensors}
            autoScroll={{
                enabled: false,
            }}
            collisionDetection={rectIntersection}
            onDragEnd={(event: DragEndEvent) => {
                if (!event.active.data.current) {
                    return;
                }

                const key = event.active.data.current as InventoryKey;

                fetchNui(NuiEvent.InventoryActionGiveKey, {
                    keys: [key],
                    mode: 'screen',
                });
            }}
        >
            <div className="absolute h-full w-full">
                <main className="m-8 h-[45vh] w-[36vh] xl:ml-[94vh]">
                    <InventoryDiv
                        banner="/public/images/inventory/banner/keychain_banner.webp"
                        giveKeysCallback={type => {
                            if (type === 'vehicle') {
                                fetchNui(NuiEvent.InventoryActionGiveKey, {
                                    keys: [keys.filter(key => key.type === 'vehicle')],
                                    mode: 'closest',
                                });
                            }
                            if (type === 'apartment') {
                                fetchNui(NuiEvent.InventoryActionGiveKey, {
                                    keys: [keys.filter(key => key.type === 'apartment')],
                                    mode: 'closest',
                                });
                            }
                        }}
                    >
                        {keys.map((key, index) => (
                            <KeychainItem key={index} index={index} inventoryKey={key} setCurrentKey={setCurrentKey} />
                        ))}
                    </InventoryDiv>
                    {currentKey && (
                        <div className="p-2 mt-2 rounded text-gray-100 bg-black/60 w-full">
                            <div className="flex justify-between align-items-center w-full">
                                <strong>
                                    {currentKey.type === 'vehicle'
                                        ? `Véhicule ${currentKey.plate}`
                                        : `Appartement ${currentKey.label}`}
                                </strong>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </DndContext>
    );
};

const KeychainItem: FunctionComponent<{
    inventoryKey: InventoryKey;
    index: number;
    setCurrentKey: (key: InventoryKey) => void;
}> = ({ inventoryKey, index, setCurrentKey }) => {
    const { setNodeRef: setDroppableNodeRef } = useDroppable({
        id: `droppable_key_${index}`,
        data: inventoryKey,
    });
    const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0 });

    const {
        attributes,
        listeners,
        setNodeRef: setDraggableNodeRef,
        isDragging,
    } = useDraggable({
        id: `draggable_key_${index}`,
        data: inventoryKey,
    });

    const imgSrc =
        inventoryKey.type === 'vehicle'
            ? `https://cfx-nui-soz-core/public/images/inventory/icon/vehicle_key.webp`
            : `https://cfx-nui-soz-core/public/images/inventory/icon/apartment_key.webp`;

    return (
        <>
            <div
                onContextMenu={event => {
                    setContextData({
                        visible: true,
                        posX: event.clientX,
                        posY: event.clientY,
                    });
                }}
                ref={setDroppableNodeRef}
                onMouseEnter={() => setCurrentKey(inventoryKey)}
                onMouseLeave={() => {
                    setCurrentKey(null);
                    setContextData({ visible: false, posX: 0, posY: 0 });
                }}
                className={getItemSlotClassnames(false)}
            >
                <div ref={setDraggableNodeRef} {...listeners} {...attributes}>
                    <div className="relative">
                        <img className="h-full w-full" src={imgSrc} alt={inventoryKey.type} />
                    </div>
                </div>
                <div
                    className="fixed rounded p-2 h-auto w-fit flex flex-col justify-center items-center bg-black/80"
                    style={{
                        left: contextData.posX,
                        top: contextData.posY,
                        zIndex: 1000,
                        display: contextData.visible ? 'block' : 'none',
                    }}
                >
                    <div
                        onClick={() =>
                            fetchNui(NuiEvent.InventoryActionGiveKey, {
                                keys: [inventoryKey],
                                mode: 'closest',
                            })
                        }
                        className="p-1 rounded hover:bg-white/15"
                    >
                        Donner
                    </div>
                </div>
            </div>
            {createPortal(
                <DragOverlay dropAnimation={null}>
                    {isDragging && <img className="absolute z-50" src={imgSrc} alt={inventoryKey.type} />}
                </DragOverlay>,
                document.body
            )}
        </>
    );
};

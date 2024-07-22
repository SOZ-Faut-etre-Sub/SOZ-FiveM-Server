import { DndContext, MouseSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { InventoryItem } from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { fetchNui } from '../../fetch';
import { useKeyPress } from '../../hook/control';
import { usePlayer, usePlayerInventoryConfiguration, usePlayerInventoryItems } from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { createHandleDragAndDrop } from './Actions';
import { Inventory } from './Inventory';

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

    if (!open) {
        return null;
    }

    const onDoubleClick = (
        inventoryItem: InventoryItem | 'money' | 'wallet' | 'keychain' | null,
        item?: Item | null
    ) => {
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
    };

    return (
        <DndContext
            autoScroll={{
                enabled: false,
            }}
            collisionDetection={rectIntersection}
            onDragEnd={createHandleDragAndDrop(true)}
            sensors={sensors}
        >
            <div className="absolute h-full w-full">
                <main className="m-8 h-[45vh] w-[36vh] xl:ml-[94vh]">
                    <Inventory
                        banner="/public/images/inventory/banner/inventory_banner.webp"
                        configuration={configuration}
                        inventoryItems={inventoryItems}
                        inventoryId={`player_${player?.citizenid}`}
                        player
                        onDoubleClick={onDoubleClick}
                    />
                </main>
            </div>
        </DndContext>
    );
};

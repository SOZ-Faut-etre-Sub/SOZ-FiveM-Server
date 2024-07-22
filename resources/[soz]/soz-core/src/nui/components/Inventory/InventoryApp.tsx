import { DndContext, MouseSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { InventoryConfiguration, InventoryItem, InventoryType } from '../../../shared/inventory';
import { fetchNui } from '../../fetch';
import { useKeyPress } from '../../hook/control';
import { usePlayer, usePlayerInventoryConfiguration, usePlayerInventoryItems } from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { createHandleDragAndDrop } from './Actions';
import { Inventory } from './Inventory';

export const InventoryApp: FunctionComponent = () => {
    const playerInventoryItems = usePlayerInventoryItems();
    const playerInventoryConfiguration = usePlayerInventoryConfiguration();
    const player = usePlayer();
    const [inventoryId, setInventoryId] = useState<string>(null);
    const [inventoryItems, setInventoryItems] = useState<Record<number, InventoryItem>>(null);
    const [configuration, setConfiguration] = useState<InventoryConfiguration>(null);
    const [type, setType] = useState<InventoryType>(null);
    const open = inventoryId !== null;

    useNuiEvent('inventory', 'OpenInventory', ({ id, configuration, type, items }) => {
        setInventoryId(id);
        setConfiguration(configuration);
        setType(type);
        setInventoryItems(items);
    });

    useNuiEvent('inventory', 'CloseInventory', () => {
        setInventoryId(null);
        setConfiguration(null);
        setInventoryItems(null);
        setType(null);
    });

    useNuiEvent('inventory', 'UpdateInventory', ({ id, configuration, items }) => {
        if (inventoryId === id) {
            setInventoryItems(items);
            setConfiguration(configuration);
        }
    });

    useNuiFocus(open, open, false);
    useKeyPress('Escape', () => {
        if (inventoryId) {
            setInventoryId(null);
        }
    });

    useKeyPress('Backspace', () => {
        if (inventoryId) {
            setInventoryId(null);
        }
    });

    useEffect(() => {
        if (!open) {
            fetchNui(NuiEvent.InventoryClose);
        }
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

    return (
        <DndContext
            autoScroll={{
                enabled: false,
            }}
            collisionDetection={rectIntersection}
            onDragEnd={createHandleDragAndDrop(false)}
            sensors={sensors}
        >
            <main className="absolute h-full w-full">
                <div className="flex mt-8 justify-center">
                    <div className="mr-4 max-h-[50vh] w-[36vh]">
                        <Inventory
                            thin
                            banner="/public/images/inventory/banner/player.webp"
                            configuration={playerInventoryConfiguration}
                            targetConfiguration={configuration}
                            inventoryItems={playerInventoryItems}
                            inventoryId={`player_${player?.citizenid}`}
                            prefixId="source_"
                            player
                            onDoubleClick={inventoryItem => {
                                if (inventoryItem === null || !(inventoryItem instanceof Object)) {
                                    return;
                                }

                                fetchNui(NuiEvent.InventoryMoveItem, {
                                    sourceInventoryId: `player_${player?.citizenid}`,
                                    sourceSlot: inventoryItem.slot,
                                    targetInventoryId: inventoryId,
                                    targetSlot: null,
                                    sourceAmount: inventoryItem.amount,
                                    modifier: null,
                                });
                            }}
                        />
                    </div>
                    <div
                        className="ml-4"
                        style={{
                            maxHeight: '50vh',
                            width: '36vh',
                        }}
                    >
                        <Inventory
                            thin
                            banner={getInventoryBanner(type)}
                            configuration={configuration}
                            targetConfiguration={playerInventoryConfiguration}
                            inventoryItems={inventoryItems}
                            inventoryId={inventoryId}
                            prefixId="target_"
                            allowForceConsume={type === InventoryType.Player}
                            onDoubleClick={inventoryItem => {
                                if (inventoryItem === null || !(inventoryItem instanceof Object)) {
                                    return;
                                }

                                fetchNui(NuiEvent.InventoryMoveItem, {
                                    sourceInventoryId: inventoryId,
                                    sourceSlot: inventoryItem.slot,
                                    targetInventoryId: `player_${player?.citizenid}`,
                                    targetSlot: null,
                                    sourceAmount: inventoryItem.amount,
                                    modifier: null,
                                });
                            }}
                            allowHiddenItem={type === InventoryType.Player}
                        />
                    </div>
                </div>
            </main>
        </DndContext>
    );
};

const getInventoryBanner = (type: InventoryType): string => {
    if (type === InventoryType.Armory || type === InventoryType.Ammo) {
        return '/public/images/inventory/banner/armory.webp';
    }

    if (type === InventoryType.Bin) {
        return '/public/images/inventory/banner/bin.webp';
    }

    if (type === InventoryType.BossStorage) {
        return '/public/images/inventory/banner/boss_storage.webp';
    }

    if (type === InventoryType.CabinetStorage) {
        return '/public/images/inventory/banner/default.webp';
    }

    if (type === InventoryType.Cloakroom) {
        return '/public/images/inventory/banner/cloakroom.webp';
    }

    if (type === InventoryType.EvidenceStorage) {
        return '/public/images/inventory/banner/evidence_storage.webp';
    }

    if (type === InventoryType.FlavorStorage) {
        return '/public/images/inventory/banner/flavor_storage.webp';
    }

    if (type === InventoryType.Fridge || type === InventoryType.IceMachine || type === InventoryType.HouseFridge) {
        return '/public/images/inventory/banner/fridge.webp';
    }

    if (type === InventoryType.FurnitureStorage) {
        return '/public/images/inventory/banner/furniture_storage.webp';
    }

    if (type === InventoryType.Inverter) {
        return '/public/images/inventory/banner/inverter.webp';
    }

    if (type === InventoryType.Stash || type === InventoryType.HouseStash) {
        return '/public/images/inventory/banner/stash.webp';
    }

    if (type === InventoryType.LiquorStorage) {
        return '/public/images/inventory/banner/liquor_storage.webp';
    }

    if (type === InventoryType.LogStorage) {
        return '/public/images/inventory/banner/log_storage.webp';
    }

    if (type === InventoryType.LogProcessing || type === InventoryType.MetalConverter) {
        return '/public/images/inventory/banner/metal_converter.webp';
    }

    if (type === InventoryType.MetalIncinerator) {
        return '/public/images/inventory/banner/metal_incinerator.webp';
    }

    if (type === InventoryType.Organ) {
        return '/public/images/inventory/banner/organ.webp';
    }

    if (type === InventoryType.PlankStorage) {
        return '/public/images/inventory/banner/plank_storage.webp';
    }

    if (type === InventoryType.RecyclerProcessing) {
        return '/public/images/inventory/banner/recycler_processing.webp';
    }

    if (type === InventoryType.SawdustStorage) {
        return '/public/images/inventory/banner/sawdust_storage.webp';
    }

    if (type === InventoryType.Seizure) {
        return '/public/images/inventory/banner/seizure.webp';
    }

    if (type === InventoryType.SnackStorage) {
        return '/public/images/inventory/banner/snack_storage.webp';
    }

    if (type === InventoryType.SmugglingBox) {
        return '/public/images/inventory/banner/smuggling_box.webp';
    }

    if (type === InventoryType.Trunk) {
        return '/public/images/inventory/banner/trunk.webp';
    }

    return '/public/images/inventory/banner/default.webp';
};

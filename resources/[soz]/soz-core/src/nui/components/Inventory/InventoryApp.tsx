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
            <main className="absolute h-full w-full font-prompt">
                <div className="flex mt-8 justify-center">
                    <div className="mr-4 w-[400px]">
                        <Inventory
                            title="Inventaire"
                            configuration={playerInventoryConfiguration}
                            targetConfiguration={configuration}
                            inventoryItems={playerInventoryItems}
                            inventoryId={`player_${player?.citizenid}`}
                            prefixId="source_"
                            player
                            itemDescriptionPosition="left"
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
                    <div className="ml-4 w-[400px]">
                        <Inventory
                            title={getInventoryTitle(type)}
                            configuration={configuration}
                            targetConfiguration={playerInventoryConfiguration}
                            inventoryItems={inventoryItems}
                            inventoryId={inventoryId}
                            prefixId="target_"
                            allowForceConsume={type === InventoryType.Player}
                            itemDescriptionPosition="right"
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

const getInventoryTitle = (type: InventoryType): string => {
    switch (type) {
        case InventoryType.Bin:
            return 'Poubelle';

        case InventoryType.Ammo:
        case InventoryType.Armory:
            return 'Armurerie';

        case InventoryType.BossStorage:
            return 'Entreprise';

        case InventoryType.CabinetStorage:
            return 'Cabinet';

        case InventoryType.Cloakroom:
            return 'Vestiaire';

        case InventoryType.EvidenceStorage:
            return 'Preuves';

        case InventoryType.FlavorStorage:
            return 'Saveurs';

        case InventoryType.Fridge:
            return 'Frigo';

        case InventoryType.FurnitureStorage:
            return 'Meubles';

        case InventoryType.Inverter:
            return 'Energie';

        case InventoryType.Stash:
            return 'Stockage';

        case InventoryType.LiquorStorage:
            return 'Alcool';

        case InventoryType.LogStorage:
            return 'Bois';

        case InventoryType.LogProcessing:
            return 'Scierie';

        case InventoryType.MetalConverter:
            return 'Fonderie';

        case InventoryType.MetalIncinerator:
            return 'Incinerateur';

        case InventoryType.Organ:
            return 'Organes';

        case InventoryType.PlankStorage:
            return 'Planches';

        case InventoryType.RecyclerProcessing:
            return 'Recyclage';

        case InventoryType.SawdustStorage:
            return 'Sciure';

        case InventoryType.Seizure:
            return 'Saisie';

        case InventoryType.SnackStorage:
            return 'Snacks';

        case InventoryType.SmugglingBox:
            return 'Contrebande';

        case InventoryType.Trunk:
            return 'Véhicule';

        case InventoryType.HouseStash:
            return 'Armoire';

        case InventoryType.HouseFridge:
            return 'Frigo';

        case InventoryType.IceMachine:
            return 'Machine à glaçons';

        case InventoryType.Distillery:
            return 'Distillerie';

        case InventoryType.Player:
            return 'Fouille';

        default:
            return 'Stockage';
    }
};

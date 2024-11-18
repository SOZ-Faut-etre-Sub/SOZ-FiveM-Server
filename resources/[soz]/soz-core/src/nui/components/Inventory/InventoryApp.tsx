import { DndContext, MouseSensor, rectIntersection, useSensor, useSensors } from '@dnd-kit/core';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { InventoryConfiguration, InventoryItem, InventoryState, InventoryType } from '../../../shared/inventory';
import { fetchNui } from '../../fetch';
import { useKeyPress } from '../../hook/control';
import { usePlayer, usePlayerInventoryConfiguration, usePlayerInventoryItems } from '../../hook/data';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { createHandleDragAndDrop } from './Actions';
import { Inventory } from './Inventory';
import { useInventorySize } from './size';

export const InventoryApp: FunctionComponent = () => {
    const playerInventoryItems = usePlayerInventoryItems();
    const playerInventoryConfiguration = usePlayerInventoryConfiguration();
    const player = usePlayer();
    const [inventoryId, setInventoryId] = useState<string>(null);
    const [inventoryItems, setInventoryItems] = useState<Record<number, InventoryItem>>(null);
    const [configuration, setConfiguration] = useState<InventoryConfiguration>(null);
    const [canForceConsume, setCanForceConsume] = useState<boolean>(false);
    const [type, setType] = useState<InventoryType>(null);
    const [inventoryState, setInventoryState] = useState<InventoryState>(null);
    const [inventoryTargetMoney, setInventoryTargetMoney] = useState<number>(null);
    const open = inventoryId !== null;
    const inventorySize = useInventorySize(5);

    useNuiEvent('inventory', 'OpenInventory', ({ id, configuration, type, items, canForceConsume, state, money }) => {
        setInventoryId(id);
        setConfiguration(configuration);
        setType(type);
        setInventoryItems(items);
        setCanForceConsume(canForceConsume);
        setInventoryState(state);
        setInventoryTargetMoney(money);
    });

    useNuiEvent('inventory', 'CloseInventory', () => {
        setInventoryId(null);
        setConfiguration(null);
        setInventoryItems(null);
        setType(null);
        setCanForceConsume(false);
        setInventoryState(null);
        setInventoryTargetMoney(null);
    });

    useNuiEvent('inventory', 'SetInventoryMoney', money => {
        if (inventoryId) {
            setInventoryTargetMoney(money);
        }
    });

    useNuiEvent('inventory', 'UpdateInventory', ({ id, configuration, items }) => {
        if (inventoryId === id) {
            setInventoryItems(items);
            setConfiguration(configuration);
        } else {
            fetchNui(NuiEvent.InventoryClose, id);
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

    if (!open || !player) {
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
                    <div
                        className="mr-4"
                        style={{
                            width: `${inventorySize.width}px`,
                        }}
                    >
                        <Inventory
                            title="Inventaire"
                            configuration={playerInventoryConfiguration}
                            targetConfiguration={configuration}
                            inventoryItems={playerInventoryItems}
                            inventoryId={`player_${player?.citizenid}`}
                            prefixId="source_"
                            player
                            itemDescriptionPosition="left"
                            allDisabled={!inventoryState?.canPutContent}
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
                            width: `${inventorySize.width}px`,
                        }}
                    >
                        <Inventory
                            title={getInventoryTitle(type)}
                            configuration={configuration}
                            targetConfiguration={playerInventoryConfiguration}
                            inventoryItems={inventoryItems}
                            inventoryId={inventoryId}
                            prefixId="target_"
                            allowForceConsume={canForceConsume}
                            itemDescriptionPosition="right"
                            allDisabled={!inventoryState?.canGetContent}
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
                            targetMoney={inventoryTargetMoney}
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
            return 'Fournitures';

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
            return 'Incinerateur';

        case InventoryType.SawdustStorage:
            return 'Sciure';

        case InventoryType.Seizure:
            return 'Saisies';

        case InventoryType.SnackStorage:
            return 'Snacks';

        case InventoryType.SmugglingBox:
            return 'Contrebande';

        case InventoryType.Trunk:
            return 'Véhicule';

        case InventoryType.HouseStash:
            return 'Réserve';

        case InventoryType.HouseFridge:
            return 'Frigo';

        case InventoryType.IceMachine:
            return 'Glaçons';

        case InventoryType.Distillery:
            return 'Distillerie';

        case InventoryType.Player:
            return 'Fouille';

        default:
            return 'Stockage';
    }
};

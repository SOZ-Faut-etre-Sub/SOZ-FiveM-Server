import { DragEndEvent } from '@dnd-kit/core';
import { DrugSkill } from '@private/shared/drugs';
import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { InventoryItem } from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { PlayerData } from '../../../shared/player';
import { fetchNui } from '../../fetch';

type DraggableDataInventoryItem = {
    inventoryId: string;
    slot: number;
    inventoryItem: InventoryItem | 'money' | 'wallet' | 'keychain' | null;
    item: Item | null;
    type: 'inventoryItem';
};

type DroppableDataInventoryItem = {
    inventoryId: string;
    slot: number;
    type: 'inventoryItem';
};

type DraggableDataShortcut = {
    type: 'shortcut';
    shortcut: number;
};

type DroppableDataShortcut = {
    type: 'shortcut';
    shortcut: number;
};

type DraggableData = DraggableDataInventoryItem | DraggableDataShortcut;
type DroppableData = DroppableDataInventoryItem | DroppableDataShortcut;

export const createHandleDragAndDrop = (allowOver = true) => {
    return (event: DragEndEvent) => {
        if (!event.active.data.current) {
            return;
        }

        const draggableData = event.active.data.current as DraggableData;

        if (draggableData.type === 'inventoryItem') {
            const { inventoryId: sourceInventoryId, slot: sourceSlot, inventoryItem, item } = draggableData;

            if (allowOver && !event.over) {
                if (inventoryItem instanceof Object) {
                    fetchNui(NuiEvent.InventoryActionItemOnScreen, {
                        id: event.active.id,
                        inventoryId: sourceInventoryId,
                        inventoryItem,
                        item,
                    });
                }

                if (inventoryItem === 'money') {
                    fetchNui(NuiEvent.InventoryActionGiveMoney, {
                        mode: 'screen_fallback_closest',
                        money: 'money',
                    });
                }

                return;
            } else if (!event.over) {
                return;
            }

            if (
                event.active.id === 'draggable_money' ||
                event.active.id === 'draggable_wallet' ||
                event.active.id === 'draggable_money'
            ) {
                return;
            }

            const droppableData = event.over.data.current as DroppableData;

            if (droppableData.type === 'inventoryItem') {
                const { inventoryId: targetInventoryId, slot: targetSlot } = droppableData;

                if (sourceInventoryId === targetInventoryId && sourceSlot === targetSlot) {
                    return;
                }

                const keyEvent = event.activatorEvent as KeyboardEvent;

                fetchNui(NuiEvent.InventoryMoveItem, {
                    sourceInventoryId,
                    sourceSlot,
                    targetInventoryId,
                    targetSlot,
                    sourceAmount: inventoryItem instanceof Object ? inventoryItem.amount : null,
                    modifier:
                        inventoryItem instanceof Object && !item?.unique
                            ? keyEvent?.ctrlKey
                                ? 'ctrl'
                                : keyEvent?.shiftKey
                                  ? 'shift'
                                  : keyEvent?.altKey
                                    ? 'alt'
                                    : null
                            : null,
                });
            }

            if (droppableData.type === 'shortcut') {
                const { shortcut } = droppableData;

                fetchNui(NuiEvent.InventorySetShortcut, {
                    slot: sourceSlot,
                    shortcut: shortcut % 10,
                });
            }
        }

        if (draggableData.type === 'shortcut') {
            const { shortcut } = draggableData;

            if (!event.over || event.over.data.current.type !== 'shortcut') {
                fetchNui(NuiEvent.InventoryRemoveShortcut, {
                    shortcut: shortcut % 10,
                });

                return;
            }

            const droppableData = event.over.data.current as DroppableDataShortcut;

            fetchNui(NuiEvent.InventoryMoveShortcut, {
                previousShortcut: shortcut % 10,
                nextShortcut: droppableData.shortcut % 10,
            });
        }
    };
};

enum ActionItemType {
    Use = 'use',
    Drop = 'drop',
    ShowItem = 'show',
    Give = 'give',
    Equip = 'equip',
    SetPrimaryWeapon = 'setPrimaryWeapon',
    SetSecondaryWeapon = 'setSecondaryWeapon',
    Rename = 'rename',
    GiveMoney = 'giveMoney',
    GiveMarkedMoney = 'giveMarkedMoney',
    OpenWallet = 'openWallet',
    OpenKeychain = 'openKeychain',
    ShowCard = 'showCard',
    LookCard = 'lookCard',
    Open = 'open',
    ForceConsume = 'forceConsume',
}

type ActionItemProps = {
    action: ActionItemType;
    inventoryId: string;
    inventoryItem: InventoryItem | 'wallet' | 'keychain' | 'money';
    item: Item | null;
};

export const ActionItem: FunctionComponent<ActionItemProps> = ({ action, inventoryId, inventoryItem, item }) => {
    const classNames = 'p-1 rounded hover:bg-white/15';

    if (action === ActionItemType.Use) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionUse, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Utiliser
            </div>
        );
    }

    if (action === ActionItemType.Drop) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionDrop, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Jeter
            </div>
        );
    }

    if (action === ActionItemType.ShowItem) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionShowItem, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Montrer
            </div>
        );
    }

    if (action === ActionItemType.Give) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionGive, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                        mode: 'closest',
                    })
                }
                className={classNames}
            >
                Donner
            </div>
        );
    }

    if (action === ActionItemType.Equip) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionUse, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Équiper
            </div>
        );
    }

    if (action === ActionItemType.SetPrimaryWeapon && inventoryItem instanceof Object) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventorySetShortcut, {
                        slot: inventoryItem.slot,
                        shortcut: 1,
                    })
                }
                className={classNames}
            >
                Définir comme arme principale
            </div>
        );
    }

    if (action === ActionItemType.SetSecondaryWeapon && inventoryItem instanceof Object) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventorySetShortcut, {
                        slot: inventoryItem.slot,
                        shortcut: 2,
                    })
                }
                className={classNames}
            >
                Définir comme arme secondaire
            </div>
        );
    }

    if (action === ActionItemType.Rename) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionRename, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Renommer
            </div>
        );
    }

    if (action === ActionItemType.GiveMoney) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionGiveMoney, {
                        mode: 'closest',
                        money: 'money',
                    })
                }
                className={classNames}
            >
                Donner en propre
            </div>
        );
    }

    if (action === ActionItemType.GiveMarkedMoney) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionGiveMoney, {
                        mode: 'closest',
                        money: 'marked_money',
                    })
                }
                className={classNames}
            >
                Donner en sale
            </div>
        );
    }

    if (action === ActionItemType.OpenWallet) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionOpenWallet, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Ouvrir le portefeuille
            </div>
        );
    }

    if (action === ActionItemType.OpenKeychain) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionOpenKeychain, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Ouvrir le trousseau
            </div>
        );
    }

    if (action === ActionItemType.ShowCard) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionShowCard, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Montrer
            </div>
        );
    }

    if (action === ActionItemType.LookCard) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionLookCard, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Regarder
            </div>
        );
    }

    if (action === ActionItemType.Open) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionOpen, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                    })
                }
                className={classNames}
            >
                {item?.openStorageLabel || 'Ouvrir'}
            </div>
        );
    }

    if (action === ActionItemType.ForceConsume) {
        return (
            <div
                onClick={() =>
                    fetchNui(NuiEvent.InventoryActionForceConsume, {
                        inventoryId: inventoryId,
                        inventoryItem: inventoryItem,
                        item: item,
                    })
                }
                className={classNames}
            >
                Faire consommer
            </div>
        );
    }

    return null;
};

export const getActions = (
    inventoryItem: InventoryItem | 'wallet' | 'keychain' | 'money',
    item: Item | null,
    allowForceConsume = false,
    player: PlayerData
): ActionItemType[] => {
    const actions = [];

    if (inventoryItem === 'wallet') {
        actions.push(ActionItemType.OpenWallet);

        return actions;
    }

    if (inventoryItem === 'keychain') {
        actions.push(ActionItemType.OpenKeychain);

        return actions;
    }

    if (inventoryItem === 'money') {
        actions.push(ActionItemType.GiveMoney);
        actions.push(ActionItemType.GiveMarkedMoney);

        return actions;
    }

    if (!item) {
        return actions;
    }

    if (item.type === 'weapon') {
        actions.push(ActionItemType.Equip);
    }

    if (item.useable && item.type !== 'weapon') {
        actions.push(ActionItemType.Use);

        if (allowForceConsume) {
            actions.push(ActionItemType.ForceConsume);
        }
    } else if (item.type === 'fish' && player.metadata.drugs_skills.includes(DrugSkill.Zoologiste)) {
        actions.push(ActionItemType.Use);
    }

    if (item.canShow) {
        actions.push(ActionItemType.ShowItem);
    }

    if (item.type !== 'card') {
        actions.push(ActionItemType.Give);
    } else {
        actions.push(ActionItemType.ShowCard);
        actions.push(ActionItemType.LookCard);
    }

    if (item.throwable) {
        actions.push(ActionItemType.Drop);
    }

    if (item.type === 'weapon') {
        actions.push(ActionItemType.SetPrimaryWeapon);
        actions.push(ActionItemType.SetSecondaryWeapon);
    }

    if (
        (item.type === 'crate' && inventoryItem.metadata?.crateElements?.length) ||
        (item.name === 'detective_board' && inventoryItem.metadata?.originalDetectiveBoard) ||
        item.name === 'scientist_photo'
    ) {
        actions.push(ActionItemType.Rename);
    }

    if (item.storageItemType && (item.name !== 'detective_board' || inventoryItem.metadata?.originalDetectiveBoard)) {
        actions.push(ActionItemType.Open);
    }

    return actions;
};

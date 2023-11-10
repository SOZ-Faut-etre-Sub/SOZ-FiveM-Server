import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debugPlayerInventory } from '../../../test/debug';
import { InventoryItem, SozInventoryModel } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './PlayerContainer.module.css';
import { ContainerSlots } from '../ContainerSlots';
import inventoryBanner from '/banner/inventory_banner.png'
import { closeNUI } from '../../../hooks/nui';
import { clsx } from 'clsx';
import { DndContext, rectIntersection } from '@dnd-kit/core';
import { useInventoryRow } from '../../../hooks/useInventoryRow';
import { handleSortInventory } from '../../../hooks/handleSortInventory';
import { getKeyModifier } from '../../../hooks/getKeyModifier';

export const PlayerContainer = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [playerMoney, setPlayerMoney] = useState<number>(0);
    const [playerInventory, setPlayerInventory] = useState<SozInventoryModel | null>();
    const [playerShortcuts, setPlayerShortcuts] = useState<Partial<InventoryItem>[]>();


    const closeMenu = useCallback(() => {
        setDisplay(false);
        setPlayerInventory(null);
        setPlayerShortcuts([]);
    }, [setDisplay, setPlayerInventory, setPlayerShortcuts]);

    const interactAction = useCallback(
        (action: string, item: InventoryItem, shortcut: number) => {
            fetch(`https://soz-inventory/player/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({ ...item, shortcut }),
            }).then(() => closeNUI(() => closeMenu()));
        },
        [closeMenu]
    );

    const onClickReceived = useCallback(
        (event: MouseEvent) => {
            if (display && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                event.preventDefault();
                closeNUI(() => closeMenu());
            }
        },
        [menuRef, display, closeMenu]
    );

    const onMessageReceived = useCallback(
        (event: MessageEvent) => {
            if (event.data.action === "openPlayerInventory") {
                if (event.data.playerInventory === undefined) return;

                try {
                    if (typeof event.data.playerInventory === "object") {
                        event.data.playerInventory.items = Object.values(event.data.playerInventory.items);
                    }

                    event.data.playerInventory.items = event.data.playerInventory.items.filter((i: InventoryItem) => i !== null)

                    setPlayerInventory(event.data.playerInventory);
                    setPlayerMoney(event.data.playerMoney || -1);
                    setPlayerShortcuts(event.data.playerShortcuts);

                    setDisplay(true);
                } catch (e: any) {
                    console.error(e, event.data.playerInventory, event.data.playerMoney);
                    closeNUI(() => closeMenu());
                }
            } else if (display && event.data.action === 'closeInventory') {
                closeNUI(() => closeMenu());
            } else if (event.data.action === 'openShop' || event.data.action === 'openInventory' || event.data.action === 'openPlayerKeyInventory' || event.data.action === 'openPlayerWalletInventory') {
                closeMenu();
            }
        },
        [setDisplay, closeMenu, setPlayerMoney, setPlayerInventory, setPlayerShortcuts, display]
    );

    const onKeyDownReceived = useCallback(
        (event: KeyboardEvent) => {
            if (display && !event.repeat && (event.key === "Escape" || event.key === "F2")) {
                closeNUI(() => closeMenu());
            }
        },
        [display, closeMenu]
    );

    const handleDragAndDrop = useCallback((event: any) => {
        if (!event.active.data.current) return;
        const keyEvent = event?.activatorEvent as KeyboardEvent


        if (event.over !== null) { // Do a sort in inventory

            if (event.active.id == 'player_drag_keychain_' || 
                event.over.id == 'player_keychain' ||
                event.active.id == 'player_drag_wallet_' || 
                event.over.id == 'player_wallet' || 
                event.active.id == 'player_drag_money_' || 
                event.over.id == 'player_money'
                ) {
                return;
            }

            fetch(`https://soz-inventory/sortItem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    item: event.active.data.current.item,
                    slot: event.over.data.current.slot,
                    inventory: playerInventory?.id,
                    keyModifier: getKeyModifier(keyEvent)
                }),
            })
                .then(res => res.json())
                .then((transfer) => {
                    if (typeof transfer.sourceInventory === "object") {
                        transfer.sourceInventory.items = Object.values(transfer.sourceInventory.items);
                    }

                    transfer.sourceInventory.items = transfer.sourceInventory.items.filter((i: InventoryItem) => i !== null)
                    setPlayerInventory(transfer.sourceInventory);
                })
                .catch((e) => {
                    console.error("Failed to sort item", e);
                });
        } else if (event.active.id == 'player_drag_money_') {
            fetch(`https://soz-inventory/player/giveMoneyToTarget`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
            }).then(() => closeNUI(() => closeMenu()));
        } else {
            fetch(`https://soz-inventory/player/giveItemToTarget`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(event.active.data.current.item),
            }).then(() => closeNUI(() => closeMenu()));
        }
    },
        [playerInventory, closeMenu]
    );

    const itemShortcut = useCallback((item: InventoryItem) => {
        if (!item) return null;

        const shortcut = Object.entries(playerShortcuts || {})?.find(([id, s]) => {
            if (s === null) return false;

            const itemMetadata = Object.values(item.metadata || {})
            const shortcutMetadata = Object.values(s?.metadata || {})

            return s.name === item.name && shortcutMetadata.every(m => itemMetadata.includes(m));
        });

        return shortcut ? shortcut[0] : null;
    }, [playerShortcuts]);

    useEffect(() => {
        window.addEventListener("contextmenu", onClickReceived);
        window.addEventListener("message", onMessageReceived);
        window.addEventListener("keydown", onKeyDownReceived);

        // onMessageReceived({ data: { ...debugPlayerInventory } } as MessageEvent);

        return () => {
            window.removeEventListener("contextmenu", onClickReceived);
            window.removeEventListener("message", onMessageReceived);
            window.removeEventListener("keydown", onKeyDownReceived);
        };
    }, [onClickReceived, onMessageReceived, onKeyDownReceived]);

    const inventoryRow = useMemo(() => {
        return useInventoryRow(playerInventory?.items || []);
    }, [playerInventory]);

    if (!playerInventory) {
        return null;
    }

    return (
        <DndContext
            autoScroll={{
                enabled: false,
            }}
            collisionDetection={rectIntersection}
            onDragEnd={handleDragAndDrop}
        >
            {display &&
            <div className={clsx(style.Wrapper)}>
                <ContainerWrapper
                    display={true}
                    banner={inventoryBanner}
                    weight={playerInventory.weight}
                    maxWeight={playerInventory.maxWeight}
                    sortCallback={() => handleSortInventory(playerInventory.id, setPlayerInventory)}
                >
                    <ContainerSlots
                        id="player"
                        rows={inventoryRow}
                        money={playerMoney}
                        wallet={1}
                        keychain={1}
                        items={playerInventory.items.map((item, i) => ({ ...item, id: i, shortcut: itemShortcut(item) }))}
                        action={interactAction}
                    />
                </ContainerWrapper>
            </div>
            }
        </DndContext>
    )
}

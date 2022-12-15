import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { debugPlayerInventory } from '../../../test/debug';
import { InventoryItem, SozInventoryModel } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './PlayerContainer.module.css';
import { ContainerSlots } from '../ContainerSlots';
import playerBanner from '/banner/player.jpg'
import { closeNUI } from '../../../hooks/nui';
import { clsx } from 'clsx';
import { DndContext, rectIntersection } from '@dnd-kit/core';
import { useInventoryRow } from '../../../hooks/useInventoryRow';
import Draggable from '../../Draggable/Draggable';

export const PlayerContainer = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [playerMoney, setPlayerMoney] = useState<number>(0);
    const [playerInventory, setPlayerInventory] = useState<SozInventoryModel | null>();

    const interactAction = useCallback(
        (action: string, item: InventoryItem, shortcut: number) => {
            fetch(`https://soz-inventory/player/${action}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({ ...item, shortcut }),
            }).then(() => {
                setDisplay(false);
            });
        },
        [setDisplay]
    );

    const onClickReceived = useCallback(
        (event: MouseEvent) => {
            if (display && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                event.preventDefault();
                closeNUI(() => setDisplay(false));
            }
        },
        [menuRef, display, setDisplay]
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
                    setPlayerMoney(event.data.playerMoney);

                    setDisplay(true);
                } catch (e: any) {
                    console.error(e, event.data.playerInventory, event.data.playerMoney);
                    closeNUI(() => setDisplay(false));
                }
            }
        },
        [setDisplay, setPlayerMoney, setPlayerInventory]
    );

    const onKeyDownReceived = useCallback(
        (event: KeyboardEvent) => {
            if (display && !event.repeat && (event.key === "Escape" || event.key === "F2")) {
                closeNUI(() => setDisplay(false));
            }
        },
        [display, setDisplay]
    );

    const transfertItem = useCallback((event: any) => {
            if (!event.active.data.current) return;
            if (event.over !== null) return;

            fetch(`https://soz-inventory/player/giveItemToTarget`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(event.active.data.current.item),
            }).then(() => {
                setDisplay(false);
            });
        },
        [setDisplay]
    );

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
            onDragEnd={transfertItem}
        >
            <div className={clsx(style.Wrapper, {
                [style.Show]: display,
                [style.Hide]: !display,
            })}>
                <ContainerWrapper
                    display={true}
                    banner={playerBanner}
                    weight={playerInventory.weight}
                    maxWeight={playerInventory.maxWeight}
                >
                    <ContainerSlots
                        id="player"
                        rows={inventoryRow}
                        money={playerMoney}
                        items={playerInventory.items.map((item, i) => ({...item, id: i}))}
                        action={interactAction}
                    />
                </ContainerWrapper>
            </div>
        </DndContext>
    )
}

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InventoryItem } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './KeyContainer.module.css';
import { ContainerSlots } from '../ContainerSlots';
import playerBanner from '/banner/player.jpg'
import { closeNUI } from '../../../hooks/nui';
import { clsx } from 'clsx';
import { DndContext, rectIntersection } from '@dnd-kit/core';

export const KeyContainer = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [playerInventory, setPlayerInventory] = useState<InventoryItem[] | null>([]);

    const closeMenu = useCallback(() => {
        setDisplay(false);
        setPlayerInventory(null);
    }, [setDisplay, setPlayerInventory]);

    const transfertItem = useCallback((event: any) => {
        if (!event.active.data.current) return;

        fetch(`https://soz-inventory/player/giveKeyToTarget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(event.active.data.current.item)
        }).then(() => {
            closeNUI(() => closeMenu());
        });
    }, [closeMenu]);

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === "openPlayerKeyInventory") {
            if (event.data.keys === undefined) return

            setPlayerInventory(event.data.keys.filter((i: InventoryItem) => i !== null).map((item: InventoryItem) => ({ ...item, id: `key_${item.slot}` })));
            setDisplay(true);
        } else if (event.data.action === 'openShop' || event.data.action === 'openInventory' || event.data.action === 'openPlayerInventory') {
            closeMenu();
        }
    }, [setDisplay, setPlayerInventory]);

    const onKeyDownReceived = useCallback((event: KeyboardEvent) => {
        if (display && !event.repeat && event.key === 'Escape') {
            closeNUI(() => closeMenu());
        }
    }, [display, closeMenu])

    const onClickReceived = useCallback((event: MouseEvent) => {
        if (display && menuRef.current && !menuRef.current.contains(event.target as Node)) {
            event.preventDefault();
            closeNUI(() => closeMenu());
        }
    }, [menuRef, display, closeMenu])

    useEffect(() => {
        window.addEventListener("contextmenu", onClickReceived);
        window.addEventListener("message", onMessageReceived);
        window.addEventListener("keydown", onKeyDownReceived);

        // onMessageReceived({ data: { ...debugPlayerKeyInventory } } as MessageEvent);

        return () => {
            window.removeEventListener("contextmenu", onClickReceived);
            window.removeEventListener("message", onMessageReceived);
            window.removeEventListener("keydown", onKeyDownReceived);
        };
    }, [onClickReceived, onMessageReceived, onKeyDownReceived]);

    const inventoryRow = useMemo(() => {
        return Math.floor((playerInventory || []).length / 5);
    }, [playerInventory]);

    if (!playerInventory) {
        return null;
    }

    return (
        <>
            {display &&
                <DndContext
                    autoScroll={{
                        enabled: false,
                    }}
                    collisionDetection={rectIntersection}
                    onDragEnd={transfertItem}
                >
                    <div className={clsx(style.Wrapper)}>
                        <ContainerWrapper
                            display={true}
                            banner={playerBanner}
                            maxWeight={-1}
                        >
                            <ContainerSlots
                                id="player"
                                rows={inventoryRow}
                                items={playerInventory.map((item, i) => ({ ...item, id: i, slot: i + 1, type: 'key' }))}
                            />
                        </ContainerWrapper>
                    </div>
                </DndContext>
            }
        </>
    )
}

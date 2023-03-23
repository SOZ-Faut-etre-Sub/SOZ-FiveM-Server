import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { InventoryItem } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './ForceConsumeContainer.module.css';
import { ContainerSlots } from '../ContainerSlots';
import playerBanner from '/banner/player.jpg'
import { closeNUI } from '../../../hooks/nui';
import { clsx } from 'clsx';
import { DndContext, rectIntersection } from '@dnd-kit/core';
import { useInventoryRow } from '../../../hooks/useInventoryRow';

export const ForceConsumeContainer = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    let targetId = 0;

    const [playerInventory, setPlayerInventory] = useState<InventoryItem[] | null>([]);

    const closeMenu = useCallback(() => {
        setDisplay(false);
        setPlayerInventory(null);
    }, [setDisplay, setPlayerInventory]);

    const transfertItem = useCallback((event: any) => {
        if (!event.active.data.current) return;

        fetch(`https://soz-inventory/player/forceconsume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({item: event.active.data.current.item, targetId: targetId})
        }).then(() => {
            closeNUI(() => closeMenu());
        });
    }, [closeMenu]);

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === "openForceConsume") {
            setPlayerInventory(event.data.playerInventory.items
                .filter((i: InventoryItem) => i !== null )
                .map((i: InventoryItem) => ({...i, disabled: (i.type != 'food' && i.type != 'drink' && i.type != 'cocktail' && i.type != 'liquor')}))
            );
            targetId = event.data.targetId;
            setDisplay(true);
        }
    }, [setDisplay, setPlayerInventory]);

    const onKeyDownReceived = useCallback((event: KeyboardEvent) => {
        if (display && !event.repeat && event.key === 'Escape') {
            closeNUI(() => closeMenu());
        }
    }, [display, closeMenu])

    const onClickReceived = useCallback((event: MouseEvent) => {
        if (display &&menuRef.current && !menuRef.current.contains(event.target as Node)){
            event.preventDefault();
            closeNUI(() => closeMenu());
        }
    }, [menuRef, display, closeMenu])

    useEffect(() => {
        window.addEventListener("contextmenu", onClickReceived);
        window.addEventListener("message", onMessageReceived);
        window.addEventListener("keydown", onKeyDownReceived);

        return () => {
            window.removeEventListener("contextmenu", onClickReceived);
            window.removeEventListener("message", onMessageReceived);
            window.removeEventListener("keydown", onKeyDownReceived);
        };
    }, [onClickReceived, onMessageReceived, onKeyDownReceived]);

    const inventoryRow = useMemo(() => {
        return useInventoryRow(playerInventory || []);
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
                    maxWeight={-1}
                >
                    <ContainerSlots
                        id="player"
                        rows={inventoryRow}
                        items={playerInventory.map((item, i) => ({...item, id: i}))}
                        money={-1}
                    />
                </ContainerWrapper>
            </div>
        </DndContext>
    )
}

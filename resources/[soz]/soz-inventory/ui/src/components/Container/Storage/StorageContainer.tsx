import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InventoryItem, SozInventoryModel } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './StorageContainer.module.css';
import { ContainerSlots } from '../ContainerSlots';
import { closeNUI } from '../../../hooks/nui';
import { clsx } from 'clsx';
import playerBanner from '/banner/player.jpg';
import { DndContext, DragEndEvent, rectIntersection } from '@dnd-kit/core';
import { useInventoryRow } from '../../../hooks/useInventoryRow';
import { handleSortInventory } from '../../../hooks/handleSortInventory';

export const StorageContainer = () => {
    const [display, setDisplay] = useState<boolean>(false);

    const [playerInventory, setPlayerInventory] = useState<SozInventoryModel | null>();
    const [targetInventory, setTargetInventory] = useState<SozInventoryModel | null>();

    const targetInventoryBanner = useMemo(() => {
        let type = targetInventory?.type || 'default';

        if (type === 'stash') type = 'storage';
        if (type === 'ammo') type = 'armory';
        if (type === 'tanker') type = 'trunk';
        if (type === 'trailerlogs') type = 'trunk';
        if (type === 'brickade') type = 'trunk';
        if (type === 'trash') type = 'trunk';
        if (type === 'storage') type = 'default';
        if (type === 'storage_tank') type = 'default';

        return `/html/banner/${type}.jpg`;
    }, [targetInventory?.type]);

    const onMessageReceived = useCallback(
        (event: MessageEvent) => {
            if (event.data.action === 'openInventory') {
                if (event.data.playerInventory === undefined || event.data.targetInventory === undefined) return;

                try {
                    if (typeof event.data.playerInventory === "object") {
                        event.data.playerInventory.items = Object.values(event.data.playerInventory.items);
                    }
                    if (typeof event.data.targetInventory === "object") {
                        event.data.targetInventory.items = Object.values(event.data.targetInventory.items);
                    }

                    event.data.playerInventory.items = event.data.playerInventory.items.filter((i: InventoryItem) => i !== null)
                    event.data.targetInventory.items = event.data.targetInventory.items.filter((i: InventoryItem) => i !== null)


                    setPlayerInventory(event.data.playerInventory);
                    setTargetInventory(event.data.targetInventory);

                    setDisplay(true);
                } catch (e: any) {
                    console.error(e, event.data.playerInventory, event.data.targetInventory);
                    closeNUI(
                        () => {
                            setDisplay(false);
                        },
                        {
                            target: targetInventory?.id,
                        },
                    );
                }
            } else if (event.data.action === 'updateInventory') {
                try {
                    if (event.data.playerInventory !== undefined) {
                        setPlayerInventory(event.data.playerInventory);
                    }
                    if (event.data.targetInventory !== undefined) {
                        setTargetInventory(event.data.targetInventory);
                    }
                } catch (e: any) {
                    console.error(e, event.data.playerInventory, event.data.targetInventory);
                    closeNUI(
                        () => {
                            setDisplay(false);
                        },
                        {
                            target: targetInventory?.id,
                        },
                    );
                }
            } else if (event.data.action === 'closeInventory') {
                closeNUI(
                    () => {
                        setDisplay(false);
                    },
                    {
                        target: targetInventory?.id,
                    },
                );
            }
        },
        [setDisplay, setPlayerInventory, setTargetInventory],
    );

    const onKeyDownReceived = useCallback(
        (event: KeyboardEvent) => {
            if (!event.repeat && event.key === 'Escape') {
                fetch(`https://soz-inventory/closeNUI`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        target: targetInventory?.id,
                    }),
                }).then(() => {
                    setDisplay(false);
                });
            }
        },
        [targetInventory, setDisplay],
    );

    const handleInventoryUpdate = useCallback((apiResponse: {sourceInventory?: SozInventoryModel; targetInventory?: SozInventoryModel}) => {
        if (!apiResponse.sourceInventory || !apiResponse.targetInventory) return;
        if (apiResponse.sourceInventory.id === apiResponse.targetInventory.id) return;

        let sourceInventory = apiResponse.sourceInventory;
        let targetInventory = apiResponse.targetInventory;

        if (apiResponse.targetInventory.type === "player") {
            sourceInventory = apiResponse.targetInventory;
            targetInventory = apiResponse.sourceInventory;
        }

        setPlayerInventory(sourceInventory);
        setTargetInventory(targetInventory);
    }, [setPlayerInventory, setTargetInventory])

    const transfertItem = useCallback((event: DragEndEvent) => {
        if (!event.active.data.current) return;
        if (!event.over?.data.current) return;

        if (event.active.data.current.container === event.over.data.current.container) {
            fetch(`https://soz-inventory/sortItem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    item: event.active.data.current.item,
                    slot: event.over.data.current.slot,
                    inventory: event.active.data.current.container === 'player' ? playerInventory?.id : targetInventory?.id,
                    manualFilter: event.active.data.current.container === 'player' && targetInventory?.type,
                }),
            })
                .then(res => res.json())
                .then((transfer) => {
                    if (typeof transfer.sourceInventory === "object") {
                        transfer.sourceInventory.items = Object.values(transfer.sourceInventory.items);
                    }

                    transfer.sourceInventory.items = transfer.sourceInventory.items.filter((i: InventoryItem) => i !== null)

                    if (event.active.data.current?.container === 'player') {
                        setPlayerInventory(transfer.sourceInventory);
                    } else {
                        setTargetInventory(transfer.sourceInventory);
                    }
                })
                .catch((e) => {
                    console.error("Failed to sort item", e);
                });

        } else {
            const sourceInvId = event.active.data.current.container === 'player' ? playerInventory?.id : targetInventory?.id;
            const targetInvId = event.over.data.current.container === 'player' ? playerInventory?.id : targetInventory?.id;

             fetch(`https://soz-inventory/transfertItem`, {
                 method: "POST",
                 headers: {
                     "Content-Type": "application/json; charset=UTF-8",
                 },
                 body: JSON.stringify({
                     source: sourceInvId,
                     target: targetInvId,
                     item: event.active.data.current.item,
                     slot: event.over.data.current.slot,
                 }),
             })
                 .then((res) => res.json())
                 .then((transfert) => handleInventoryUpdate(transfert));
        }

    }, [playerInventory, targetInventory, setPlayerInventory, setTargetInventory]);

    useEffect(() => {
        window.addEventListener('message', onMessageReceived);
        window.addEventListener('keydown', onKeyDownReceived);

        // onMessageReceived({ data: { ...debugStorageInventory } } as MessageEvent);

        return () => {
            window.removeEventListener('message', onMessageReceived);
            window.removeEventListener('keydown', onKeyDownReceived);
        };
    }, [onMessageReceived, onKeyDownReceived]);

    const playerInventoryRow = useMemo(() => {
        return useInventoryRow(playerInventory?.items || []);
    }, [playerInventory]);

    const targetInventoryRow = useMemo(() => {
        return useInventoryRow(targetInventory?.items || []);
    }, [targetInventory]);

    if (!playerInventory || !targetInventory) {
        return null;
    }

    return (
        <div className={style.Wrapper}>
            <DndContext
                autoScroll={{
                    enabled: false,
                }}
                collisionDetection={rectIntersection}
                onDragEnd={transfertItem}
            >
                <div className={clsx(style.PlayerContainer, {
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
                            id='player'
                            rows={playerInventoryRow}
                            items={playerInventory.items.map((item, i) => ({ ...item, id: i }))}
                        />
                    </ContainerWrapper>
                </div>

                <div className={clsx(style.StorageContainer, {
                    [style.Show]: display,
                    [style.Hide]: !display,
                })}>
                    <ContainerWrapper
                        display={true}
                        banner={targetInventoryBanner}
                        weight={targetInventory.weight}
                        maxWeight={targetInventory.maxWeight}
                        sortCallback={() => handleSortInventory(targetInventory.id, setTargetInventory)}
                    >
                        <ContainerSlots
                            id='storage'
                            rows={targetInventoryRow}
                            items={targetInventory.items.map((item, i) => ({ ...item, id: i }))}
                        />
                    </ContainerWrapper>
                </div>
            </DndContext>
        </div>
    );
};

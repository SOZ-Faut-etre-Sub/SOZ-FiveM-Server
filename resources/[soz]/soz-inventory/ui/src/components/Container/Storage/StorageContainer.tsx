import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { InventoryItem, SozInventoryModel } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './StorageContainer.module.css';
import { ContainerSlots } from '../ContainerSlots';
import { closeNUI } from '../../../hooks/nui';
import { clsx } from 'clsx';
import playerBanner from '/banner/player.jpg';
import { DndContext, DragEndEvent, rectIntersection, } from '@dnd-kit/core';
import { useInventoryRow } from '../../../hooks/useInventoryRow';
import { handleSortInventory } from '../../../hooks/handleSortInventory';
import { getKeyModifier } from '../../../hooks/getKeyModifier'

export const StorageContainer = () => {
    const [display, setDisplay] = useState<boolean>(false);

    const [playerMoney, setPlayerMoney] = useState<number | undefined>(0);
    const [targetMoney, setTargetMoney] = useState<number | undefined>(0);
    const [playerInventory, setPlayerInventory] = useState<SozInventoryModel | null>();
    const [targetInventory, setTargetInventory] = useState<SozInventoryModel | null>();

    const closeMenu = useCallback(() => {
        setDisplay(false);
        setPlayerInventory(null);
        setTargetInventory(null);
    }, [setDisplay, setPlayerInventory, setTargetInventory]);

    const targetInventoryBanner = useMemo(() => {
        let type = targetInventory?.type || 'default';

        if (type === 'stash') type = 'storage';
        if (type === 'ammo') type = 'armory';
        if (type === 'tanker') type = 'trunk';
        if (type === 'trailerlogs') type = 'trunk';
        if (type === 'brickade') type = 'trunk';
        if (type === 'trash') type = 'trunk';
        if (type === 'tiptruck') type = 'trunk';
        if (type === 'metal_storage') type = 'default';
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

                    if (event.data.targetInventory.type == 'player') {
                        setPlayerMoney(event.data.playerMoney || -1);
                        setTargetMoney(event.data.targetMoney || -1);
                    }
                    else {
                        setPlayerMoney(-1);
                        setTargetMoney(undefined);
                    }

                    setDisplay(true);
                } catch (e: any) {
                    console.error(e, event.data.playerInventory, event.data.targetInventory);
                    closeNUI(
                        () => {
                            closeMenu();
                        },
                        {
                            target: targetInventory?.id,
                        },
                    );
                }
            } else if (event.data.action === 'updateInventory') {
                try {
                    if (event.data.playerInventory !== undefined) {
                        if (typeof event.data.playerInventory === "object") {
                            event.data.playerInventory.items = Object.values(event.data.playerInventory.items);
                        }
                        event.data.playerInventory.items = event.data.playerInventory.items.filter((i: InventoryItem) => i !== null)

                        setPlayerInventory(event.data.playerInventory);
                    }
                    if (event.data.targetInventory !== undefined) {
                        if (typeof event.data.targetInventory === "object") {
                            event.data.targetInventory.items = Object.values(event.data.targetInventory.items);
                        }
                        event.data.targetInventory.items = event.data.targetInventory.items.filter((i: InventoryItem) => i !== null)

                        setTargetInventory(event.data.targetInventory);
                    }
                } catch (e: any) {
                    console.error(e, event.data.playerInventory, event.data.targetInventory);
                    closeNUI(
                        () => {
                            closeMenu();
                        },
                        {
                            target: targetInventory?.id,
                        },
                    );
                }
            } else if (display && event.data.action === 'closeInventory') {
                closeNUI(
                    () => {
                        closeMenu();
                    },
                    {
                        target: targetInventory?.id,
                    },
                );
            } else if (event.data.action === 'openShop' || event.data.action === 'openInventory' || event.data.action === 'openPlayerKeyInventory' || event.data.action === 'openPlayerWalletInventory') {
                closeMenu();
            }
        },
        [closeMenu, setPlayerInventory, setTargetInventory, setPlayerMoney, setTargetMoney, display],
    );

    const onKeyDownReceived = useCallback(
        (event: KeyboardEvent) => {
            if (display && !event.repeat && event.key === 'Escape') {
                fetch(`https://soz-inventory/closeNUI`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        target: targetInventory?.id,
                    }),
                }).then(() => {
                    closeMenu();
                });
            }
        },
        [targetInventory, closeMenu, display],
    );

    const handleInventoryUpdate = useCallback((apiResponse: {sourceInventory?: SozInventoryModel; targetInventory?: SozInventoryModel; inverse: boolean}) => {
        if (!apiResponse.sourceInventory || !apiResponse.targetInventory) return;
        if (apiResponse.sourceInventory.id === apiResponse.targetInventory.id) return;

        let sourceInventory = apiResponse.sourceInventory;
        let targetInventory = apiResponse.targetInventory;

        if (apiResponse.inverse) {
            sourceInventory = apiResponse.targetInventory;
            targetInventory = apiResponse.sourceInventory;
        }

        setPlayerInventory(sourceInventory);
        setTargetInventory(targetInventory);
    }, [setPlayerInventory, setTargetInventory])


    const handleMoneyUpdate = useCallback((apiResponse: {sourceMoney: number; targetMoney: number, inverse: boolean}) => {
        if (apiResponse.inverse) {
            setPlayerMoney(apiResponse.targetMoney || -1);
            setTargetMoney(apiResponse.sourceMoney || -1);
        } else {
            setPlayerMoney(apiResponse.sourceMoney || -1);
            setTargetMoney(apiResponse.targetMoney || -1);
        }
    }, [setPlayerMoney, setTargetMoney])

    const transfertItem = useCallback((event: DragEndEvent) => {

        if (!event.active.data.current) return;
        if (!event.over?.data.current) return;
        const keyEvent = event?.activatorEvent as KeyboardEvent


        if (event.active.id == 'player_drag_money_') {
            if (event.over.data.current.container === 'player') {
                return;
            }
            fetch(`https://soz-inventory/transfertMoney`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    target: targetInventory?.id,
                }),
            })
                .then((res) => res.json())
                .then((transfert) => handleMoneyUpdate(transfert));

        } else if (event.active.id == 'storage_drag_money_') {
            if (event.over.data.current.container === 'storage') {
                return;
            }
            fetch(`https://soz-inventory/transfertMoney`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    target: targetInventory?.id,
                    inverse: true,
                }),
            })
                .then((res) => res.json())
                .then((transfert) => handleMoneyUpdate(transfert));

        } else if (event.active.data.current.container === event.over.data.current.container) {
            if (event.active.id == 'player_drag_money_' ||
                event.over.id == 'player_money' ||
                event.active.id == 'storage_drag_money_' ||
                event.over.id == 'storage_money'
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
                    inventory: event.active.data.current.container === 'player' ? playerInventory?.id : targetInventory?.id,
                    manualFilter: event.active.data.current.container === 'player' && targetInventory?.type,
                    keyModifier: getKeyModifier(keyEvent)
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
            if (event.active.id == 'player_drag_money_' ||
                event.over.id == 'player_money' ||
                event.active.id == 'storage_drag_money_' ||
                event.over.id == 'storage_money'
            ) {
                return;
            }

            const sourceInvId = event.active.data.current.container === 'player' ? playerInventory?.id : targetInventory?.id;
            const targetInvId = event.over.data.current.container === 'player' ? playerInventory?.id : targetInventory?.id;
            const inverse = event.active.data.current.container === 'storage';
            const targetMaxWeight = event.over.data.current.container === 'player' ? playerInventory?.maxWeight : targetInventory?.maxWeight;
            const targetCurrentWeight = event.over.data.current.container === 'player' ? playerInventory?.weight : targetInventory?.weight;

            fetch(`https://soz-inventory/transfertItem`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    source: sourceInvId,
                    target: targetInvId,
                    targetCurrentWeight: targetCurrentWeight,
                    targetMaxWeight: targetMaxWeight,
                    item: event.active.data.current.item,
                    slot: event.over.data.current.slot,
                    keyModifier: getKeyModifier(keyEvent)
                }),
            })
                .then((res) => res.json())
                .then((transfert) => handleInventoryUpdate({...transfert, inverse: inverse}));
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
                        {display &&
            <DndContext
                autoScroll={{
                    enabled: false,
                }}
                collisionDetection={rectIntersection}
                onDragEnd={transfertItem}
            >
                <div className={clsx(style.PlayerContainer)}>
                    <ContainerWrapper
                        display={true}
                        banner={playerBanner}
                        weight={playerInventory.weight}
                        maxWeight={playerInventory.maxWeight}
                    >
                        <ContainerSlots
                            id='player'
                            rows={playerInventoryRow}
                            money={playerMoney}
                            items={playerInventory.items.map((item, i) => ({ ...item, id: i }))}
                        />
                    </ContainerWrapper>
                </div>

                <div className={clsx(style.StorageContainer)}>
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
                            money={targetMoney}
                            items={targetInventory.items.map((item, i) => ({ ...item, id: i }))}
                        />
                    </ContainerWrapper>
                </div>
            </DndContext>
}
        </div>
    );
};

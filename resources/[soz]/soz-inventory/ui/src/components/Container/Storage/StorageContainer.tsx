import { useCallback, useEffect, useRef, useState } from 'react';
import { debugPlayerInventory, debugStorageInventory } from '../../../test/debug';
import { InventoryItem, SozInventoryModel } from '../../../types/inventory';
import { ContainerWrapper } from '../ContainerWrapper';
import style from './StorageContainer.module.css';
import { ContainerSlots } from '../ContainerSlots';
import playerBanner from '/banner/player.jpg'
import { closeNUI } from '../../../hooks/nui';
import { clsx } from 'clsx';

export const StorageContainer = () => {
    const [display, setDisplay] = useState<boolean>(false);

    const [playerInventory, setPlayerInventory] = useState<SozInventoryModel | null>();
    const [targetInventory, setTargetInventory] = useState<SozInventoryModel | null>();

    const onMessageReceived = useCallback(
        (event: MessageEvent) => {
            if (event.data.action === "openInventory") {
                if (event.data.playerInventory === undefined || event.data.targetInventory === undefined) return;

                try {
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
                        }
                    );
                }
            } else if (event.data.action === "updateInventory") {
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
                        }
                    );
                }
            } else if (event.data.action === "closeInventory") {
                closeNUI(
                    () => {
                        setDisplay(false);
                    },
                    {
                        target: targetInventory?.id,
                    }
                );
            }
        },
        [setDisplay, setPlayerInventory, setTargetInventory]
    );

    const onKeyDownReceived = useCallback(
        (event: KeyboardEvent) => {
            if (!event.repeat && event.key === "Escape") {
                fetch(`https://soz-inventory/closeNUI`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        target: targetInventory?.id,
                    }),
                }).then(() => {
                    setDisplay(false);
                });
            }
        },
        [targetInventory, setDisplay]
    );

    useEffect(() => {
        window.addEventListener("message", onMessageReceived);
        window.addEventListener("keydown", onKeyDownReceived);

        onMessageReceived({ data: { ...debugStorageInventory } } as MessageEvent);

        return () => {
            window.removeEventListener("message", onMessageReceived);
            window.removeEventListener("keydown", onKeyDownReceived);
        };
    }, [onMessageReceived, onKeyDownReceived]);

    if (!playerInventory || !targetInventory) {
        return null;
    }

    return (
        <div className={style.Wrapper}>
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
                        rows={Math.ceil(playerInventory.items.length / 5)}
                        items={playerInventory.items.map((item, i) => ({...item, id: i}))}
                        setItems={(s) => {
                            setPlayerInventory({...playerInventory, items: s})
                        }}
                    />
                </ContainerWrapper>
            </div>

            <div className={clsx(style.StorageContainer, {
                [style.Show]: display,
                [style.Hide]: !display,
            })}>
                <ContainerWrapper
                    display={true}
                    banner={playerBanner}
                    weight={targetInventory.weight}
                    maxWeight={targetInventory.maxWeight}
                >
                    <ContainerSlots
                        rows={Math.ceil(targetInventory.items.length / 5)}
                        items={targetInventory.items.map((item, i) => ({...item, id: i}))}
                        setItems={(s) => {
                            setPlayerInventory({...targetInventory, items: s})
                        }}
                    />
                </ContainerWrapper>
            </div>
        </div>
    )
}

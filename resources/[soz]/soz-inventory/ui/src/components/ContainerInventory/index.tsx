import { useCallback, useEffect, useState } from "react";
import { /*InventoryItem, */SortableContainer } from "../InventoryItem";
import { InventoryItem, SozInventoryModel } from '../../types/inventory';
import { ReactSortable } from "react-sortablejs";
import styles from "./styles.module.css";
import cn from "classnames";
import { closeNUI } from "../../hooks/nui";
import { debugPlayerInventory } from '../../test/debug';

const ContainerInventory = () => {
    const [display, setDisplay] = useState<boolean>(false);

    const [playerInventory, setPlayerInventory] = useState<SozInventoryModel>(debugPlayerInventory.playerInventory);
    const [playerInventoryItems, setPlayerInventoryItems] = useState<InventoryItem[]>([]);

    const [targetInventory, setTargetInventory] = useState<SozInventoryModel>(debugPlayerInventory.playerInventory);
    const [targetInventoryItems, setTargetInventoryItems] = useState<InventoryItem[]>([]);

    const getBanner = useCallback((type: string) => {
        let headerImage = type;

        if (type === "stash") headerImage = "storage";
        if (type === "ammo") headerImage = "armory";
        if (type === "tanker") headerImage = "trunk";
        if (type === "trailerlogs") headerImage = "trunk";
        if (type === "brickade") headerImage = "trunk";
        if (type === "trash") headerImage = "trunk";
        if (type === "storage") headerImage = "default";
        if (type === "storage_tank") headerImage = "default";

        return headerImage;
    }, []);

    // @ts-ignore
    const transfertItem = useCallback((event: any) => {
        fetch(`https://soz-inventory/transfertItem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                source: event.from.dataset.inventory,
                target: event.to.dataset.inventory,
                item: event.item.dataset.item,
            }),
        })
            .then((res) => res.json())
            .then((transfert) => {
                if (transfert.playerInventory === undefined && transfert.targetInventory === undefined) return;
                if (transfert.sourceInventory.id == transfert.targetInventory.id) return;

                let sourceInventory = transfert.sourceInventory;
                let targetInventory = transfert.targetInventory;

                if (transfert.targetInventory.type === "player") {
                    sourceInventory = transfert.targetInventory;
                    targetInventory = transfert.sourceInventory;
                }

                setPlayerInventory(sourceInventory);
                setTargetInventory(targetInventory);
                setPlayerInventoryItems(sourceInventory.items.map((item: InventoryItem) => ({ ...item, id: `source_${item.slot}` })));
                setTargetInventoryItems(targetInventory.items.map((item: InventoryItem) => ({ ...item, id: `target_${item.slot}` })));
            });
    }, []);

    const onMessageReceived = useCallback(
        (event: MessageEvent) => {
            if (event.data.action === "openInventory") {
                if (event.data.playerInventory === undefined || event.data.targetInventory === undefined) return;

                try {
                    setPlayerInventory(event.data.playerInventory);
                    setTargetInventory(event.data.targetInventory);

                    setPlayerInventoryItems(
                        event.data.playerInventory.items
                            .filter((i: InventoryItem) => i !== null)
                            .map((item: InventoryItem) => ({ ...item, id: `source_${item.slot}` }))
                    );
                    setTargetInventoryItems(
                        event.data.targetInventory.items
                            .filter((i: InventoryItem) => i !== null)
                            .map((item: InventoryItem) => ({ ...item, id: `target_${item.slot}` }))
                    );

                    setDisplay(true);
                } catch (e: any) {
                    console.error(e, event.data.playerInventory, event.data.targetInventory);
                    closeNUI(
                        () => {
                            setDisplay(false);
                        },
                        {
                            target: targetInventory.id,
                        }
                    );
                }
            } else if (event.data.action === "updateInventory") {
                try {
                    if (event.data.playerInventory !== undefined) {
                        setPlayerInventory(event.data.playerInventory);
                        setPlayerInventoryItems(
                            event.data.playerInventory.items
                                .filter((i: InventoryItem) => i !== null)
                                .map((item: InventoryItem) => ({ ...item, id: `source_${item.slot}` }))
                        );
                    }
                    if (event.data.targetInventory !== undefined) {
                        setTargetInventory(event.data.targetInventory);
                        setTargetInventoryItems(
                            event.data.targetInventory.items
                                .filter((i: InventoryItem) => i !== null)
                                .map((item: InventoryItem) => ({ ...item, id: `target_${item.slot}` }))
                        );
                    }
                } catch (e: any) {
                    console.error(e, event.data.playerInventory, event.data.targetInventory);
                    closeNUI(
                        () => {
                            setDisplay(false);
                        },
                        {
                            target: targetInventory.id,
                        }
                    );
                }
            } else if (event.data.action === "closeInventory") {
                closeNUI(
                    () => {
                        setDisplay(false);
                    },
                    {
                        target: targetInventory.id,
                    }
                );
            }
        },
        [setDisplay, setPlayerInventory, setTargetInventory, setPlayerInventoryItems, setTargetInventoryItems]
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
                        target: targetInventory.id,
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

        return () => {
            window.removeEventListener("message", onMessageReceived);
            window.removeEventListener("keydown", onKeyDownReceived);
        };
    }, [onMessageReceived, onKeyDownReceived]);

    if (playerInventory === undefined || targetInventory === undefined) return null;

    return (
        <main
            className={cn(styles.container, {
                [styles.container_show]: display,
                [styles.container_hide]: !display,
            })}
        >
            <section>
                <header className={cn(styles.banner, styles[getBanner(playerInventory.type)])}>
                    <span>
                        {playerInventory.weight / 1000}/{playerInventory.maxWeight / 1000} Kg
                    </span>
                </header>

                {/* @ts-ignore */}
                <ReactSortable
                    forceFallback={true} // FIVEM...
                    tag={SortableContainer}
                    id={playerInventory.id}
                    /*list={playerInventoryItems}
                    setList={setPlayerInventoryItems}*/
                    group="sozInventory"
                    sort={false}
                    animation={150}
                    onEnd={transfertItem}
                >
                    {/*{playerInventoryItems*/}
                    {/*    .sort((a, b) => a.label.localeCompare(b.label))*/}
                    {/*    .map((item) => (*/}
                    {/*        <InventoryItem key={item.id} item={item} />*/}
                    {/*    ))}*/}
                </ReactSortable>
            </section>

            <section>
                <header className={cn(styles.banner, styles[getBanner(targetInventory.type)])}>
                    <span>
                        {targetInventory.weight / 1000}/{targetInventory.maxWeight / 1000} Kg
                    </span>
                </header>

                {/* @ts-ignore */}
                <ReactSortable
                    forceFallback={true} // FIVEM...
                    tag={SortableContainer}
                    id={targetInventory.id}
                    /*list={targetInventoryItems}
                    setList={setTargetInventoryItems}*/
                    group="sozInventory"
                    sort={false}
                    animation={150}
                    onEnd={transfertItem}
                >
                    {/*{targetInventoryItems*/}
                    {/*    .sort((a, b) => a.label.localeCompare(b.label))*/}
                    {/*    .map((item) => (*/}
                    {/*        <InventoryItem key={item.id} item={item} />*/}
                    {/*    ))}*/}
                </ReactSortable>
            </section>
        </main>
    );
};

export default ContainerInventory;

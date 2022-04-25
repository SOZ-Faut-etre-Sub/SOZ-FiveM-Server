import {useCallback, useEffect, useState} from "react";
import {InventoryItem, SortableContainer} from "../InventoryItem";
import {IInventoryEvent, IInventoryItem} from "../../types/inventory";
import { ReactSortable } from "react-sortablejs";
import styles from "../PlayerInventory/styles.module.css";
import cn from "classnames";

const KeyInventory = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const [playerInventoryKeys, setPlayerInventoryKeys] = useState<IInventoryItem[]>([]);

    const transfertItem = useCallback((event: any) => {
        if (event.item.dataset.item === undefined) return

        fetch(`https://soz-inventory/player/giveKeyToTarget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: event.item.dataset.item
        }).then(() => {
            setDisplay(false);
        });
    }, [setDisplay]);

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === "openPlayerKeyInventory") {
            if (event.data.keys === undefined) return

            setPlayerInventoryKeys(event.data.keys.filter((i: IInventoryEvent) => i !== null).map((item: IInventoryItem) => ({...item, id: `key_${item.slot}`})));
            setDisplay(true);
        }
    }, [setDisplay, setPlayerInventoryKeys]);

    const onKeyDownReceived = useCallback((event: KeyboardEvent) => {
        if (!event.repeat && event.key === 'Escape') {
            fetch(`https://soz-inventory/closeNUI`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({})
            }).then(() => {
                setDisplay(false);
            });
        }
    }, [setDisplay])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)
        window.addEventListener('keydown', onKeyDownReceived)

        return () => {
            window.removeEventListener('message', onMessageReceived)
            window.removeEventListener('keydown', onKeyDownReceived)
        }
    }, [onMessageReceived, onKeyDownReceived]);

    return (
        <main className={
            cn(styles.container, {
                [styles.container_show]: display,
                [styles.container_hide]: !display,
            })
        }>
            <header className={styles.banner} />

            {/* @ts-ignore */}
            <ReactSortable
                forceFallback={true} // FIVEM...
                tag={SortableContainer}
                list={playerInventoryKeys}
                setList={setPlayerInventoryKeys}
                sort={false}
                animation={150}
                onEnd={transfertItem}
            >
                {playerInventoryKeys.map(item => (
                    <InventoryItem key={item.id} item={item} />
                ))}
            </ReactSortable>
        </main>
    );
}

export default KeyInventory

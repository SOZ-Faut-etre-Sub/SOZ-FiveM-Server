import {useCallback, useEffect, useRef, useState} from "react";
import {/*InventoryItem,*/ SortableContainer} from "../InventoryItem";
import {InventoryItem} from "../../types/inventory";
import { ReactSortable } from "react-sortablejs";
import styles from "../PlayerInventory/styles.module.css";
import cn from "classnames";
import {closeNUI} from "../../hooks/nui";

const KeyInventory = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [playerInventoryKeys, setPlayerInventoryKeys] = useState<InventoryItem[]>([]);

    const transfertItem = useCallback((event: any) => {
        if (event.item.dataset.item === undefined) return

        fetch(`https://soz-inventory/player/giveKeyToTarget`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: event.item.dataset.item
        }).then(() => {
            closeNUI(() => setDisplay(false));
        });
    }, [setDisplay]);

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === "openPlayerKeyInventory") {
            if (event.data.keys === undefined) return

            setPlayerInventoryKeys(event.data.keys.filter((i: InventoryItem) => i !== null).map((item: InventoryItem) => ({...item, id: `key_${item.slot}`})));
            setDisplay(true);
        }
    }, [setDisplay, setPlayerInventoryKeys]);

    const onKeyDownReceived = useCallback((event: KeyboardEvent) => {
        if (display && !event.repeat && event.key === 'Escape') {
            closeNUI(() => setDisplay(false));
        }
    }, [display, setDisplay])

    const onClickReceived = useCallback((event: MouseEvent) => {
        if (display &&menuRef.current && !menuRef.current.contains(event.target as Node)){
            event.preventDefault();
            closeNUI(() => setDisplay(false));
        }
    }, [menuRef, display, setDisplay])

    useEffect(() => {
        window.addEventListener('contextmenu', onClickReceived)
        window.addEventListener('message', onMessageReceived)
        window.addEventListener('keydown', onKeyDownReceived)

        return () => {
            window.removeEventListener('contextmenu', onClickReceived)
            window.removeEventListener('message', onMessageReceived)
            window.removeEventListener('keydown', onKeyDownReceived)
        }
    }, [onMessageReceived, onKeyDownReceived]);

    return (
        <main ref={menuRef} className={
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
                /*list={playerInventoryKeys}
                setList={setPlayerInventoryKeys}*/
                sort={false}
                animation={150}
                onEnd={transfertItem}
            >
                {/*{playerInventoryKeys.map(item => (*/}
                {/*    <InventoryItem key={item.id} item={item} />*/}
                {/*))}*/}
            </ReactSortable>
        </main>
    );
}

export default KeyInventory

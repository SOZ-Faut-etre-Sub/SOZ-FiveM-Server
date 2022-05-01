import {useCallback, useEffect, useRef, useState} from "react";
import {InventoryItem, SortableContainer} from "../InventoryItem";
import {IInventoryEvent, IInventoryItem} from "../../types/inventory";
import { ReactSortable } from "react-sortablejs";
import {closeNUI} from "../../hooks/nui";
import styles from "./styles.module.css";
import cn from "classnames";

const PlayerInventory = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [playerMoney, setPlayerMoney] = useState<number>(0);
    const [playerInventory, setPlayerInventory] = useState<IInventoryEvent>({id: 'source', type: '', weight: 0, maxWeight: 0});
    const [playerInventoryItems, setPlayerInventoryItems] = useState<IInventoryItem[]>([]);

    const interactAction = useCallback((action: string, item: IInventoryItem) => {
        fetch(`https://soz-inventory/player/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(item)
        }).then(() => {
            setDisplay(false);
        });
    }, [setDisplay]);

    const transfertItem = useCallback((event: any) => {
        if (event.item.dataset.item === undefined) return

        fetch(`https://soz-inventory/player/giveItemToTarget`, {
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
        if (event.data.action === "openPlayerInventory") {
            if (event.data.playerInventory === undefined) return

            setPlayerInventory(event.data.playerInventory);
            setPlayerInventoryItems(event.data.playerInventory.items.filter((i: IInventoryEvent) => i !== null).map((item: IInventoryItem) => ({...item, id: `player_${item.slot}`})));
            setPlayerMoney(event.data.playerMoney);

            setDisplay(true);
        }
    }, [setDisplay, setPlayerMoney, setPlayerInventory, setPlayerInventoryItems]);

    const onKeyDownReceived = useCallback((event: KeyboardEvent) => {
        if (display && !event.repeat && (event.key === 'Escape' || event.key === 'F2')) {
            closeNUI(() => setDisplay(false));
        }
    }, [display, setDisplay])

    const onClickReceived = useCallback((event: MouseEvent) => {
        if (display && menuRef.current && !menuRef.current.contains(event.target as Node)){
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

    if (playerInventory === undefined) return null;

    return (
        <main ref={menuRef} className={
            cn(styles.container, {
                [styles.container_show]: display,
                [styles.container_hide]: !display,
            })
        }>
            <header className={styles.banner}>
                <span>{playerInventory.weight / 1000}/{playerInventory.maxWeight / 1000} Kg </span>
            </header>

            {/* @ts-ignore */}
            <ReactSortable
                forceFallback={true} // FIVEM...
                tag={SortableContainer}
                id={playerInventory.id}
                list={playerInventoryItems}
                setList={setPlayerInventoryItems}
                sort={false}
                animation={150}
                onEnd={transfertItem}
            >
                <InventoryItem key="player_money" money={playerMoney} contextMenu={true} interactAction={interactAction} />
                {playerInventoryItems.map(item => (
                    <InventoryItem key={item.id} item={item} contextMenu={true} interactAction={interactAction} />
                ))}
            </ReactSortable>
        </main>
    );
}

export default PlayerInventory

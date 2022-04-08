import {useCallback, useEffect, useState, forwardRef} from "react";
import {IInventoryEvent, IInventoryItem} from "../types/inventory";
import cn from "classnames";
import styles from "./styles.module.css";
import InventoryItem from "./InventoryItem";
import { ReactSortable } from "react-sortablejs";

const SortableContainer = forwardRef<HTMLDivElement, any>((props, ref) => {
    return <div className={styles.content} ref={ref} data-inventory={props.id}>{props.children}</div>;
});

const App = () => {
    const [display, setDisplay] = useState<boolean>(false);

    const [playerInventory, setPlayerInventory] = useState<IInventoryEvent>({id: 'source', type: '', weight: 0, maxWeight: 0});
    const [playerInventoryItems, setPlayerInventoryItems] = useState<IInventoryItem[]>([]);

    const [targetInventory, setTargetInventory] = useState<IInventoryEvent>({id: 'target', type: '', weight: 0, maxWeight: 0});
    const [targetInventoryItems, setTargetInventoryItems] = useState<IInventoryItem[]>([]);

    const getBanner = useCallback((type: string) => {
        let headerImage = type

        if (type === 'stash') headerImage = 'storage'
        if (type === 'ammo') headerImage = 'armory'

        return headerImage
    }, []);

    const transfertItem = useCallback((event: any) => {
        fetch(`https://soz-inventory/transfertItem`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                source: event.from.dataset.inventory,
                target: event.to.dataset.inventory,
                item: event.item.dataset.item,
            })
        });
    }, []);

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === "openInventory") {
            if (event.data.playerInventory === undefined || event.data.targetInventory === undefined) return

            setPlayerInventory(event.data.playerInventory);
            setTargetInventory(event.data.targetInventory);

            setPlayerInventoryItems(event.data.playerInventory.items.map((item: IInventoryItem) => ({...item, id: `source_${item.slot}`})));
            setTargetInventoryItems(event.data.targetInventory.items.map((item: IInventoryItem) => ({...item, id: `target_${item.slot}`})));

            setDisplay(true);
        } else if (event.data.action === "updateInventory") {
            setTargetInventoryItems(event.data.targetInventory.items.map((item: IInventoryItem) => ({...item, id: `target_${item.slot}`})));
        }
    }, [setDisplay, setPlayerInventory, setTargetInventory, setPlayerInventoryItems, setTargetInventoryItems]);

    const onKeyUpReceived = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setDisplay(false);

            fetch(`https://soz-inventory/closeNUI`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    target: targetInventory.id,
                })
            });
        }
    }, [targetInventory, setDisplay])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)
        window.addEventListener('keyup', onKeyUpReceived)

        return () => {
            window.removeEventListener('message', onMessageReceived)
            window.removeEventListener('keyup', onKeyUpReceived)
        }
    }, [onMessageReceived, onKeyUpReceived]);

    if (playerInventory === undefined || targetInventory === undefined) return null;

    return (
        <main className={
            cn(styles.container, {
                [styles.container_show]: display,
                [styles.container_hide]: !display,
            })
        }>
            <div className={styles.inventory}>
                <header className={cn(styles.banner, styles[getBanner(playerInventory.type)])}>
                    <span>{playerInventory.weight / 1000}/{playerInventory.maxWeight / 1000} Kg</span>
                </header>

                {/* @ts-ignore */}
                <ReactSortable
                    forceFallback={true} // FIVEM...
                    tag={SortableContainer}
                    id={playerInventory.id}
                    list={playerInventoryItems}
                    setList={setPlayerInventoryItems}
                    group="sozInventory"
                    sort={false}
                    animation={150}
                    onEnd={transfertItem}
                >
                    {playerInventoryItems.map(item => (
                        <InventoryItem key={item.id} item={item} />
                    ))}
                </ReactSortable>
            </div>

            <div className={styles.inventory}>
                <header className={cn(styles.banner, styles[getBanner(targetInventory.type)])}>
                    <span>{targetInventory.weight / 1000}/{targetInventory.maxWeight / 1000} Kg</span>
                </header>

                {/* @ts-ignore */}
                <ReactSortable
                    forceFallback={true} // FIVEM...
                    tag={SortableContainer}
                    id={targetInventory.id}
                    list={targetInventoryItems}
                    setList={setTargetInventoryItems}
                    group="sozInventory"
                    sort={false}
                    animation={150}
                    onEnd={transfertItem}
                >
                    {targetInventoryItems.map(item => (
                        <InventoryItem key={item.id} item={item} />
                    ))}
                </ReactSortable>
            </div>
        </main>
    );
}

export default App;

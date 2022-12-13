import { useCallback, useEffect, useRef, useState } from "react";
import { /*InventoryItem,*/ SortableContainer } from "../InventoryItem";
import {  SozInventoryModel, InventoryItem } from '../../types/inventory';
import { ReactSortable } from "react-sortablejs";
import styles from "./styles.module.css";
import cn from "classnames";
import { debugPlayerInventory } from '../../test/debug';

const PlayerInventory = () => {
    const [display, setDisplay] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const [playerInventory, setPlayerInventory] = useState<SozInventoryModel>(debugPlayerInventory.playerInventory);
    const [inContextMenu, setInContextMenu] = useState<Record<string, boolean>>({});


    const transfertItem = useCallback(
        (event: any) => {
            if (event.item.dataset.item === undefined) return;

            const item = JSON.parse(event.item.dataset.item);

            if (inContextMenu[item.id]) {
                return;
            }

            fetch(`https://soz-inventory/player/giveItemToTarget`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: event.item.dataset.item,
            }).then(() => {
                setDisplay(false);
            });
        },
        [setDisplay, inContextMenu]
    );

    return null;
};

export default PlayerInventory;

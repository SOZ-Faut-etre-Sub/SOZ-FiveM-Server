import React, { memo } from 'react';
import {IInventoryItem} from "../../types/inventory";
import styles from "./styles.module.css";

const InventoryItem: React.FC<{ item: IInventoryItem }> = ({item}) => {
    return (
        <div className={styles.item} data-item={JSON.stringify(item)}>
            <img className={styles.icon} src={`https://nui-img/soz-items/${item.name}`} alt=""/>
            <div className={styles.label}>{item.amount} {item.label}</div>
            <span className={styles.tooltip}>{item.description}</span>
        </div>
    );
}

export default memo(InventoryItem);

import React, {useRef, forwardRef, memo, useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {IInventoryItem} from "../../types/inventory";
import styles from "./styles.module.css";


const InventoryItem: React.FC<{ item?: IInventoryItem, money?: number, contextMenu?: boolean, interactAction?: any }> = memo(({item, money, contextMenu, interactAction}) => {
    const [contextData, setContextData] = useState({ visible: false, posX: 0, posY: 0});
    const itemRef = useRef<HTMLDivElement>(null);
    const contextRef = useRef<HTMLDivElement>(null);

    const onContextMenuReceived = useCallback((event: MouseEvent) => {
        if (itemRef.current && itemRef.current.contains(event.target as Node)) {
            event.preventDefault();
            setContextData({ visible: true, posX: event.clientX, posY: event.clientY })
        } else if(contextRef.current && !contextRef.current.contains(event.target as Node)){
            setContextData({ ...contextData, visible: false })
        }
    }, [itemRef, contextRef, setContextData])
    const onClickReceived = useCallback((event: MouseEvent) => {
        if(contextRef.current && !contextRef.current.contains(event.target as Node)){
            setContextData({ ...contextData, visible: false })
        }
    }, [contextRef, setContextData])

    useEffect(() => {
        window.addEventListener('click', onClickReceived)
        window.addEventListener('contextmenu', onContextMenuReceived)

        return () => {
            window.removeEventListener('click', onClickReceived)
            window.removeEventListener('contextmenu', onContextMenuReceived)
        }
    }, [onClickReceived, onContextMenuReceived]);
    useLayoutEffect(() => {
        if (contextRef.current && contextData.posX + contextRef.current.offsetWidth > window.innerWidth){
            setContextData({ ...contextData, posX: contextData.posX - contextRef.current.offsetWidth})
        }
        if (contextRef.current && contextData.posY + contextRef.current.offsetHeight > window.innerHeight){
            setContextData({ ...contextData, posY: contextData.posY - contextRef.current.offsetHeight})
        }
    }, [contextRef, contextData])

    return (
        <div ref={itemRef} className={styles.item} data-item={JSON.stringify(item)}>
            {item && <img className={styles.icon} src={`https://nui-img/soz-items/${item.name}`} alt=""/> }
            <div className={styles.label}>
                <span>{item ? `${item.amount} ${item.label}` : 'Mon argent'}</span>
                <span>{money && money.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</span>
            </div>
            {item && <span className={styles.tooltip}>{item.description}</span> }

            {contextMenu && (
                <div ref={contextRef} className={styles.contextMenu} style={{ display:`${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY }}>
                    <div className={styles.optionsList}>
                        {item && (item.useable || item.type === 'weapon') && <li className={styles.optionListItem} onClick={() => {
                            setContextData({ ...contextData, visible: false })
                            interactAction('useItem', item)
                        }}>
                            {item.type === 'weapon' ? 'Équiper' : 'Utiliser'}
                        </li>}
                        {item && <li className={styles.optionListItem} onClick={() => {
                             setContextData({ ...contextData, visible: false })
                             interactAction('giveItem', item)
                         }}>
                            Donner
                        </li>}
                        {money ? (<>
                            <li className={styles.optionListItem} onClick={() => {
                                 setContextData({ ...contextData, visible: false })
                                 interactAction('giveMoney', item)
                             }}>
                                Donner en propre
                            </li>
                            <li className={styles.optionListItem} onClick={() => {
                                 setContextData({ ...contextData, visible: false })
                                 interactAction('giveMarkedMoney', item)
                             }}>
                                Donner en sale
                            </li>
                        </>) : null}
                    </div>
                </div>
            )}
        </div>
    );
})
InventoryItem.defaultProps = {
    contextMenu: false
}

const SortableContainer = forwardRef<HTMLDivElement, any>((props, ref) => {
    return <div className={styles.content} ref={ref} data-inventory={props.id}>{props.children}</div>;
});

export {InventoryItem, SortableContainer};

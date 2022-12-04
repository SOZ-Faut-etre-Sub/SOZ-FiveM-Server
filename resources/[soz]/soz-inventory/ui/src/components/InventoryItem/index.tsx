import React, {useRef, forwardRef, memo, useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {InventoryItem} from "../../types/inventory";
import styles from "./styles.module.css";

type InventoryItemProps = {
    item?: InventoryItem;
    money?: number;
    contextMenu?: boolean;
    interactAction?: any;
    setInContext?: (inContext: boolean) => void;
};

const InventoryItems: React.FC<InventoryItemProps> = memo(({
    item,
    money,
    contextMenu,
    interactAction,
    setInContext = () => {},
}) => {
    const [contextData, setContextData] = useState({visible: false, posX: 0, posY: 0});
    const itemRef = useRef<HTMLDivElement>(null);
    const contextRef = useRef<HTMLDivElement>(null);

    const onContextMenuReceived = useCallback((event: MouseEvent) => {
        if (itemRef.current && itemRef.current.contains(event.target as Node)) {
            event.preventDefault();
            setContextData({visible: true, posX: event.clientX, posY: event.clientY});
        } else if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
            setContextData({...contextData, visible: false});
        }
    }, [itemRef, contextRef, setContextData])
    const onClickReceived = useCallback((event: MouseEvent) => {
        if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
            setContextData({...contextData, visible: false});
        }
    }, [contextRef, setContextData])

    useEffect(() => {
        setInContext(contextData.visible);
    }, [contextData])

    useEffect(() => {
        window.addEventListener('click', onClickReceived)
        window.addEventListener('contextmenu', onContextMenuReceived)

        return () => {
            window.removeEventListener('click', onClickReceived)
            window.removeEventListener('contextmenu', onContextMenuReceived)
        }
    }, [onClickReceived, onContextMenuReceived]);
    useLayoutEffect(() => {
        if (contextRef.current && contextData.posX + contextRef.current.offsetWidth > window.innerWidth) {
            setContextData({...contextData, posX: contextData.posX - contextRef.current.offsetWidth})
        }
        if (contextRef.current && contextData.posY + contextRef.current.offsetHeight > window.innerHeight) {
            setContextData({...contextData, posY: contextData.posY - contextRef.current.offsetHeight})
        }
    }, [contextRef, contextData])

    const getLabel = () => {
        if (!item) return 'Mon argent'

        const amount = /*item.type !== 'key' ?*/ item.amount// : ''
        let extraLabel = ''
        let expiration = ''

        if (item.metadata !== undefined) {
            if (item.metadata['label'] !== undefined) {
                extraLabel = `(${item.metadata['label']})`
            }
            if (item.metadata['expiration'] !== undefined) {
                expiration = (new Date().getTime() > new Date(item.metadata['expiration']).getTime()) ? `[Périmé]` : ''
            }
        }

        return `${amount} ${item.label} ${extraLabel} ${expiration}`
    }

    const createInteractAction = (action: string) => {
        return () => {
            setContextData({...contextData, visible: false});
            interactAction(action, item)
        };
    };

    return (
        <div ref={itemRef} className={styles.item} data-item={JSON.stringify(item)}>
            {item && (
                <img className={styles.icon} src={`https://nui-img/soz-items/${item.name}`} alt="" onError={(e) => e.currentTarget.style.visibility = 'hidden'} onLoad={(e) => e.currentTarget.style.visibility = 'visible'}/>
            )}
            <div className={styles.label}>
                <span>{getLabel()}</span>
                <span>{money && money.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}</span>
            </div>
            {item && <span className={styles.tooltip}>
                {item.description}
                {item.metadata !== undefined && item.metadata['expiration'] !== undefined && <>
                    <br/>
                    <span>Date limite : {new Date(item.metadata['expiration']).toLocaleString('fr-FR', {day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric"})}</span>
                </>}
            </span>}

            <div ref={contextRef} className={styles.contextMenu}
                 style={{display: `${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY}}>
                <div className={styles.optionsList}>
                    {item && (item.useable || item.type === 'weapon') && <li className={styles.optionListItem} onClick={createInteractAction('useItem')}>
                        {item.type === 'weapon' ? 'Équiper' : 'Utiliser'}
                    </li>}
                    {item && <li className={styles.optionListItem} onClick={createInteractAction('giveItem')}>
                        Donner
                    </li>}
                    {money ? (<>
                        <li className={styles.optionListItem} onClick={createInteractAction('giveMoney')}>
                            Donner en propre
                        </li>
                        <li className={styles.optionListItem} onClick={createInteractAction('giveMarkedMoney')}>
                            Donner en sale
                        </li>
                    </>) : null}
                </div>
            </div>
        </div>
    );
})
InventoryItems.defaultProps = {
    contextMenu: false
}

const SortableContainer = forwardRef<HTMLDivElement, any>((props, ref) => {
    return <div className={styles.content} ref={ref} data-inventory={props.id}>{props.children}</div>;
});

export {InventoryItems, SortableContainer};

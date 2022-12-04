import { FunctionComponent, memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { InventoryItem } from '../../types/inventory';
import style from './Item.module.css';

type Props = {
    item: InventoryItem | undefined;
    contextMenu?: boolean;
    interactAction?: any;
    setInContext?: (inContext: boolean) => void;
    onItemHover: (description: string | null) => void;
}

const FORMAT_LOCALIZED: Intl.DateTimeFormatOptions = {day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric"}

const Draggable: FunctionComponent<Props> = ({ item, setInContext, interactAction, onItemHover }) => {
    if (!item) {
        return <div />
    }

    const itemRef = useRef<HTMLDivElement>(null);
    const contextRef = useRef<HTMLDivElement>(null);
    const [contextData, setContextData] = useState({visible: false, posX: 0, posY: 0});

    const resetDescription = useCallback(() => onItemHover(null), [onItemHover]);
    const applyDescription = useCallback(() => {
        const itemLabel = item?.metadata?.label ? item.metadata.label : item.label;
        let itemExtraLabel = '';

        if (item.type === 'weapon') {
            if (item?.metadata?.ammo) {
                itemExtraLabel += ` [${item.metadata.ammo} munitions]`
            }
        } else {
            if (item?.metadata?.expiration) {
                const currentTime = new Date().getTime();
                const expiration = new Date(item.metadata['expiration'])

                if (currentTime > expiration.getTime()) {
                    itemExtraLabel += ` [Périmé]`
                } else {
                    itemExtraLabel += ` [DLC: ${expiration.toLocaleDateString('fr-FR', FORMAT_LOCALIZED)}]`
                }
            }
        }

        onItemHover(`
            <div><b>${itemLabel}</b> <span>${itemExtraLabel}</span></div>
            ${item.description}
        `);
    }, [onItemHover]);

    // const onContextMenuReceived = useCallback((event: MouseEvent) => {
    //     if (itemRef.current && itemRef.current.contains(event.target as Node)) {
    //         event.preventDefault();
    //         setContextData({visible: true, posX: event.clientX, posY: event.clientY});
    //     } else if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
    //         setContextData({...contextData, visible: false});
    //     }
    // }, [itemRef, contextRef, setContextData])
    // const onClickReceived = useCallback((event: MouseEvent) => {
    //     if (contextRef.current && !contextRef.current.contains(event.target as Node)) {
    //         setContextData({...contextData, visible: false});
    //     }
    // }, [contextRef, setContextData])
    //
    // useEffect(() => {
    //     setInContext?.(contextData.visible);
    // }, [contextData])
    //
    // useEffect(() => {
    //     window.addEventListener('click', onClickReceived)
    //     window.addEventListener('contextmenu', onContextMenuReceived)
    //
    //     return () => {
    //         window.removeEventListener('click', onClickReceived)
    //         window.removeEventListener('contextmenu', onContextMenuReceived)
    //     }
    // }, [onClickReceived, onContextMenuReceived]);
    //
    // useLayoutEffect(() => {
    //     if (contextRef.current && contextData.posX + contextRef.current.offsetWidth > window.innerWidth) {
    //         setContextData({...contextData, posX: contextData.posX - contextRef.current.offsetWidth})
    //     }
    //     if (contextRef.current && contextData.posY + contextRef.current.offsetHeight > window.innerHeight) {
    //         setContextData({...contextData, posY: contextData.posY - contextRef.current.offsetHeight})
    //     }
    // }, [contextRef, contextData])
    //
    // const createInteractAction = (action: string) => {
    //     return () => {
    //         setContextData({...contextData, visible: false});
    //         interactAction(action, item)
    //     };
    // };

    return (
        <>
            <div
                ref={itemRef}
                className={style.Card}
                data-item={JSON.stringify(item)}
                onMouseEnter={applyDescription}
                onMouseLeave={resetDescription}
            >
                <img
                    alt=""
                    className={style.Icon}
                    src={`https://nui-img/soz-items/${item.name}`}
                    onError={(e) => e.currentTarget.src = 'https://placekitten.com/200/200'}
                />

                {/*<div ref={contextRef} className={style.ContextMenu}*/}
                {/*     style={{display: `${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY}}>*/}
                {/*    <div className={style.OptionsList}>*/}
                {/*        {item && (item.useable || item.type === 'weapon') && <li className={style.OptionListItem} onClick={createInteractAction('useItem')}>*/}
                {/*            {item.type === 'weapon' ? 'Équiper' : 'Utiliser'}*/}
                {/*        </li>}*/}
                {/*        {item && <li className={style.OptionListItem} onClick={createInteractAction('giveItem')}>*/}
                {/*            Donner*/}
                {/*        </li>}*/}
                {/*        {true ? (<>*/}
                {/*            <li className={style.OptionListItem} onClick={createInteractAction('giveMoney')}>*/}
                {/*                Donner en propre*/}
                {/*            </li>*/}
                {/*            <li className={style.OptionListItem} onClick={createInteractAction('giveMarkedMoney')}>*/}
                {/*                Donner en sale*/}
                {/*            </li>*/}
                {/*        </>) : null}*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </>
    )
};

export default Draggable;

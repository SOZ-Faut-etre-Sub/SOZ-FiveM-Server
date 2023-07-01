import { DragOverlay, useDraggable } from '@dnd-kit/core';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { InventoryItem } from '../../types/inventory';
import style from './Item.module.css';
import {CSS} from '@dnd-kit/utilities';
import apartmentKeyIcon from '/icon/apartment_key.png';
import moneyIcon from '/icon/money.png';
import vehicleKeyIcon from '/icon/vehicle_key.png';
import { clsx } from 'clsx';
import { WeaponAmmo } from '../../types/weapon';
import { createPortal } from 'react-dom';

type Props = {
    id: string;
    containerName: string;
    item?: InventoryItem;
    money?: number;
    contextMenu?: boolean;
    interactAction?: any;
    setInContext?: (inContext: boolean) => void;
    onItemHover?: (description: string | null) => void;
    price?: number
}

const FORMAT_LOCALIZED: Intl.DateTimeFormatOptions = {day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric"}
const FORMAT_CURRENCY: Intl.NumberFormatOptions = {style: "currency", currency: 'USD', maximumFractionDigits: 0}

const Draggable: FunctionComponent<Props> = ({ id, containerName, item, money, interactAction, onItemHover, price }) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: `${id}_${item?.slot ?? ''}`,
        data: {
            container: containerName,
            item
        },
        disabled: item?.disabled === true || money == -1,
    });

    const itemRef = useRef<HTMLDivElement>(null);
    const contextRef = useRef<HTMLDivElement>(null);
    const [contextData, setContextData] = useState({visible: false, posX: 0, posY: 0});

    const transformStyle = {
        transform: CSS.Translate.toString(transform),
    };

    const resetDescription = useCallback(() => onItemHover?.(null), [onItemHover]);
    const applyDescription = useCallback(() => {
        if (!item) {
            return null
        }

        let itemLabel = item?.metadata?.label ? `${item.metadata.label} <small>${item.label}</small>` : item.label;
        let itemExtraLabel = '';
        let contextExtraLabel = '';
        let secondaryDescription = '';
        let crateWeight = 0;

        let illustrator = item.illustrator || ''

        if (item.type === 'weapon') {
            if (item?.metadata?.ammo) {
                itemExtraLabel += ` [${item.metadata.ammo} munitions]`
            }
            if (WeaponAmmo[item.name]) {
                contextExtraLabel += ` Munition : ${WeaponAmmo[item.name]}`
            }
        } else if(item.type === 'fishing_rod'){
            if (item?.metadata?.bait) {
                itemExtraLabel += ` [${item.metadata.bait?.label}]`
            }
        } else if(item.type === 'fish'){
            if(item?.metadata?.weight && item?.metadata?.length){
                secondaryDescription += '<div style="display:flex;flex-direction:column;margin-top:0.5rem;">'
                secondaryDescription += `<span><b>Poids :</b> ${item?.metadata?.weight} grammes </span>`
                secondaryDescription += `<span><b>Taille :</b> ${item?.metadata?.length} centimètres </span>`
                secondaryDescription += `</div>`

            }        
        } else if( item.type === 'crate' && item.metadata?.crateElements?.length){         

            if(item.metadata.label){
                itemLabel = `${item.label} "${item.metadata.label}"`
            }
            item.metadata.crateElements.map(meal => {
                const expiration = new Date(meal?.metadata?.expiration ?? '')
                secondaryDescription += `<br>- ${meal.amount} ${meal.label} [DLC: ${expiration.toLocaleDateString('fr-FR', FORMAT_LOCALIZED)}]`
                crateWeight = crateWeight + (meal.amount * meal.weight)
            })
            
            itemExtraLabel = `[${crateWeight/1000}/12 Kg]`
            
        } else if (item?.metadata?.expiration) {
            const currentTime = new Date().getTime();
            const expiration = new Date(item.metadata['expiration'])

            if (currentTime > expiration.getTime()) {
                itemExtraLabel += ` [Périmé]`
            } else {
                itemExtraLabel += ` [DLC: ${expiration.toLocaleDateString('fr-FR', FORMAT_LOCALIZED)}]`
            }
        }
        else if (item?.metadata?.type && !item?.metadata?.label) {
            itemExtraLabel += ` [${item?.metadata?.type}]`
        }

        if (item?.metadata?.crafted) {
            itemExtraLabel += ` [Illégal]`
        }

        if (item.illustrator && item.illustrator instanceof Object) {
            if (item.name === 'outfit' || item.name === 'armor') {
                illustrator = item.illustrator[item?.metadata?.type || ''] || '';
            }
        }

        onItemHover?.(`
            <div><b>${itemLabel}</b> <span>${itemExtraLabel}</span></div>
            ${item.description ? item.description : ''}
            <div>${secondaryDescription}</div>
            <div><span>${contextExtraLabel}</span> <span>${illustrator}</span></div>
        `);
    }, [item, onItemHover]);

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
        window.addEventListener('click', onClickReceived)
        window.addEventListener('contextmenu', onContextMenuReceived)

        return () => {
            window.removeEventListener('click', onClickReceived)
            window.removeEventListener('contextmenu', onContextMenuReceived)
        }
    }, [onClickReceived, onContextMenuReceived]);

    const createInteractAction = (action: string, shortcut?: number) => {
        return () => {
            setContextData({...contextData, visible: false});
            interactAction(action, item, shortcut)
        };
    };

    const itemIcon = useCallback((item: InventoryItem) => {
        let path = item.name

        if (item.name === 'vehicle_key') {
            return vehicleKeyIcon;
        }
        if (item.name === 'apartment_key') {
            return apartmentKeyIcon;
        }

        if (item.name === 'outfit' || item.name === 'armor') {
            path += `_${item.metadata?.type}`
        } else if (item.name === 'cabinet_zkea') {
            path += `_${item.metadata?.tier}`
        }

        return `https://cfx-nui-soz-core/public/images/items/${path}.webp`
    }, []);

    if (!item && !money) {
        return null
    }

    if (isDragging) {
        if (item) {
            return createPortal(
                <DragOverlay className={style.Card}>
                    <img
                        alt=""
                        className={style.Icon}
                        src={itemIcon(item)}
                        onError={(e) => e.currentTarget.src = 'https://placekitten.com/200/200'}
                    />
                </DragOverlay>, document.body
            )
        }
        else if(money) {
            return createPortal(
                <DragOverlay className={style.Card}>
                    <img
                        alt=""
                        className={style.Icon}
                        src={moneyIcon}
                />
                </DragOverlay>, document.body
            )
        }
    }

    return (
        <div ref={itemRef} className={clsx({
            [style.Money]: !!money,
        })} >
            <div
                ref={setNodeRef}
                style={transformStyle}
                {...listeners}
                {...attributes}
                className={clsx(style.Card, {
                    [style.Disabled]: item?.disabled === true || (money && money < 0),
                })}
                onMouseEnter={applyDescription}
                onMouseLeave={resetDescription}
            >
                {item && (
                    <>
                        {price ?
                        <span className={style.Amount}>
                            {price > 1 && price} $
                        </span> : <span className={style.Amount}>
                            {item.amount > 1 && item.amount}
                        </span>}
                        {(item?.shortcut) && (
                            <span className={style.Shortcut}>
                                {item?.shortcut}
                            </span>
                        )}
                        {(item?.name == "vehicle_key") && (
                            <span className={style.Key}>
                                {item?.label.replace("Véhicule ", "")}
                            </span>
                        )}
                        <img
                            alt=""
                            className={style.Icon}
                            src={itemIcon(item)}
                            onError={(e) => e.currentTarget.src = 'https://placekitten.com/200/200'}
                        />
                    </>
                )}
                {money && (
                    <>
                        <span className={style.Amount}>
                            {money >= 0 && money.toLocaleString('en-US', FORMAT_CURRENCY)}
                        </span>
                        <img
                            alt=""
                            className={style.Icon}
                            src={moneyIcon}
                        />
                    </>
                )}
            </div>

            {interactAction && (
                <div ref={contextRef} className={style.ContextMenu}
                     style={{display: `${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY}}>
                    <div className={style.OptionsList}>
                        {item && (item.useable || item.type === 'weapon') && <li className={style.OptionListItem} onClick={createInteractAction('useItem')}>
                            {item.type === 'weapon' ? 'Équiper' : item.usableLabel || 'Utiliser'}
                        </li>}
                        {item && <li className={style.OptionListItem} onClick={createInteractAction('giveItem')}>
                            Donner
                        </li>}
                        {(item && item.type === 'weapon') && (
                            <>
                                <li className={style.OptionListItem} onClick={createInteractAction('setItemUsage', 1)}>
                                    Définir comme arme principale
                                </li>
                                <li className={style.OptionListItem} onClick={createInteractAction('setItemUsage', 2)}>
                                    Définir comme arme secondaire
                                </li>
                            </>
                        )}
                        {(item && item.type === 'crate' && item.metadata?.crateElements?.length) && (
                            <li className={style.OptionListItem} onClick={createInteractAction('renameItem')}>
                                Renommer
                            </li>
                        )}
                        {(item && item.useable && item.type !== 'weapon') && (
                            <>
                                <li className={style.OptionListItem}>
                                    Raccourci d'utilisation
                                    <div>
                                        {Array(8).fill(1).map(function (x, i) {
                                            const shortcut = i+3 === 10 ? 0 : i+3
                                            return (
                                                <p className={style.OptionListOption} onClick={createInteractAction('setItemUsage', shortcut)}>
                                                    {shortcut}
                                                </p>
                                            );
                                        })}
                                    </div>
                                </li>
                            </>
                        )}
                        {money && (<>
                            <li className={style.OptionListItem} onClick={createInteractAction('giveMoney')}>
                                Donner en propre
                            </li>
                            <li className={style.OptionListItem} onClick={createInteractAction('giveMarkedMoney')}>
                                Donner en sale
                            </li>
                        </>)}
                    </div>
                </div>
            )}
        </div>
    )
};

export default Draggable;

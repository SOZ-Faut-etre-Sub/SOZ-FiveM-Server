import { DragOverlay, useDraggable } from '@dnd-kit/core';
import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import { InventoryItem, ItemType } from '../../types/inventory';
import style from './Item.module.css';
import {CSS} from '@dnd-kit/utilities';
import apartmentKeyIcon from '/icon/apartment_key.png';
import licenseCardIcon from '/icon/license.webp';
import healthCardIcon from '/icon/health.webp';
import identityCardIcon from '/icon/identity.webp';
import moneyIcon from '/icon/money.png';
import walletIcon from '/icon/wallet.webp';
import bankIcon from '/icon/bank.webp'
import keychainIcon from '/icon/keychain.webp';
import vehicleKeyIcon from '/icon/vehicle_key.png';
import { clsx } from 'clsx';
import { WeaponAmmo } from '../../types/weapon';
import { createPortal } from 'react-dom';

type Props = {
    id: string;
    containerName: string;
    item?: InventoryItem;
    money?: number;
    wallet?: number;
    keychain?:number;
    contextMenu?: boolean;
    interactAction?: any;
    setInContext?: (inContext: boolean) => void;
    onItemHover?: (description: string | null) => void;
    price?: number
    undraggable?: boolean;
}
function type_label(type: string | undefined): string {
    if (!type) return 'inconnu';
    if (type == 'evidence_glass') {
        return 'Verre';
    } else if (type == 'evidence_blood') {
        return 'Sang';
    } else if (type == 'evidence_bullet') {
        return 'Balle';
    } else if (type == 'evidence_drug') {
        return 'Trace de drogue';
    } else if (type == 'evidence_fingerprint') {
        return 'Empreinte';
    } else if (type == 'evidence_powder') {
        return 'Poudre';
    }
    return 'inconnu';
}
const FORMAT_LOCALIZED: Intl.DateTimeFormatOptions = {day: "numeric", month: "numeric", year: "numeric", hour: "numeric", minute: "numeric"}
const FORMAT_CURRENCY: Intl.NumberFormatOptions = {style: "currency", currency: 'USD', maximumFractionDigits: 0}

const Draggable: FunctionComponent<Props> = ({ id, containerName, item, money, interactAction, wallet, keychain, onItemHover, price, undraggable }) => {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: `${id}_${item?.slot ?? ''}`,
        data: {
            container: containerName,
            item
        },
        disabled: item?.disabled === true || money == -1 || wallet == -1 || keychain == -1,
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
        let itemDescription = item.description || '';
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
        } else if(item.name === 'bank'){
            if (item?.metadata?.iban) {
                itemExtraLabel += `[ IBAN : ${item.metadata.iban?.replace(/.{4}/g, '$& ')}]`
            }
        } else if(item.name === 'chainsaw'){
            if (item?.metadata?.fuel) {
                itemExtraLabel += ` [${item.metadata.fuel.toString()} L]`
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
            
        } else if( item.type === 'zkea_crate' && item.metadata?.zkeaCrateElements?.length){
            if(item.metadata.label){
                itemLabel = `${item.label}`
            }
            item.metadata.zkeaCrateElements.map(fourniture => {
                secondaryDescription += `<br>- ${fourniture.name}`
                crateWeight = crateWeight + 2000
            })
            
            itemExtraLabel = `[${crateWeight/1000}/40 Kg]`
        } else if (item?.metadata?.expiration) {
            const currentTime = new Date().getTime();
            const expiration = new Date(item.metadata['expiration'])

            if (currentTime > expiration.getTime()) {
                itemExtraLabel += ` [Périmé]`
            } else {
                itemExtraLabel += ` [DLC: ${expiration.toLocaleDateString('fr-FR', FORMAT_LOCALIZED)}]`
            }
        } else if (item?.metadata?.type && !item?.metadata?.label) {
            itemExtraLabel += ` [${item?.metadata?.type}]`
        }

        if (item?.metadata?.notSearchable) {
            itemExtraLabel += `[Caché]`
        }
        
        if (item?.type === 'evidence' && item.name != 'scientist_photo' && item.metadata?.expiration) {
            const currentTime = new Date().getTime();
            const expiration = new Date(item.metadata['expiration']).getTime();
            if (!item?.metadata?.evidenceInfos?.isAnalyzed) {
                if (item?.metadata?.evidenceInfos?.type === 'evidence_fingerprint') {
                    if (currentTime > expiration) {
                        itemLabel = `Empreinte périmée`
                    } else {
                        itemLabel = `Empreinte non analysée`
                        itemDescription += `Cette empreinte a été récupérée par la police scientifique, elle se doit être analysée afin d'y découvrir ses caractéristiques.`;
                    }
                } else {
                    if (currentTime > expiration) {
                        itemLabel = `Échantillon de ${type_label(item.metadata?.evidenceInfos?.type).toLowerCase()} périmé`
                    } else {
                        itemLabel = `Échantillon de ${type_label(item.metadata?.evidenceInfos?.type).toLowerCase()} non-analysé`
                        itemDescription += `Cet échantillon a été récupéré par la police scientifique, il se doit être analysé afin d'y découvrir ses caractéristiques.`;
                    }
                }
                if (currentTime <= expiration) {
                    secondaryDescription += `<b>Type: </b><span>${type_label(item.metadata?.evidenceInfos?.type)}</span><br>`
                    secondaryDescription += `<b>Récupéré dans la zone de: </b><span>Inconnu</span><br>`
                    secondaryDescription += `<b>Sur: </b><span>Inconnu</span><br>`
                }
            } else {
                if (item?.metadata?.evidenceInfos?.type === 'evidence_fingerprint') {
                    if (currentTime > expiration) {
                        itemLabel = `Empreinte périmée`
                    } else {
                        itemLabel = `Empreinte analysée`
                        itemDescription += `Cette empreinte a été récupérée par la police scientifique et analysée.`;
                    }
                } else {
                    if (currentTime > expiration) {
                        itemLabel = `Échantillon de ${type_label(item.metadata?.evidenceInfos?.type).toLowerCase()} périmé`
                    } else {
                        itemLabel = `Échantillon de ${type_label(item.metadata?.evidenceInfos?.type).toLowerCase()} analysé`
                        itemDescription += `Cet échantillon a été récupéré par la police scientifique et analysé.`;
                    }
                }
                if (currentTime <= expiration) {
                    secondaryDescription += `<b>Type: </b><span>${type_label(item.metadata?.evidenceInfos?.type)}</span><br>`
                    secondaryDescription += `<b>Récupéré dans la zone de: </b><span>${item.metadata?.evidenceInfos?.zone}</span><br>`
                    secondaryDescription += `<b>Sur: </b><span>${item.metadata?.evidenceInfos?.support}</span><br>`
                    secondaryDescription += `<b>Informations: </b><span>${item.metadata.evidenceInfos.generalInfo}</span><br>`
                }
            }
            if (item.metadata.evidenceInfos?.quantity) {
                secondaryDescription += `<b>Quantité: </b><span>${item.metadata.evidenceInfos?.quantity}</span><br>`
            }
            if (item.metadata.creation) {
                secondaryDescription += `<b>Récupéré le: </b><span>${new Date(item.metadata.creation).toLocaleDateString('fr-FR', FORMAT_LOCALIZED)}</span><br>`
            }
        }

        if (item?.metadata?.crafted) {
            itemExtraLabel += ` [Illégal]`
        }

        if (item?.metadata?.printed) {
            itemExtraLabel += ` [Replique]`
        }

        if (item.illustrator && item.illustrator instanceof Object) {
            if (item.name === 'outfit' || item.name === 'armor') {
                illustrator = item.illustrator[item?.metadata?.type || ''] || '';
            }
        }

        if(item?.metadata?.value){
            secondaryDescription += '<div style="display:flex;flex-direction:column;margin-top:0.5rem;align-items:flex-end">'
            secondaryDescription += `<span><b>Valeur estimée :</b> ${item?.metadata?.value * item.amount} $ </span>`
            secondaryDescription += `</div>`
        }

        if((item?.storageItemType === 'smuggling_ore' || item?.storageItemType === 'smuggling_electronic')){
            let totalElementValue = item?.metadata?.value ?? 0 * item?.amount
            secondaryDescription += '<div style="display:flex;flex-direction:column;margin-top:0.5rem;align-items:flex-end">'
            secondaryDescription += `<span><b>Valeur estimée :</b> ${totalElementValue} $ </span>`
            secondaryDescription += `</div>`
        }

        if(item?.name === 'cyber_crypto_wallet' && item?.metadata?.value != undefined) {
            secondaryDescription = '<div style="display:flex;flex-direction:column;margin-top:0.5rem;align-items:flex-end">'
            secondaryDescription += `<span><b>Crypto-Monnaie :</b> ${item?.metadata?.value}</span>`
            secondaryDescription += `</div>`
        }

        onItemHover?.(`
            <div><b>${itemLabel}</b> <span>${itemExtraLabel}</span></div>
            <div>${itemDescription}</div>
            ${secondaryDescription}
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
        if (item.name === 'health') {
            return healthCardIcon;
        }
        if (item.name === 'license') {
            return licenseCardIcon;
        }
        if (item.name === 'identity') {
            return identityCardIcon;
        }
        if (item.name === 'bank') {
            return bankIcon;
        }

        if (item.name === 'outfit' || item.name === 'armor') {
            path += `_${item.metadata?.type}`
        } else if (item.name === 'cabinet_zkea') {
            path += `_${item.metadata?.tier}`
        }

        return `https://cfx-nui-soz-core/public/images/items/${path}.webp`
    }, []);

    if (!item && !money && !wallet && !keychain) {
        return null
    }

    if (isDragging && !undraggable) {
        if (item) {
            return createPortal(
                <DragOverlay className={style.Card}>
                    <img
                        alt=""
                        className={style.Icon}
                        src={itemIcon(item)}
                        onError={(e) => e.currentTarget.src = 'https://cfx-nui-soz-core/public/images/default/cat.webp'}
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
                    [style.Disabled]: item?.disabled === true || (money && money < 0) || (wallet && wallet < 0) || (keychain && keychain < 0),
                })} 
                onMouseEnter={applyDescription}
                onMouseLeave={resetDescription}
            >
                {item && (
                    <>
                        {price ?
                        <span className={style.Amount}>
                            {price > 0 && price} $
                        </span> : <span className={style.Amount}>
                            {item.amount > 1 && item.amount}
                        </span>}
                        { price && item.amount > 0 && (
                        <span className={style.ShopAmount}>
                            {item.amount}
                        </span>)}
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
                            onError={(e) => e.currentTarget.src = 'https://cfx-nui-soz-core/public/images/default/cat.webp'}
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
                {wallet && (
                    <>
                        <span className={style.Amount}>
                            Portefeuille
                        </span>
                        <img
                            alt=""
                            className={style.Icon}
                            src={walletIcon}
                        />
                    </>
                )}
                {keychain && (
                    <>
                        <span className={style.Amount}>
                            Trousseau
                        </span>
                        <img
                            alt=""
                            className={style.Icon}
                            src={keychainIcon}
                        />
                    </>
                )}
            </div>

            {interactAction && (
                <div ref={contextRef} className={style.ContextMenu}
                     style={{display: `${contextData.visible ? 'block' : 'none'}`, left: contextData.posX, top: contextData.posY, position:'fixed'}}>
                    <div className={style.OptionsList}>
                        {item && (item.useable || item.type === 'weapon') && <li className={style.OptionListItem} onClick={createInteractAction('useItem')}>
                            {item.type === 'weapon' ? 'Équiper' : item.usableLabel || 'Utiliser'}

                        </li>}
                        {item && item.canShow && <li className={style.OptionListItem} onClick={createInteractAction('showItem')}>
                            Montrer
                        </li>
                        }
                        {item && item.type !== 'card' && <li className={style.OptionListItem} onClick={createInteractAction('giveItem')}>
                            {item.giveLabel || 'Donner'}
                        </li>}
                        {item && (item.throwable) && <li className={style.OptionListItem} onClick={createInteractAction('throwItem')}>
                            Jeter
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
                        {(item && ((item.type === 'crate' && item.metadata?.crateElements?.length) || (item.name === 'detective_board' && item.metadata?.originalDetectiveBoard) || item.name === 'scientist_photo')) && (
                            <li className={style.OptionListItem} onClick={createInteractAction('renameItem')}>
                                Renommer
                            </li>
                        )}
                        {(item && item.storageItemType && (item.name !== 'detective_board' || item.metadata?.originalDetectiveBoard)) && (
                            <li className={style.OptionListItem} onClick={createInteractAction('openItemStorage')}>
                                {item.openStorageLabel || 'Ouvrir'}
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
                        {wallet && (<>
                            <li className={style.OptionListItem} onClick={createInteractAction('openPlayerWalletInventory')}>
                                Ouvrir le portefeuille
                            </li>
                        </>)}
                        {keychain && (<>
                            <li className={style.OptionListItem} onClick={createInteractAction('openPlayerKeyInventory')}>
                                Ouvrir le trousseau
                            </li>
                        </>)}
                        {item && item.type === 'card' && (<>
                            <li className={style.OptionListItem} onClick={createInteractAction('showCard')}>
                                Montrer
                            </li>
                            <li className={style.OptionListItem} onClick={createInteractAction('seeCard')}>
                                Regarder
                            </li>
                        </>)}
                        
                    </div>
                </div>
            )}
        </div>
    )
};

export default Draggable;

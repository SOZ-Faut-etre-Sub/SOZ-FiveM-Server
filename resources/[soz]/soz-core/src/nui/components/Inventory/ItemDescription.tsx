import classNames from 'classnames';
import { FunctionComponent } from 'react';

import { getItemWeight, InventoryItem, isInventoryItemExpired } from '../../../shared/inventory';
import { WeaponAmmo } from '../../../shared/weapons/weapon';
import { useItemResolver } from '../../hook/data';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

export type ItemDescriptionProps = {
    inventoryItem: InventoryItem | null;
    position: 'left' | 'right';
};

const FORMAT_LOCALIZED: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
};

export const ItemDescription: FunctionComponent<ItemDescriptionProps> = ({
    inventoryItem,
    position = 'right',
}: ItemDescriptionProps) => {
    const resolver = useItemResolver();
    const item = resolver(inventoryItem?.name);

    if (!inventoryItem || !item) {
        return null;
    }

    const expiration = inventoryItem.metadata?.expiration ? new Date(inventoryItem.metadata?.expiration) : null;
    const currentTime = new Date();

    let itemLabel = item.label;
    let itemDescription = item.description;

    if (inventoryItem?.type === 'evidence' && inventoryItem.name != 'scientist_photo' && expiration) {
        if (!inventoryItem?.metadata?.evidenceInfos?.isAnalyzed) {
            if (inventoryItem?.metadata?.evidenceInfos?.type === 'evidence_fingerprint') {
                if (currentTime > expiration) {
                    itemLabel = `Empreinte périmée`;
                } else {
                    itemLabel = `Empreinte non analysée`;
                    itemDescription += `Cette empreinte a été récupérée par la police scientifique, elle se doit être analysée afin d'y découvrir ses caractéristiques.`;
                }
            } else {
                if (currentTime > expiration) {
                    itemLabel = `Échantillon de ${getTypeLabel(inventoryItem.metadata?.evidenceInfos?.type).toLowerCase()} périmé`;
                } else {
                    itemLabel = `Échantillon de ${getTypeLabel(inventoryItem.metadata?.evidenceInfos?.type).toLowerCase()} non-analysé`;
                    itemDescription += `Cet échantillon a été récupéré par la police scientifique, il se doit être analysé afin d'y découvrir ses caractéristiques.`;
                }
            }
        } else {
            if (inventoryItem?.metadata?.evidenceInfos?.type === 'evidence_fingerprint') {
                if (currentTime > expiration) {
                    itemLabel = `Empreinte périmée`;
                } else {
                    itemLabel = `Empreinte analysée`;
                    itemDescription += `Cette empreinte a été récupérée par la police scientifique et analysée.`;
                }
            } else {
                if (currentTime > expiration) {
                    itemLabel = `Échantillon de ${getTypeLabel(inventoryItem.metadata?.evidenceInfos?.type).toLowerCase()} périmé`;
                } else {
                    itemLabel = `Échantillon de ${getTypeLabel(inventoryItem.metadata?.evidenceInfos?.type).toLowerCase()} analysé`;
                    itemDescription += `Cet échantillon a été récupéré par la police scientifique et analysé.`;
                }
            }
        }
    }

    return (
        <div
            className={classNames('absolute top-0', {
                'right-[-102%]': position === 'right',
                'left-[-102%]': position === 'left',
            })}
        >
            <GlassMorphismContainer duration="duration-0" borderClassName="rounded-xl">
                <div className="w-[400px] p-2 text-lsm font-prompt text-gray-100">
                    <div className="flex justify-between align-items-center w-full">
                        {inventoryItem.metadata?.label && (
                            <h2 className="font-bold uppercase truncate flex-1 text-sm">
                                {inventoryItem.metadata?.label} <span className="text-2xs">{itemLabel}</span>
                            </h2>
                        )}
                        {!inventoryItem.metadata?.label && (
                            <h2 className="font-bold uppercase truncate flex-1 text-sm">{itemLabel}</h2>
                        )}
                        <div className="flex-0">
                            {inventoryItem.type === 'weapon' && inventoryItem.metadata?.ammo && (
                                <span>[{inventoryItem.metadata?.ammo} munitions]</span>
                            )}
                            {inventoryItem.metadata?.plates && inventoryItem.metadata?.plates > 0 && (
                                <span>Plaques : {inventoryItem.metadata?.plates}</span>
                            )}
                            {inventoryItem.type === 'fishing_rod' && inventoryItem.metadata?.bait && (
                                <span>[{resolver(inventoryItem.metadata?.bait?.name)?.label}]</span>
                            )}
                            {inventoryItem.name === 'chainsaw' && inventoryItem.metadata?.fuel && (
                                <span>[{inventoryItem.metadata?.fuel} L]</span>
                            )}
                            {inventoryItem.type === 'crate' && inventoryItem.metadata?.crateElements?.length && (
                                <span>
                                    [
                                    {getItemWeight(
                                        inventoryItem.name,
                                        inventoryItem.amount,
                                        resolver,
                                        inventoryItem.metadata
                                    ) / 1000}
                                    /12Kg]
                                </span>
                            )}
                            {inventoryItem.name === 'zkea_crate' && inventoryItem.metadata?.fuel && (
                                <span>
                                    [
                                    {getItemWeight(
                                        inventoryItem.name,
                                        inventoryItem.amount,
                                        resolver,
                                        inventoryItem.metadata
                                    ) / 1000}
                                    /40Kg]
                                </span>
                            )}
                            {expiration && (
                                <>
                                    {isInventoryItemExpired(inventoryItem) && <span>[Périmé]</span>}
                                    {!isInventoryItemExpired(inventoryItem) && (
                                        <span>
                                            [Expire le {expiration.toLocaleDateString('fr-FR', FORMAT_LOCALIZED)}]
                                        </span>
                                    )}
                                </>
                            )}
                            {inventoryItem.metadata?.type && <span>[{inventoryItem.metadata?.type}]</span>}
                            {inventoryItem.metadata?.notSearchable && <span>[Caché]</span>}
                            {inventoryItem.metadata?.crafted && <span>[Illégal]</span>}
                            {inventoryItem.metadata?.printed && <span>[Réplique]</span>}
                        </div>
                    </div>
                    <div className="flex mt-1 justify-between align-items-center w-full">{itemDescription}</div>
                    {item.type === 'fish' && (inventoryItem.metadata?.weight || inventoryItem.metadata?.length) && (
                        <div className="mt-1">
                            <div>
                                <strong>Poids : </strong>
                                {inventoryItem.metadata?.weight} grammes
                            </div>
                            <div>
                                <strong>Taille : </strong>
                                {inventoryItem.metadata?.length} centimètres
                            </div>
                        </div>
                    )}
                    {item.type === 'crate' && (
                        <>
                            {(inventoryItem.metadata?.crateElements || []).map((element, index) => (
                                <div key={index}>
                                    - {element.amount} {resolver(element.name)?.label} [DLC:{' '}
                                    {element.metadata?.expiration
                                        ? new Date(element.metadata?.expiration).toLocaleDateString(
                                              'fr-FR',
                                              FORMAT_LOCALIZED
                                          )
                                        : ''}
                                    ]
                                </div>
                            ))}
                        </>
                    )}
                    {inventoryItem.type === 'zkea_crate' && (
                        <>
                            {(inventoryItem.metadata?.zkeaCrateElements || []).map((element, index) => (
                                <div key={index}>- {element.name}</div>
                            ))}
                        </>
                    )}
                    {inventoryItem.type === 'evidence' &&
                        inventoryItem.name !== 'scientist_photo' &&
                        expiration &&
                        currentTime <= expiration && (
                            <div>
                                {!inventoryItem?.metadata?.evidenceInfos?.isAnalyzed && (
                                    <>
                                        <div>
                                            <strong>Type : </strong>{' '}
                                            {getTypeLabel(inventoryItem.metadata?.evidenceInfos?.type)}
                                        </div>
                                        <div>
                                            <strong>Récupéré dans la zone de : </strong>Inconnu
                                        </div>
                                        <div>
                                            <strong>Sur : </strong> Inconnu
                                        </div>
                                    </>
                                )}
                                {inventoryItem?.metadata?.evidenceInfos?.isAnalyzed && (
                                    <>
                                        <div>
                                            <strong>Type : </strong>{' '}
                                            {getTypeLabel(inventoryItem.metadata?.evidenceInfos?.type)}
                                        </div>
                                        <div>
                                            <strong>Récupéré dans la zone de : </strong>
                                            {inventoryItem.metadata?.evidenceInfos?.zone}
                                        </div>
                                        <div>
                                            <strong>Sur : </strong> {inventoryItem.metadata?.evidenceInfos?.support}
                                        </div>
                                        <div>
                                            <strong>Informations : </strong>{' '}
                                            {inventoryItem.metadata?.evidenceInfos?.generalInfo}
                                        </div>
                                    </>
                                )}
                                {inventoryItem.metadata.evidenceInfos?.quantity && (
                                    <div>
                                        <strong>Quantité : </strong> {inventoryItem.metadata.evidenceInfos.quantity}
                                    </div>
                                )}
                                {inventoryItem.metadata.creation && (
                                    <div>
                                        <strong>Récupéré le : </strong>{' '}
                                        {new Date(inventoryItem.metadata.creation).toLocaleDateString(
                                            'fr-FR',
                                            FORMAT_LOCALIZED
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    {inventoryItem.name !== 'cyber_crypto_wallet' && inventoryItem.metadata?.value && (
                        <div className="mt-1">
                            <div>
                                <strong>Valeur estimée : </strong>
                                {inventoryItem.metadata?.value * inventoryItem.amount} $
                            </div>
                        </div>
                    )}
                    {(item?.storageItemType === 'smuggling_ore' || item?.storageItemType === 'smuggling_electronic') &&
                        inventoryItem?.metadata?.storageElements && (
                            <div className="mt-1">
                                <div>
                                    <strong>Valeur estimée : </strong>
                                    {Object.values(inventoryItem.metadata.storageElements).reduce((prev, item) => {
                                        if (!item) {
                                            return prev;
                                        }

                                        if (item?.metadata?.printed) {
                                            return prev;
                                        }

                                        if (!item?.metadata?.value) {
                                            return prev;
                                        }

                                        return prev + item.metadata.value * item.amount;
                                    }, 0)}{' '}
                                    $
                                </div>
                            </div>
                        )}
                    {inventoryItem.name === 'cyber_crypto_wallet' && inventoryItem.metadata?.value !== undefined && (
                        <div className="mt-1">
                            <div>
                                <strong>Crypto-Monnaie : </strong>
                                {inventoryItem.metadata?.value}
                            </div>
                        </div>
                    )}
                    <div className="flex mt-1 justify-between align-items-center w-full">
                        <div>
                            {inventoryItem.type === 'weapon' && WeaponAmmo[inventoryItem.name.toUpperCase()] && (
                                <span>Munition : {WeaponAmmo[inventoryItem.name.toUpperCase()]}</span>
                            )}
                        </div>
                        {item.illustrator && typeof item.illustrator === 'string' && <span>{item.illustrator}</span>}
                        {item.illustrator && item.illustrator instanceof Object && (
                            <span>{item.illustrator[inventoryItem.metadata?.type] || ''}</span>
                        )}
                    </div>
                </div>
            </GlassMorphismContainer>
        </div>
    );
};

const getTypeLabel = (type: string | undefined): string => {
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
};

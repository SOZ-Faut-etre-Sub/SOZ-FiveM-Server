import { ShoppingBagIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { Fragment, FunctionComponent, PropsWithChildren, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import {
    getItemsWeight,
    INVENTORY_SORT_LABELS,
    InventoryConfiguration,
    InventoryItem,
    InventorySort,
} from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { fetchNui } from '../../fetch';
import { useItemResolver } from '../../hook/data';
import { ItemDescription } from './ItemDescription';
import { EmptySlot, ItemSlot } from './ItemSlot';

export type InventoryProps = {
    inventoryId: string;
    prefixId?: string;
    configuration: InventoryConfiguration;
    targetConfiguration?: InventoryConfiguration;
    inventoryItems: Record<number, InventoryItem>;
    banner: string;
    player?: boolean;
    allowForceConsume?: boolean;
    thin?: boolean;
    allowHiddenItem?: boolean;
    onDoubleClick?: (inventoryItem: InventoryItem | 'money' | 'wallet' | 'keychain' | null, item?: Item | null) => void;
};

export const Inventory: FunctionComponent<InventoryProps> = ({
    inventoryId,
    prefixId,
    configuration,
    targetConfiguration,
    inventoryItems,
    banner,
    player = false,
    allowForceConsume = false,
    thin = false,
    onDoubleClick,
    allowHiddenItem = false,
}) => {
    const [currentInventoryItem, setCurrentInventoryItem] = useState<InventoryItem | null>(null);
    const resolver = useItemResolver();
    const itemsAsArray = Object.values(inventoryItems).filter(item => item !== null);
    const inventoryWeight = getItemsWeight(itemsAsArray, resolver);
    const maxInventorySlot =
        itemsAsArray.reduce((acc, item) => {
            return Math.max(acc, item.slot);
        }, 0) + (player ? 3 : 0);
    const nbLines = Math.max(Math.ceil(maxInventorySlot / 5) + (player ? 0 : 1), 3);

    return (
        <>
            <InventoryDiv
                sortCallback={sort => {
                    fetchNui(NuiEvent.InventorySort, { id: inventoryId, sort });
                }}
                banner={banner}
                rightText={`${inventoryWeight / 1000}/${configuration.maxWeight / 1000} Kg`}
                thin={thin}
            >
                {player && (
                    <>
                        <ItemSlot
                            prefixId={prefixId}
                            inventoryId={inventoryId}
                            targetConfiguration={targetConfiguration}
                            allowActions={true}
                            slot={-2}
                            inventoryItem={'money'}
                            item={null}
                            setCurrentInventoryItem={setCurrentInventoryItem}
                            resolver={resolver}
                            onDoubleClick={onDoubleClick}
                        />
                        <ItemSlot
                            prefixId={prefixId}
                            inventoryId={inventoryId}
                            targetConfiguration={targetConfiguration}
                            allowActions={true}
                            slot={-1}
                            inventoryItem={'wallet'}
                            item={null}
                            setCurrentInventoryItem={setCurrentInventoryItem}
                            resolver={resolver}
                            onDoubleClick={onDoubleClick}
                        />
                        <ItemSlot
                            prefixId={prefixId}
                            inventoryId={inventoryId}
                            targetConfiguration={targetConfiguration}
                            allowActions={true}
                            slot={0}
                            inventoryItem={'keychain'}
                            item={null}
                            setCurrentInventoryItem={setCurrentInventoryItem}
                            resolver={resolver}
                            onDoubleClick={onDoubleClick}
                        />
                    </>
                )}
                {[...Array(nbLines)].map((_, i) => {
                    return (
                        <Fragment key={i}>
                            {[...Array(5)].map((_, j) => {
                                const slot = i * 5 + j + 1;
                                const inventoryItem = inventoryItems[slot] || null;
                                const item = inventoryItem ? resolver(inventoryItem?.name) : null;

                                return (
                                    <ItemSlot
                                        prefixId={prefixId}
                                        inventoryId={inventoryId}
                                        targetConfiguration={targetConfiguration}
                                        slot={slot}
                                        key={j}
                                        inventoryItem={inventoryItem}
                                        item={item}
                                        setCurrentInventoryItem={setCurrentInventoryItem}
                                        resolver={resolver}
                                        allowActions={player}
                                        allowShortcuts={player}
                                        onDoubleClick={onDoubleClick}
                                        allowForceConsume={allowForceConsume}
                                        allowHidden={allowHiddenItem}
                                    />
                                );
                            })}
                        </Fragment>
                    );
                })}
                {player && (
                    <>
                        <EmptySlot prefixId={prefixId} inventoryId={inventoryId} slot={nbLines * 5 + 1} droppable />
                        <EmptySlot prefixId={prefixId} inventoryId={inventoryId} slot={nbLines * 5 + 2} droppable />
                    </>
                )}
            </InventoryDiv>
            <ItemDescription inventoryItem={currentInventoryItem} />
        </>
    );
};

type InventoryDivProps = {
    banner: string;
    sortCallback?: (sort: InventorySort) => void;
    giveKeysCallback?: (type: 'vehicle' | 'apartment') => void;
    rightText?: string;
    thin?: boolean;
};

export const InventoryDiv: FunctionComponent<PropsWithChildren<InventoryDivProps>> = ({
    children,
    banner,
    sortCallback,
    giveKeysCallback,
    rightText,
    thin = false,
}) => {
    const [showSort, setShowSort] = useState(false);

    return (
        <div
            className={classNames('max-h-full flex flex-col w-full bg-black/50', {
                'text-sm': thin,
            })}
        >
            {banner === 'cart' && (
                <header className="p-2 relative flex h-10 items-center text-sm uppercase text-white">
                    <ShoppingBagIcon className="h-8" />
                    <h2 className="ml-2">Glisse et dépose dans ton panier</h2>
                </header>
            )}
            {banner !== 'cart' && (
                <header className="relative">
                    <img src={banner} alt="Player Banner" />
                    {giveKeysCallback && (
                        <div
                            className="absolute flex rounded z-100 ml-3 text-white/80 mb-1"
                            style={{
                                bottom: '0',
                                left: '0',
                            }}
                            onClick={() => setShowSort(!showSort)}
                        >
                            <div
                                className="cursor-pointer rounded bg-black/80 hover:bg-white/20 h-6 px-2 flex justify-center relative"
                                onClick={() => giveKeysCallback('vehicle')}
                            >
                                <img
                                    className="h-full"
                                    src="https://cfx-nui-soz-core/public/images/inventory/icon/car.webp"
                                    alt="Vehicle keys"
                                />
                            </div>
                            <div
                                className="ml-1 cursor-pointer rounded bg-black/80 hover:bg-white/20 h-6 px-2 flex justify-center relative"
                                onClick={() => giveKeysCallback('apartment')}
                            >
                                <img
                                    className="h-full"
                                    src="https://cfx-nui-soz-core/public/images/inventory/icon/key.webp"
                                    alt="Apartment keys"
                                />
                            </div>
                        </div>
                    )}
                    {sortCallback && (
                        <div
                            className="absolute rounded z-100 ml-2 text-white/80"
                            style={{
                                bottom: '0',
                                left: '0',
                            }}
                            onClick={() => setShowSort(!showSort)}
                        >
                            <div className="cursor-pointer hover:bg-black/80 relative">
                                <div className="px-2 py-1">Trier ↑↓</div>
                            </div>
                            {showSort && (
                                <div className="absolute w-40 rounded-b z-50 bg-black/40">
                                    {Object.keys(INVENTORY_SORT_LABELS).map(key => {
                                        return (
                                            <div
                                                className="p-2 w-40 hover:bg-black/80 cursor-pointer rounded"
                                                key={key}
                                                onClick={() => {
                                                    sortCallback(key as InventorySort);
                                                }}
                                            >
                                                {INVENTORY_SORT_LABELS[key]}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                    {rightText && (
                        <h2 className="absolute z-100 text-white/80 bottom-0 right-0 py-1 px-2">{rightText}</h2>
                    )}
                </header>
            )}
            <div className="max-h-full min-h-20 overflow-y-scroll rounded-b pt-2 pl-2 pb-2 grid grid-cols-5 gap-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                {children}
            </div>
        </div>
    );
};

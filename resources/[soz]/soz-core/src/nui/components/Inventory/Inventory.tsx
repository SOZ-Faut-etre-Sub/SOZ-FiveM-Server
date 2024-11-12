import { ShoppingBagIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { FunctionComponent, PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react';
import { FixedSizeGrid } from 'react-window';

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
import WeightIcon from '../../icons/inventory/weight.svg';
import { GameCanvasBox, GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';
import { ItemDescription } from './ItemDescription';
import { ItemSlot } from './ItemSlot';

export type InventoryProps = {
    inventoryId: string;
    prefixId?: string;
    configuration: InventoryConfiguration;
    targetConfiguration?: InventoryConfiguration;
    inventoryItems: Record<number, InventoryItem>;
    title: string;
    player?: boolean;
    allowForceConsume?: boolean;
    allowHiddenItem?: boolean;
    allDisabled?: boolean;
    onDoubleClick?: (inventoryItem: InventoryItem | 'money' | 'wallet' | 'keychain' | null, item?: Item | null) => void;
    itemDescriptionPosition: 'left' | 'right';
};

export const Inventory: FunctionComponent<InventoryProps> = ({
    inventoryId,
    prefixId,
    configuration,
    targetConfiguration,
    inventoryItems,
    title,
    player = false,
    allowForceConsume = false,
    onDoubleClick,
    allowHiddenItem = false,
    allDisabled = false,
    itemDescriptionPosition = 'right',
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

    useEffect(() => {
        if (currentInventoryItem) {
            if (inventoryItems[currentInventoryItem.slot] !== currentInventoryItem) {
                setCurrentInventoryItem(null);
            }
        }
    }, [inventoryItems, currentInventoryItem]);

    const itemRender = useMemo(() => {
        return ({ columnIndex, rowIndex, style }) => {
            const index = rowIndex * 5 + columnIndex - (player ? 3 : 0);

            style = {
                ...style,
                left: columnIndex === 0 ? style.left : Number(style.left) + columnIndex * 10,
                right: style.right
                    ? columnIndex === 5
                        ? style.right
                        : Number(style.right) + columnIndex * 10
                    : undefined,
            };

            if (index === -3) {
                return (
                    <div style={style}>
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
                    </div>
                );
            }

            if (index === -2) {
                return (
                    <div style={style}>
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
                    </div>
                );
            }

            if (index === -1) {
                return (
                    <div style={style}>
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
                    </div>
                );
            }

            const slot = index + 1;
            const inventoryItem = inventoryItems[slot] || null;
            const item = inventoryItem ? resolver(inventoryItem?.name) : null;

            return (
                <div style={style}>
                    <ItemSlot
                        prefixId={prefixId}
                        inventoryId={inventoryId}
                        targetConfiguration={targetConfiguration}
                        slot={slot}
                        inventoryItem={inventoryItem}
                        item={item}
                        setCurrentInventoryItem={setCurrentInventoryItem}
                        resolver={resolver}
                        allowActions={player}
                        onDoubleClick={onDoubleClick}
                        allowForceConsume={allowForceConsume}
                        allowHidden={allowHiddenItem}
                        allDisabled={allDisabled}
                    />
                </div>
            );
        };
    }, [
        prefixId,
        inventoryId,
        targetConfiguration,
        inventoryItems,
        resolver,
        onDoubleClick,
        player,
        allowForceConsume,
        allowHiddenItem,
        setCurrentInventoryItem,
    ]);

    const height = Math.min((nbLines + 1) * 80, 480);

    return (
        <InventoryDiv
            sortCallback={sort => {
                fetchNui(NuiEvent.InventorySort, { id: inventoryId, sort });
            }}
            title={title}
            weight={{
                current: inventoryWeight,
                max: configuration.maxWeight,
            }}
            description={<ItemDescription position={itemDescriptionPosition} inventoryItem={currentInventoryItem} />}
        >
            <FixedSizeGrid
                columnCount={5}
                columnWidth={70}
                width={400}
                rowCount={nbLines + 1}
                rowHeight={80}
                height={height}
                overscanRowCount={7}
                className="scrollbar scrollbar-w-1 scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                {itemRender}
            </FixedSizeGrid>
        </InventoryDiv>
    );
};

type InventoryDivProps = {
    title: string;
    sortCallback?: (sort: InventorySort) => void;
    giveKeysCallback?: (type: 'vehicle' | 'apartment') => void;
    description?: ReactNode | undefined;
    isCart?: boolean;
    weight?: {
        current: number;
        max: number;
    };
    price?: number;
    maxHeight?: string;
};

export const InventoryDiv: FunctionComponent<PropsWithChildren<InventoryDivProps>> = ({
    children,
    title,
    sortCallback,
    giveKeysCallback,
    weight = null,
    description = undefined,
    isCart = false,
    maxHeight = 'max-h-[45vh]',
    price = 0,
}) => {
    const [showSort, setShowSort] = useState(false);

    return (
        <div className="w-full">
            {isCart && (
                <header className="relative w-full">
                    <div className="drop-shadow-bg h-[40px] flex w-full justify-between items-center">
                        <h1 className="font-semibold uppercase text-white text-2xl">Panier</h1>
                        <h2 className="flex z-100 text-white bottom-0 right-0 py-1 px-2 items-center">
                            <span className="flex items-end">
                                <span className="font-semibold text-xl">{price} $</span>
                            </span>
                            <ShoppingBagIcon className="h-8" />
                        </h2>
                    </div>
                </header>
            )}
            {!isCart && (
                <header className="relative w-full">
                    <div className="drop-shadow-bg h-[40px] flex w-full justify-between items-center">
                        <h1 className="font-semibold uppercase text-white text-2xl">{title}</h1>
                        {weight && (
                            <h2 className="flex z-100 text-white bottom-0 right-0 py-1 px-2 items-center">
                                <span className="flex items-end">
                                    <span className="font-semibold text-xl">
                                        {Number((weight.current / 1000).toFixed(2))}
                                    </span>
                                    <span className="text-sm">/{Number((weight.max / 1000).toFixed(2))} Kg</span>
                                </span>
                                <WeightGauge current={weight.current} max={weight.max} />
                            </h2>
                        )}
                    </div>
                    {giveKeysCallback && (
                        <div className="cursor-pointer relative inline-block">
                            <div
                                className="cursor-pointer inline-block justify-center relative"
                                onClick={() => giveKeysCallback('vehicle')}
                            >
                                <GlassMorphismContainer
                                    duration="duration-0"
                                    borderClassName="rounded"
                                    showBorderOnHover
                                >
                                    <img
                                        className="h-6 px-4"
                                        src="https://cfx-nui-soz-core/public/images/inventory/icon/car.webp"
                                        alt="Vehicle keys"
                                    />
                                </GlassMorphismContainer>
                            </div>
                            <div
                                className="ml-1 cursor-pointer inline-block justify-center relative"
                                onClick={() => giveKeysCallback('apartment')}
                            >
                                <GlassMorphismContainer
                                    duration="duration-0"
                                    borderClassName="rounded"
                                    showBorderOnHover
                                >
                                    <img
                                        className="h-6 px-4"
                                        src="https://cfx-nui-soz-core/public/images/inventory/icon/key.webp"
                                        alt="Apartment keys"
                                    />
                                </GlassMorphismContainer>
                            </div>
                        </div>
                    )}
                    {sortCallback && (
                        <div className="text-white" onClick={() => setShowSort(!showSort)}>
                            <div className="cursor-pointer relative inline-block">
                                <GlassMorphismContainer
                                    duration="duration-0"
                                    borderClassName="rounded"
                                    showBorderOnHover
                                >
                                    <div className="text-white px-2 py-1">Trier ↑↓</div>
                                </GlassMorphismContainer>
                            </div>
                            {showSort && (
                                <div className="absolute w-40 rounded z-50 bg-black/75">
                                    {Object.keys(INVENTORY_SORT_LABELS).map(key => {
                                        return (
                                            <div
                                                className="p-2 w-40 hover:bg-black cursor-pointer rounded"
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
                </header>
            )}
            <div className="relative w-full">
                <div
                    className={classNames(
                        'overflow-visible w-[400px] scrollbar scrollbar-w-1 scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full',
                        maxHeight
                    )}
                >
                    <GameCanvasBox blur={false}>{children}</GameCanvasBox>
                </div>
                {description}
            </div>
        </div>
    );
};

const WeightGauge: FunctionComponent<{ current: number; max: number }> = ({ current, max }) => {
    const value = (current * 100) / max;
    const circumference = 90 * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative rounded-full ml-2" style={{ width: '36px', height: '36px' }}>
            <GlassMorphismContainer
                borderClassName="rounded-full"
                className="flex justify-center items-center"
                style={{ width: '36px', height: '36px' }}
                duration="duration-0"
                disableBorder
            >
                <WeightIcon className="text-white w-[16x] h-[16px]" />
                <div className="absolute -inset-[1px] flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-full w-full"
                        viewBox="0 0 200 200"
                        style={{ transform: 'rotate(-90deg)' }}
                    >
                        <circle
                            r="90"
                            cx="100"
                            cy="100"
                            fill="transparent"
                            strokeWidth="1.5rem"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset="0"
                        />
                        <circle
                            r="90"
                            cx="100"
                            cy="100"
                            stroke="white"
                            strokeWidth="1.5rem"
                            strokeLinecap="butt"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={String(offset)}
                            fill="transparent"
                        />
                    </svg>
                </div>
            </GlassMorphismContainer>
        </div>
    );
};

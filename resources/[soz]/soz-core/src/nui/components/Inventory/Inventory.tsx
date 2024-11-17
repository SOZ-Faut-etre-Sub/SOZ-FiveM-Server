import { ShoppingBagIcon } from '@heroicons/react/outline';
import { FunctionComponent, PropsWithChildren, ReactNode, useEffect, useState } from 'react';
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
import { InventorySize, useInventorySize } from './size';

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
    const inventorySize = useInventorySize(6);
    const maxInventorySlot =
        itemsAsArray.reduce((acc, item) => {
            return Math.max(acc, item.slot);
        }, 0) + (player ? 3 : 0);
    const nbLines = Math.max(Math.ceil(maxInventorySlot / 5), 4) + (player ? 0 : 1);

    useEffect(() => {
        if (currentInventoryItem) {
            if (inventoryItems[currentInventoryItem.slot] !== currentInventoryItem) {
                setCurrentInventoryItem(null);
            }
        }
    }, [inventoryItems, currentInventoryItem]);

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
            description={<ItemDescription inventoryItem={currentInventoryItem} position={itemDescriptionPosition} />}
        >
            <FixedSizeGrid
                columnCount={5}
                columnWidth={inventorySize.itemSize}
                width={inventorySize.width + 10}
                rowCount={nbLines + 1}
                rowHeight={inventorySize.itemSize + inventorySize.gapSize}
                height={Math.min(nbLines + 1, 6) * (inventorySize.itemSize + inventorySize.gapSize)}
                overscanRowCount={7}
                className="scrollbar scrollbar-w-[5px] scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
                itemData={{
                    inventoryId,
                    prefixId,
                    configuration,
                    targetConfiguration,
                    inventoryItems,
                    player,
                    allowForceConsume,
                    allowHiddenItem,
                    allDisabled,
                    onDoubleClick,
                    inventorySize,
                    resolver,
                    setCurrentInventoryItem,
                }}
            >
                {ItemRenderer}
            </FixedSizeGrid>
        </InventoryDiv>
    );
};

type ItemRendererData = {
    inventoryId: string;
    prefixId?: string;
    configuration: InventoryConfiguration;
    targetConfiguration?: InventoryConfiguration;
    inventoryItems: Record<number, InventoryItem>;
    player?: boolean;
    allowForceConsume?: boolean;
    allowHiddenItem?: boolean;
    allDisabled?: boolean;
    onDoubleClick?: (inventoryItem: InventoryItem | 'money' | 'wallet' | 'keychain' | null, item?: Item | null) => void;
    inventorySize: InventorySize;
    resolver: (name: string) => Item;
    setCurrentInventoryItem: (inventoryItem: InventoryItem | null) => void;
};

type ItemRendererProps = {
    data: ItemRendererData;
    rowIndex: number;
    columnIndex: number;
    style: React.CSSProperties;
};

const ItemRenderer: FunctionComponent<ItemRendererProps> = ({ data, rowIndex, columnIndex, style }) => {
    const index = rowIndex * 5 + columnIndex - (data.player ? 3 : 0);

    style = {
        ...style,
        left: columnIndex === 0 ? style.left : Number(style.left) + columnIndex * data.inventorySize.gapSize,
        right: style.right
            ? columnIndex === 5
                ? style.right
                : Number(style.right) + columnIndex * data.inventorySize.gapSize
            : undefined,
    };

    if (index === -3) {
        return (
            <div style={style}>
                <ItemSlot
                    prefixId={data.prefixId}
                    inventoryId={data.inventoryId}
                    targetConfiguration={data.targetConfiguration}
                    allowActions={true}
                    slot={-2}
                    inventoryItem={'money'}
                    item={null}
                    setCurrentInventoryItem={data.setCurrentInventoryItem}
                    resolver={data.resolver}
                    onDoubleClick={data.onDoubleClick}
                />
            </div>
        );
    }

    if (index === -2) {
        return (
            <div style={style}>
                <ItemSlot
                    prefixId={data.prefixId}
                    inventoryId={data.inventoryId}
                    targetConfiguration={data.targetConfiguration}
                    allowActions={true}
                    slot={-1}
                    inventoryItem={'wallet'}
                    item={null}
                    setCurrentInventoryItem={data.setCurrentInventoryItem}
                    resolver={data.resolver}
                    onDoubleClick={data.onDoubleClick}
                />
            </div>
        );
    }

    if (index === -1) {
        return (
            <div style={style}>
                <ItemSlot
                    prefixId={data.prefixId}
                    inventoryId={data.inventoryId}
                    targetConfiguration={data.targetConfiguration}
                    allowActions={true}
                    slot={0}
                    inventoryItem={'keychain'}
                    item={null}
                    setCurrentInventoryItem={data.setCurrentInventoryItem}
                    resolver={data.resolver}
                    onDoubleClick={data.onDoubleClick}
                />
            </div>
        );
    }

    const slot = index + 1;
    const inventoryItem = data.inventoryItems[slot] || null;
    const item = inventoryItem ? data.resolver(inventoryItem?.name) : null;

    return (
        <div style={style}>
            <ItemSlot
                prefixId={data.prefixId}
                inventoryId={data.inventoryId}
                targetConfiguration={data.targetConfiguration}
                slot={slot}
                inventoryItem={inventoryItem}
                item={item}
                setCurrentInventoryItem={data.setCurrentInventoryItem}
                resolver={data.resolver}
                allowActions={data.player}
                onDoubleClick={data.onDoubleClick}
                allowForceConsume={data.allowForceConsume}
                allowHidden={data.allowHiddenItem}
                allDisabled={data.allDisabled}
            />
        </div>
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
};

export const InventoryDiv: FunctionComponent<PropsWithChildren<InventoryDivProps>> = ({
    children,
    title,
    sortCallback,
    giveKeysCallback,
    weight = null,
    description = undefined,
    isCart = false,
    price = 0,
}) => {
    const [showSort, setShowSort] = useState(false);
    const inventorySize = useInventorySize(6);

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
                                        src="https://soz.zerator.com/static/game/images/inventory/icon/car.webp"
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
                                        src="https://soz.zerator.com/static/game/images/inventory/icon/key.webp"
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
                    className="overflow-visible scrollbar scrollbar-w-1 scrollbar-thumb-white/80 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                    style={{
                        width: `${inventorySize.width + 10}px`,
                    }}
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

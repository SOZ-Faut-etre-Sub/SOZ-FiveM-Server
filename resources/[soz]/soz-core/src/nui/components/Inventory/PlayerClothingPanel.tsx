import { PlayerPedHash } from '@public/shared/player';
import { FunctionComponent, ReactNode, useEffect, useMemo, useState } from 'react';

import { InventoryConfiguration, InventoryItem } from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { useAssetPath } from '../../hook/assets';
import { useItemResolver, usePlayer } from '../../hook/data';
import { GameCanvasBox } from '../Styleguide/GameCanvasBox';
import { InventoryDiv } from './Inventory';
import { ItemDescription } from './ItemDescription';
import { ItemSlot } from './ItemSlot';
import { useInventorySize, useItemSize } from './size';

type PlayerClothingPanelProps = {
    title?: string;
    inventoryId: string;
    inventoryItems: Record<number, InventoryItem>;
    configuration: InventoryConfiguration;
    targetConfiguration?: InventoryConfiguration;
    onDoubleClick?: (inventoryItem: InventoryItem | 'money' | 'wallet' | 'keychain' | null, item?: Item | null) => void;
    allowHiddenItem?: boolean;
    allowForceConsume?: boolean;
    allDisabled?: boolean;
    itemDescriptionPosition?: 'left' | 'right';
    headerRight?: ReactNode;
};

const PlayerClothingPanel: FunctionComponent<PlayerClothingPanelProps> = ({
    title = 'Vêtements',
    inventoryId,
    inventoryItems,
    configuration,
    targetConfiguration,
    onDoubleClick,
    allowHiddenItem = false,
    allowForceConsume = false,
    allDisabled = false,
    itemDescriptionPosition = 'right',
    headerRight,
}) => {
    const resolver = useItemResolver();
    const { getPath } = useAssetPath();
    const inventorySize = useInventorySize(6);
    const itemSize = useItemSize();
    const [currentInventoryItem, setCurrentInventoryItem] = useState<InventoryItem | null>(null);
    const player = usePlayer();

    /** TODO :  SLOT COMPUTE */
    const SLOT_COUNT = 6;
    const leftSlots = useMemo(() => Array.from({ length: SLOT_COUNT }, (_, i) => i + 1), [SLOT_COUNT]);
    const rightSlots = useMemo(() => Array.from({ length: SLOT_COUNT }, (_, i) => i + 1 + SLOT_COUNT), [SLOT_COUNT]);

    const playerType = player?.skin?.Model?.Hash === PlayerPedHash.Male ? 'male' : 'female';
    const bgUrl = getPath(`images/hud/player/damages/${playerType}/skel.webp`);

    useEffect(() => {
        if (currentInventoryItem) {
            const same = inventoryItems[currentInventoryItem.slot] === currentInventoryItem;
            if (!same) setCurrentInventoryItem(null);
        }
    }, [inventoryItems, currentInventoryItem]);

    const renderSlot = (slot: number) => {
        const inventoryItem = inventoryItems[slot] || null;
        const item = inventoryItem ? resolver(inventoryItem.name) : null;

        return (
            <div
                key={slot}
                className="flex items-center justify-center"
                style={{ width: `${itemSize}px`, height: `${itemSize}px` }}
            >
                <ItemSlot
                    inventoryId={inventoryId}
                    targetConfiguration={targetConfiguration}
                    slot={slot}
                    inventoryItem={inventoryItem}
                    item={item}
                    setCurrentInventoryItem={setCurrentInventoryItem}
                    resolver={resolver}
                    allowActions
                    onDoubleClick={onDoubleClick}
                    allowForceConsume={allowForceConsume}
                    allowHidden={allowHiddenItem}
                    allDisabled={allDisabled}
                />
            </div>
        );
    };

    const centerMinHeight = SLOT_COUNT * itemSize + (SLOT_COUNT - 1) * inventorySize.gapSize;

    return (
        <div className="relative">
            <InventoryDiv
                title={title}
                description={
                    <ItemDescription inventoryItem={currentInventoryItem} position={itemDescriptionPosition} />
                }
                weight={{
                    current: 0,
                    max: configuration.maxWeight,
                }}
                isClothingVariant
            >
                <GameCanvasBox blur={false} cantBeHidden>
                    <div
                        className="grid"
                        style={{
                            gridTemplateColumns: `${itemSize}px 1fr 1fr ${itemSize}px`,
                            gap: `${inventorySize.gapSize}px`,
                            width: `${inventorySize.width}px`,
                            padding: `${inventorySize.gapSize / 2}px`,
                        }}
                    >
                        <div
                            className="flex flex-col items-center"
                            style={{ gap: `${inventorySize.gapSize}px`, width: `${itemSize}px` }}
                        >
                            {leftSlots.map(renderSlot)}
                        </div>

                        <div className="col-span-2">
                            <div
                                style={{
                                    minHeight: `${centerMinHeight}px`,
                                    backgroundImage: `url(${bgUrl})`,
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                }}
                            ></div>
                            {headerRight && <div className="mt-2">{headerRight}</div>}
                        </div>

                        <div
                            className="flex flex-col items-center"
                            style={{ gap: `${inventorySize.gapSize}px`, width: `${itemSize}px` }}
                        >
                            {rightSlots.map(renderSlot)}
                        </div>
                    </div>
                </GameCanvasBox>
            </InventoryDiv>
        </div>
    );
};
export default PlayerClothingPanel;

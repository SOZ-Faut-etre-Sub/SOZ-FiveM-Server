import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { PlayerPedHash } from '@public/shared/player';
import { FunctionComponent, PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react';

import { ClothConfig } from '../../../shared/cloth';
import { NuiEvent } from '../../../shared/event/nui';
import { InventoryConfiguration, InventoryItem } from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { fetchNui } from '../../fetch';
import { useAssetPath } from '../../hook/assets';
import { useItemResolver, usePlayer } from '../../hook/data';
import { GameCanvasBox } from '../Styleguide/GameCanvasBox';
import { InventoryDiv } from './Inventory';
import { ItemDescription } from './ItemDescription';
import { ItemSlot } from './ItemSlot';
import { useInventorySize, useItemSize } from './size';

const SLOT_TO_CONFIG: Record<number, keyof ClothConfig['Config']> = {
    1: 'ShowHelmet',
    2: 'HideHead',
    3: 'HideMask',
    4: 'HideGlasses',
    5: 'HideEar',
    6: 'HideChain',
    7: 'HideBulletproof',
    8: 'HideTop',
    9: 'HideLeftHand',
    10: 'HideRightHand',
    11: 'HideGloves',
    12: 'HideBag',
    13: 'HidePants',
    14: 'HideShoes',
};

const SLOT_TO_ICON: Record<number, string> = {
    1: 'Casque',
    2: 'Chapeau',
    3: 'Masque',
    4: 'Lunettes',
    5: 'Boucles',
    6: 'Collier',
    7: 'Gilet',
    8: 'Haut',
    9: 'Montre',
    10: 'Bracelet',
    11: 'Gants',
    12: 'Sac',
    13: 'Pantalon',
    14: 'Chaussures',
};

const SlotPlaceholder: FunctionComponent<{ slot: number }> = ({ slot }) => {
    const player = usePlayer();

    return (
        <div className="flex items-center justify-center">
            {player.cloth_config.JobClothSet ? (
                <div className="size-10 flex justify-center items-center bg-red-300 rounded-full">
                    {SLOT_TO_ICON[slot]}
                </div>
            ) : (
                <div className="size-10 flex justify-center items-center bg-gray-300 rounded-full">
                    {SLOT_TO_ICON[slot]}
                </div>
            )}
        </div>
    );
};

const SlotOverlay: FunctionComponent<PropsWithChildren<{ slot: number }>> = ({ slot, children }) => {
    const player = usePlayer();

    const configKey = SLOT_TO_CONFIG[slot];
    const isConfigEnabled = slot === 1 ? player.cloth_config.Config[configKey] : !player.cloth_config.Config[configKey];

    if (player.cloth_config.JobClothSet) {
        return (
            <div className="relative">
                <div className="absolute top-1 right-1 z-20 text-white">
                    {isConfigEnabled ? <EyeIcon className="size-5" /> : <EyeOffIcon className="size-5" />}
                </div>

                {children}
            </div>
        );
    }

    return children;
};

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
    const SLOT_COUNT = 7;
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

        const handleOnClick = () => {
            if (!player.cloth_config.JobClothSet) return;

            const configKey = SLOT_TO_CONFIG[slot];
            if (!configKey) return;

            fetchNui(NuiEvent.PlayerMenuClothConfigUpdate, {
                key: configKey,
                value: !player.cloth_config.Config[configKey],
            });
        };

        return (
            <div
                key={slot}
                className="flex items-center justify-center"
                style={{ width: `${itemSize}px`, height: `${itemSize}px` }}
                onClick={handleOnClick}
            >
                <SlotOverlay slot={slot}>
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
                        allDisabled={Boolean(player.cloth_config.JobClothSet) || allDisabled}
                        emptyOverlay={<SlotPlaceholder slot={slot} />}
                    />
                </SlotOverlay>
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

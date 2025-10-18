import { EyeIcon, EyeOffIcon } from '@heroicons/react/solid';
import { PlayerPedHash } from '@public/shared/player';
import { FunctionComponent, PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react';

import { ClothConfig, Component, Prop } from '../../../shared/cloth';
import { NuiEvent } from '../../../shared/event/nui';
import { InventoryConfiguration, InventoryItem } from '../../../shared/inventory';
import { Item } from '../../../shared/item';
import { fetchNui } from '../../fetch';
import { useAssetPath } from '../../hook/assets';
import { useItemResolver, usePlayer } from '../../hook/data';
import { getApparelIcon } from '../Shop/utils/getApparelItemIcon';
import { BorderBox } from '../Styleguide/BorderBox';
import { GameCanvasBox } from '../Styleguide/GameCanvasBox';
import { InventoryDiv } from './Inventory';
import { ItemDescription } from './ItemDescription';
import { ItemSlot } from './ItemSlot';
import { useInventorySize, useItemSize } from './size';

const SLOT_TO_CONFIG: Record<number, keyof ClothConfig['Config']> = {
    // Colonne gauche
    1: 'ShowHelmet',
    2: 'HideGlasses',
    3: 'HideEar',
    4: 'HideTop',
    5: 'HideLeftHand',
    6: 'HideGloves',
    7: 'HideBag',

    // Colonne droite
    8: 'HideHead',
    9: 'HideMask',
    10: 'HideChain',
    11: 'HideBulletproof',
    12: 'HideRightHand',
    13: 'HidePants',
    14: 'HideShoes',
};

const SLOT_TO_ICON: Record<number, string> = {
    // Colonne gauche
    1: 'Casque',
    2: 'Lunettes',
    3: 'Boucles',
    4: 'Haut',
    5: 'Montre',
    6: 'Gants',
    7: 'Sac',

    // Colonne droite
    8: 'Chapeau',
    9: 'Masque',
    10: 'Collier',
    11: 'Gilet',
    12: 'Bracelet',
    13: 'Pantalon',
    14: 'Chaussures',
};

const SLOT_TO_JOB_CLOTH: Record<number, { type: 'components' | 'props'; id: number }> = {
    // Colonne gauche
    1: { type: 'props', id: -1 },
    2: { type: 'props', id: Prop.Glasses.valueOf() },
    3: { type: 'props', id: Prop.Ear.valueOf() },
    4: { type: 'components', id: Component.Tops.valueOf() },
    5: { type: 'props', id: Prop.LeftHand.valueOf() },
    6: { type: 'components', id: Component.Torso.valueOf() },
    7: { type: 'components', id: Component.Bag.valueOf() },

    // Colonne droite
    8: { type: 'props', id: Prop.Hat.valueOf() },
    9: { type: 'components', id: Component.Mask.valueOf() },
    10: { type: 'components', id: Component.Accessories.valueOf() },
    11: { type: 'components', id: Component.BodyArmor.valueOf() },
    12: { type: 'props', id: Prop.RightHand.valueOf() },
    13: { type: 'components', id: Component.Legs.valueOf() },
    14: { type: 'components', id: Component.Shoes.valueOf() },
};

const SlotPlaceholder: FunctionComponent<{ slot: number }> = ({ slot }) => {
    const { getPath } = useAssetPath();

    return (
        <div className="flex items-center justify-center">
            <div
                className="bg-no-repeat bg-center bg-contain opacity-50 size-16 flex justify-center items-end"
                style={{
                    backgroundImage: `url(${getPath(`images/inventory/clothes/${SLOT_TO_ICON[slot]}.webp`)})`,
                }}
            />
        </div>
    );
};

const SlotOverlay: FunctionComponent<PropsWithChildren<{ slot: number }>> = ({ slot, children }) => {
    const player = usePlayer();
    const itemSize = useItemSize();
    const { getPath } = useAssetPath();

    const configKey = SLOT_TO_CONFIG[slot];
    const isConfigEnabled = slot === 1 ? player.cloth_config.Config[configKey] : !player.cloth_config.Config[configKey];

    if (!player.cloth_config.JobClothSet) {
        return children;
    }

    const slotConfig = SLOT_TO_JOB_CLOTH[slot];
    const configType = slotConfig.type === 'components' ? 'Components' : 'Props';
    const clothSetConfig = player.cloth_config.JobClothSet?.[configType]?.[slotConfig.id];

    return (
        <div className="relative">
            <div className="absolute top-1 right-1 z-20 text-white cursor-pointer">
                {isConfigEnabled ? <EyeIcon className="size-5" /> : <EyeOffIcon className="size-5" />}
            </div>

            <BorderBox duration="duration-0" borderClassName="rounded-xl" showBorderOnHover>
                <div
                    className="cursor-pointer flex justify-center items-center text-white hover:bg-white/10"
                    style={{
                        width: `${itemSize}px`,
                        height: `${itemSize}px`,
                    }}
                >
                    {clothSetConfig ? (
                        <div
                            className="bg-no-repeat bg-center bg-contain size-16 flex justify-center items-end"
                            style={{
                                backgroundImage: `url(${getPath(
                                    getApparelIcon(
                                        player,
                                        slotConfig.type,
                                        slotConfig.id,
                                        clothSetConfig.Collection,
                                        clothSetConfig.Drawable,
                                        clothSetConfig.Texture
                                    )
                                )})`,
                            }}
                        />
                    ) : (
                        <div
                            className="bg-no-repeat bg-center bg-contain opacity-20 size-16 flex justify-center items-end"
                            style={{
                                backgroundImage: `url(${getPath(`images/inventory/clothes/${SLOT_TO_ICON[slot]}.webp`)})`,
                            }}
                        />
                    )}
                </div>
            </BorderBox>
        </div>
    );
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
        const inventoryItem = inventoryItems?.[slot] || null;
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

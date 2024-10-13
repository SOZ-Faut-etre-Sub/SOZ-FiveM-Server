import { ShopScalp } from '@public/config/scalp';
import { usePlayer } from '@public/nui/hook/data';
import { PlayerData } from '@public/shared/player';
import { BarberConfiguration, BarberShopCategory, BarberShopColors, BarberShopContent } from '@public/shared/shop';
import { FunctionComponent, useState } from 'react';

import { TaxType } from '../../../shared/bank';
import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { useGetPrice } from '../../hook/price';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSelectOptionColor,
    MenuTitle,
} from '../Styleguide/Menu';

type MenuBarberShopStateProps = {
    data: {
        shop_content: BarberShopContent;
        shop_colors: BarberShopColors;
    };
};

export const BarberShopMenu: FunctionComponent<MenuBarberShopStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_shop_barber';
    const player_data = usePlayer();
    const content = data.shop_content[player_data.skin.Model.Hash];
    const [configuration, setConfiguration] = useState<Record<string, BarberConfiguration>>({});
    const [currentCat, setCurrentCat] = useState<string>('Hair');
    const [totalConfiguration, setTotalConfiguration] = useState<BarberConfiguration>({
        Hair: {},
        Makeup: {},
        FaceTraits: {},
    });

    const updateConfiguration = (category: string, overlay: string, field: string, value: number | boolean) => {
        configuration[category] = configuration[category] || { Hair: {}, Makeup: {}, FaceTraits: {} };
        configuration[category][overlay][field] = value;
        setConfiguration(configuration);
        totalConfiguration[overlay][field] = value;
        setTotalConfiguration(totalConfiguration);
        fetchNui(NuiEvent.BarberShopPreview, totalConfiguration);
    };

    const onSelectCam = async (category: string) => {
        if (currentCat !== category) {
            if (currentCat === 'ChestHair') {
                await fetchNui(NuiEvent.BarberShopThroughCategory, 'Other');
                setCurrentCat(category);
                return;
            }

            if (category === 'ChestHair') {
                await fetchNui(NuiEvent.BarberShopThroughCategory, 'ChestHair');
                setCurrentCat(category);
                return;
            }
        }
    };

    return (
        <Menu type={MenuType.BarberShop}>
            <MainMenu>
                <MenuTitle banner={banner}>Coiffeur</MenuTitle>
                <MenuContent>
                    <MenuBarberHairComponent
                        cat={content.find(cat => cat.category === 'Hair')}
                        player_data={player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Hair')}
                        config={configuration['Hair']}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberBeardComponent
                        cat={content.find(cat => cat.category === 'Beard')}
                        player_data={player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Beard')}
                        config={configuration['Beard']}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberChestHairComponent
                        cat={content.find(cat => cat.category === 'ChestHair')}
                        player_data={player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'ChestHair')}
                        config={configuration['ChestHair']}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberEyebrowComponent
                        cat={content.find(cat => cat.category === 'Eyebrow')}
                        player_data={player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Eyebrow')}
                        config={configuration['Eyebrow']}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberEyeComponent
                        cat={content.find(cat => cat.category === 'FaceTraits')}
                        player_data={player_data}
                        updateConfiguration={updateConfiguration}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'FaceTraits')}
                        config={configuration['FaceTraits']}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberMakeupComponent
                        cat={content.find(cat => cat.category === 'Makeup')}
                        player_data={player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Makeup')}
                        config={configuration['Makeup']}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberBlushComponent
                        cat={content.find(cat => cat.category === 'Blush')}
                        player_data={player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Blush')}
                        config={configuration['Blush']}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberLipstickComponent
                        cat={content.find(cat => cat.category === 'Lipstick')}
                        player_data={player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                        onSelectCam={onSelectCam}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Lipstick')}
                        config={configuration['Lipstick']}
                        onSelectCam={onSelectCam}
                    />
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

const MenuBarberValidateButton: FunctionComponent<{
    cat: BarberShopCategory;
    config: BarberConfiguration;
    onSelectCam: (cat: string) => void;
}> = ({ cat, config, onSelectCam }) => {
    const getPrice = useGetPrice();

    if (!cat) {
        return null;
    }

    return (
        <MenuItemButton
            onConfirm={async () => {
                await fetchNui(NuiEvent.BarberShopBuy, {
                    configuration: config,
                    price: cat.price,
                    overlay: cat.overlay,
                });
            }}
            onSelected={async () => {
                onSelectCam(cat.category);
            }}
        >
            <div className="flex justify-between items-center">
                <span>Valider les modifications</span>
                <span className="mr-1">${getPrice(cat.price, TaxType.SUPPLY)}</span>
            </div>
        </MenuItemButton>
    );
};

const MenuBarberHairComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
    onSelectCam: (cat: string) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration, onSelectCam }) => {
    if (!cat) {
        return null;
    }
    return (
        <>
            <MenuTitle>{cat.label}</MenuTitle>
            <MenuItemSelect
                title="Type"
                onChange={async (_, type) => {
                    updateConfiguration(cat.category, cat.overlay, 'HairType', type);
                }}
                onSelected={async () => {
                    onSelectCam(cat.category);
                }}
                value={player_data.skin.Hair.HairType}
            >
                {cat.items.map(entry => (
                    <MenuItemSelectOption key={entry.value} value={entry.value}>
                        {entry.label}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Couleur"
                distance={3}
                onChange={async (_, color) => {
                    updateConfiguration(cat.category, cat.overlay, 'HairColor', color);
                }}
                value={player_data.skin.Hair.HairColor}
            >
                {shop_colors.Hair.map(entry => (
                    <MenuItemSelectOptionColor
                        key={entry.value}
                        value={entry.value}
                        color={[entry.r, entry.g, entry.b]}
                    ></MenuItemSelectOptionColor>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Couleur secondaire"
                distance={3}
                onChange={async (_, color) => {
                    updateConfiguration(cat.category, cat.overlay, 'HairSecondaryColor', color);
                }}
                value={player_data.skin.Hair.HairSecondaryColor}
            >
                {shop_colors.Hair.map(entry => (
                    <MenuItemSelectOptionColor
                        key={entry.value}
                        value={entry.value}
                        color={[entry.r, entry.g, entry.b]}
                    ></MenuItemSelectOptionColor>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Cuir chevelu"
                onChange={async (index, value: number) => {
                    const scalp = ShopScalp[player_data.skin.Model.Hash][value];
                    updateConfiguration(
                        cat.category,
                        cat.overlay,
                        'Scalp',
                        scalp
                            ? {
                                  Collection: scalp.collection,
                                  Overlay: scalp.nameHash,
                              }
                            : null
                    );
                }}
                value={ShopScalp[player_data.skin.Model.Hash].findIndex(
                    elem =>
                        elem.collection == player_data.skin.Hair.Scalp?.Collection &&
                        elem.nameHash == player_data.skin.Hair.Scalp?.Overlay
                )}
            >
                <MenuItemSelectOption key={'scalp'} value={null}>
                    Aucun
                </MenuItemSelectOption>
                {ShopScalp[player_data.skin.Model.Hash]
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((entry, index) => (
                        <MenuItemSelectOption key={'scalp' + index} value={index} helper={entry.name}>
                            {entry.name}
                        </MenuItemSelectOption>
                    ))}
            </MenuItemSelect>
        </>
    );
};

const MenuBarberBeardComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
    onSelectCam: (cat: string) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration, onSelectCam }) => {
    if (!cat) {
        return null;
    }
    return (
        <>
            <MenuTitle>{cat.label}</MenuTitle>
            <MenuItemSelect
                title="Type"
                onChange={async (_, type) => {
                    updateConfiguration(cat.category, cat.overlay, 'BeardType', type);
                }}
                onSelected={async () => {
                    onSelectCam(cat.category);
                }}
                value={player_data.skin.Hair.BeardType}
            >
                {cat.items.map(entry => (
                    <MenuItemSelectOption key={entry.value} value={entry.value}>
                        {entry.label}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Densité"
                onChange={async (_, density) => {
                    updateConfiguration(cat.category, cat.overlay, 'BeardOpacity', density / 100);
                }}
                value={player_data.skin.Hair.BeardOpacity * 100}
            >
                {[...Array(21)]
                    .map((_, i) => i * 5)
                    .map(entry => (
                        <MenuItemSelectOption key={entry} value={entry}>
                            {entry}
                        </MenuItemSelectOption>
                    ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Couleur"
                distance={3}
                onChange={async (_, color) => {
                    updateConfiguration(cat.category, cat.overlay, 'BeardColor', color);
                }}
                value={player_data.skin.Hair.BeardColor}
            >
                {shop_colors.Hair.map(entry => (
                    <MenuItemSelectOptionColor
                        key={entry.value}
                        value={entry.value}
                        color={[entry.r, entry.g, entry.b]}
                    ></MenuItemSelectOptionColor>
                ))}
            </MenuItemSelect>
        </>
    );
};

const MenuBarberChestHairComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
    onSelectCam: (cat: string) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration, onSelectCam }) => {
    if (!cat) {
        return null;
    }
    return (
        <>
            <MenuTitle>{cat.label}</MenuTitle>
            <MenuItemSelect
                title="Type"
                onChange={async (_, type) => {
                    updateConfiguration(cat.category, cat.overlay, 'ChestHairType', type);
                }}
                onSelected={async () => {
                    onSelectCam(cat.category);
                }}
                value={player_data.skin.Hair.ChestHairType}
            >
                {cat.items.map(entry => (
                    <MenuItemSelectOption key={entry.value} value={entry.value}>
                        {entry.label}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Densité"
                onChange={async (_, density) => {
                    updateConfiguration(cat.category, cat.overlay, 'ChestHairOpacity', density / 100);
                }}
                value={player_data.skin.Hair.ChestHairOpacity * 100}
            >
                {[...Array(21)]
                    .map((_, i) => i * 5)
                    .map(entry => (
                        <MenuItemSelectOption key={entry} value={entry}>
                            {entry}
                        </MenuItemSelectOption>
                    ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Couleur"
                distance={3}
                onChange={async (_, color) => {
                    updateConfiguration(cat.category, cat.overlay, 'ChestHairColor', color);
                }}
                value={player_data.skin.Hair.ChestHairColor}
            >
                {shop_colors.Hair.map(entry => (
                    <MenuItemSelectOptionColor
                        key={entry.value}
                        value={entry.value}
                        color={[entry.r, entry.g, entry.b]}
                    ></MenuItemSelectOptionColor>
                ))}
            </MenuItemSelect>
        </>
    );
};

const MenuBarberMakeupComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
    onSelectCam: (cat: string) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration, onSelectCam }) => {
    if (!cat) {
        return null;
    }
    return (
        <>
            <MenuTitle>{cat.label}</MenuTitle>
            <MenuItemSelect
                title="Type"
                onChange={async (_, type) => {
                    updateConfiguration(cat.category, cat.overlay, 'FullMakeupType', type);
                }}
                onSelected={async () => {
                    onSelectCam(cat.category);
                }}
                value={player_data.skin.Makeup.FullMakeupType}
            >
                {cat.items.map(entry => (
                    <MenuItemSelectOption key={entry.value} value={entry.value}>
                        {entry.label}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Densité"
                onChange={async (_, density) => {
                    updateConfiguration(cat.category, cat.overlay, 'FullMakeupOpacity', density / 100);
                }}
                value={player_data.skin.Makeup.FullMakeupOpacity * 100}
            >
                {[...Array(21)]
                    .map((_, i) => i * 5)
                    .map(entry => (
                        <MenuItemSelectOption key={entry} value={entry}>
                            {entry}
                        </MenuItemSelectOption>
                    ))}
            </MenuItemSelect>
            <MenuItemCheckbox
                checked={player_data.skin.Makeup.FullMakeupDefaultColor}
                onChange={checked => {
                    updateConfiguration(cat.category, cat.overlay, 'FullMakeupDefaultColor', checked);
                }}
            >
                Utiliser la couleur par défaut
            </MenuItemCheckbox>
            <MenuItemSelect
                title="Couleur principale"
                distance={3}
                onChange={async (_, color) => {
                    updateConfiguration(cat.category, cat.overlay, 'FullMakeupPrimaryColor', color);
                }}
                value={player_data.skin.Makeup.FullMakeupPrimaryColor}
            >
                {shop_colors.Makeup.map(entry => (
                    <MenuItemSelectOptionColor
                        key={entry.value}
                        value={entry.value}
                        color={[entry.r, entry.g, entry.b]}
                    ></MenuItemSelectOptionColor>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Couleur secondaire"
                distance={3}
                onChange={async (_, color) => {
                    updateConfiguration(cat.category, cat.overlay, 'FullMakeupSecondaryColor', color);
                }}
                value={player_data.skin.Makeup.FullMakeupSecondaryColor}
            >
                {shop_colors.Makeup.map(entry => (
                    <MenuItemSelectOptionColor
                        key={entry.value}
                        value={entry.value}
                        color={[entry.r, entry.g, entry.b]}
                    ></MenuItemSelectOptionColor>
                ))}
            </MenuItemSelect>
        </>
    );
};

const MenuBarberBlushComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
    onSelectCam: (cat: string) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration, onSelectCam }) => {
    if (!cat) {
        return null;
    }
    return (
        <>
            <MenuTitle>{cat.label}</MenuTitle>
            <MenuItemSelect
                title="Type"
                onChange={async (_, type) => {
                    updateConfiguration(cat.category, cat.overlay, 'BlushType', type);
                }}
                onSelected={async () => {
                    onSelectCam(cat.category);
                }}
                value={player_data.skin.Makeup.BlushType}
            >
                {cat.items.map(entry => (
                    <MenuItemSelectOption key={entry.value} value={entry.value}>
                        {entry.label}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Densité"
                onChange={async (_, density) => {
                    updateConfiguration(cat.category, cat.overlay, 'BlushOpacity', density / 100);
                }}
                value={player_data.skin.Makeup.BlushOpacity * 100}
            >
                {[...Array(21)]
                    .map((_, i) => i * 5)
                    .map(entry => (
                        <MenuItemSelectOption key={entry} value={entry}>
                            {entry}
                        </MenuItemSelectOption>
                    ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Couleur du blush"
                distance={3}
                onChange={async (_, color) => {
                    updateConfiguration(cat.category, cat.overlay, 'BlushColor', color);
                }}
                value={player_data.skin.Makeup.BlushColor}
            >
                {shop_colors.Makeup.map(entry => (
                    <MenuItemSelectOptionColor
                        key={entry.value}
                        value={entry.value}
                        color={[entry.r, entry.g, entry.b]}
                    ></MenuItemSelectOptionColor>
                ))}
            </MenuItemSelect>
        </>
    );
};

const MenuBarberLipstickComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
    onSelectCam: (cat: string) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration, onSelectCam }) => {
    if (!cat) {
        return null;
    }
    return (
        <>
            <MenuTitle>{cat.label}</MenuTitle>
            <MenuItemSelect
                title="Type"
                onChange={async (_, type) => {
                    updateConfiguration(cat.category, cat.overlay, 'LipstickType', type);
                }}
                onSelected={async () => {
                    onSelectCam(cat.category);
                }}
                value={player_data.skin.Makeup.LipstickType}
            >
                {cat.items.map(entry => (
                    <MenuItemSelectOption key={entry.value} value={entry.value}>
                        {entry.label}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Densité"
                onChange={async (_, density) => {
                    updateConfiguration(cat.category, cat.overlay, 'LipstickOpacity', density / 100);
                }}
                value={player_data.skin.Makeup.LipstickOpacity * 100}
            >
                {[...Array(21)]
                    .map((_, i) => i * 5)
                    .map(entry => (
                        <MenuItemSelectOption key={entry} value={entry}>
                            {entry}
                        </MenuItemSelectOption>
                    ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Couleur du rouge à lèvre"
                distance={3}
                onChange={async (_, color) => {
                    updateConfiguration(cat.category, cat.overlay, 'LipstickColor', color);
                }}
                value={player_data.skin.Makeup.LipstickColor}
            >
                {shop_colors.Makeup.map(entry => (
                    <MenuItemSelectOptionColor
                        key={entry.value}
                        value={entry.value}
                        color={[entry.r, entry.g, entry.b]}
                    ></MenuItemSelectOptionColor>
                ))}
            </MenuItemSelect>
        </>
    );
};

const MenuBarberEyeComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
    onSelectCam: (cat: string) => void;
}> = ({ cat, player_data, updateConfiguration, onSelectCam }) => {
    if (!cat || cat.items.length < 1) {
        return null;
    }
    return (
        <>
            <MenuTitle>{cat.label}</MenuTitle>
            <MenuItemSelect
                title="Couleur"
                onChange={async (_, type) => {
                    updateConfiguration(cat.category, cat.overlay, 'EyeColor', type);
                }}
                onSelected={async () => {
                    onSelectCam(cat.category);
                }}
                value={player_data.skin.FaceTrait.EyeColor}
            >
                {cat.items.map(entry => (
                    <MenuItemSelectOption key={entry.value} value={entry.value}>
                        {entry.label}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
        </>
    );
};

const MenuBarberEyebrowComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
    onSelectCam: (cat: string) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration, onSelectCam }) => {
    if (!cat) {
        return null;
    }
    return (
        <>
            <MenuTitle>{cat.label}</MenuTitle>
            <MenuItemSelect
                title="Type"
                onChange={async (_, type) => {
                    updateConfiguration(cat.category, cat.overlay, 'EyebrowType', type);
                }}
                onSelected={async () => {
                    onSelectCam(cat.category);
                }}
                value={player_data.skin.Hair.EyebrowType}
            >
                {cat.items.map(entry => (
                    <MenuItemSelectOption key={entry.value} value={entry.value}>
                        {entry.label}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Densité"
                onChange={async (_, density) => {
                    updateConfiguration(cat.category, cat.overlay, 'EyebrowOpacity', density / 100);
                }}
                value={player_data.skin.Hair.EyebrowOpacity * 100}
            >
                {[...Array(21)]
                    .map((_, i) => i * 5)
                    .map(entry => (
                        <MenuItemSelectOption key={entry} value={entry}>
                            {entry}
                        </MenuItemSelectOption>
                    ))}
            </MenuItemSelect>
            <MenuItemSelect
                title="Couleur"
                distance={3}
                onChange={async (_, color) => {
                    updateConfiguration(cat.category, cat.overlay, 'EyebrowColor', color);
                }}
                value={player_data.skin.Hair.EyebrowColor}
            >
                {shop_colors.Hair.map(entry => (
                    <MenuItemSelectOptionColor
                        key={entry.value}
                        value={entry.value}
                        color={[entry.r, entry.g, entry.b]}
                    ></MenuItemSelectOptionColor>
                ))}
            </MenuItemSelect>
        </>
    );
};

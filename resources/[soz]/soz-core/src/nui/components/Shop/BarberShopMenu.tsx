import { PlayerData } from '@public/shared/player';
import { BarberConfiguration, BarberShopCategory, BarberShopColors, BarberShopContent } from '@public/shared/shop';
import { FunctionComponent, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
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
        player_data: PlayerData;
        shop_colors: BarberShopColors;
    };
};

export const BarberShopMenu: FunctionComponent<MenuBarberShopStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_shop_barber';
    const content = data.shop_content[data.player_data.skin.Model.Hash];
    const [configuration, setConfiguration] = useState<Record<string, BarberConfiguration>>({});
    const [totalConfiguration, setTotalConfiguration] = useState<BarberConfiguration>({ Hair: {}, Makeup: {} });

    const updateConfiguration = (category: string, overlay: string, field: string, value: number | boolean) => {
        configuration[category] = configuration[category] || { Hair: {}, Makeup: {} };
        configuration[category][overlay][field] = value;
        setConfiguration(configuration);
        totalConfiguration[overlay][field] = value;
        setTotalConfiguration(totalConfiguration);
        fetchNui(NuiEvent.BarberShopPreview, totalConfiguration);
    };

    return (
        <Menu type={MenuType.BarberShop}>
            <MainMenu>
                <MenuTitle banner={banner}>Coiffeur</MenuTitle>
                <MenuContent>
                    <MenuBarberHairComponent
                        cat={content.find(cat => cat.category === 'Hair')}
                        player_data={data.player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Hair')}
                        config={configuration['Hair']}
                    />
                    <MenuBarberBeardComponent
                        cat={content.find(cat => cat.category === 'Beard')}
                        player_data={data.player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Beard')}
                        config={configuration['Beard']}
                    />
                    <MenuBarberMakeupComponent
                        cat={content.find(cat => cat.category === 'Makeup')}
                        player_data={data.player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Makeup')}
                        config={configuration['Makeup']}
                    />
                    <MenuBarberBlushComponent
                        cat={content.find(cat => cat.category === 'Blush')}
                        player_data={data.player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Blush')}
                        config={configuration['Blush']}
                    />
                    <MenuBarberLipstickComponent
                        cat={content.find(cat => cat.category === 'Lipstick')}
                        player_data={data.player_data}
                        shop_colors={data.shop_colors}
                        updateConfiguration={updateConfiguration}
                    />
                    <MenuBarberValidateButton
                        cat={content.find(cat => cat.category === 'Lipstick')}
                        config={configuration['Lipstick']}
                    />
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

const MenuBarberValidateButton: FunctionComponent<{
    cat: BarberShopCategory;
    config: BarberConfiguration;
}> = ({ cat, config }) => {
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
        >
            <div className="flex justify-between items-center">
                <span>Valider les modifications</span>
                <span className="mr-1">${cat.price}</span>
            </div>
        </MenuItemButton>
    );
};

const MenuBarberHairComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration }) => {
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
        </>
    );
};

const MenuBarberBeardComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration }) => {
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
                {[...Array(20)]
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

const MenuBarberMakeupComponent: FunctionComponent<{
    cat: BarberShopCategory;
    player_data: PlayerData;
    shop_colors: BarberShopColors;
    updateConfiguration: (cat: string, overlay: string, field: string, v: any) => void;
}> = ({ cat, player_data, shop_colors, updateConfiguration }) => {
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
                {[...Array(20)]
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
}> = ({ cat, player_data, shop_colors, updateConfiguration }) => {
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
                {[...Array(20)]
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
}> = ({ cat, player_data, shop_colors, updateConfiguration }) => {
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
                {[...Array(20)]
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

import { PlayerData } from '@public/shared/player';
import { BarberConfiguration, BarberShopColors, BarberShopContent } from '@public/shared/shop';
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
                    {content.map(cat => {
                        const title = <MenuTitle>{cat.label}</MenuTitle>;
                        let core;
                        const validateButton = (
                            <MenuItemButton
                                onConfirm={async () => {
                                    await fetchNui(NuiEvent.BarberShopBuy, {
                                        configuration: configuration[cat.category],
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

                        switch (cat.category) {
                            case 'Hair':
                                core = (
                                    <>
                                        <MenuItemSelect
                                            title="Type"
                                            onChange={async (_, type) => {
                                                updateConfiguration(cat.category, cat.overlay, 'HairType', type);
                                            }}
                                            value={data.player_data.skin.Hair.HairType}
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
                                            value={data.player_data.skin.Hair.HairColor}
                                        >
                                            {data.shop_colors.Hair.map(entry => (
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
                                                updateConfiguration(
                                                    cat.category,
                                                    cat.overlay,
                                                    'HairSecondaryColor',
                                                    color
                                                );
                                            }}
                                            value={data.player_data.skin.Hair.HairSecondaryColor}
                                        >
                                            {data.shop_colors.Hair.map(entry => (
                                                <MenuItemSelectOptionColor
                                                    key={entry.value}
                                                    value={entry.value}
                                                    color={[entry.r, entry.g, entry.b]}
                                                ></MenuItemSelectOptionColor>
                                            ))}
                                        </MenuItemSelect>
                                    </>
                                );
                                break;
                            case 'Beard':
                                core = (
                                    <>
                                        <MenuItemSelect
                                            title="Type"
                                            onChange={async (_, type) => {
                                                updateConfiguration(cat.category, cat.overlay, 'BeardType', type);
                                            }}
                                            value={data.player_data.skin.Hair.BeardType}
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
                                                updateConfiguration(
                                                    cat.category,
                                                    cat.overlay,
                                                    'BeardOpacity',
                                                    density / 100
                                                );
                                            }}
                                            value={data.player_data.skin.Hair.BeardOpacity * 100}
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
                                            value={data.player_data.skin.Hair.BeardColor}
                                        >
                                            {data.shop_colors.Hair.map(entry => (
                                                <MenuItemSelectOptionColor
                                                    key={entry.value}
                                                    value={entry.value}
                                                    color={[entry.r, entry.g, entry.b]}
                                                ></MenuItemSelectOptionColor>
                                            ))}
                                        </MenuItemSelect>
                                    </>
                                );
                                break;
                            case 'Makeup':
                                core = (
                                    <>
                                        <MenuItemSelect
                                            title="Type"
                                            onChange={async (_, type) => {
                                                updateConfiguration(cat.category, cat.overlay, 'FullMakeupType', type);
                                            }}
                                            value={data.player_data.skin.Makeup.FullMakeupType}
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
                                                updateConfiguration(
                                                    cat.category,
                                                    cat.overlay,
                                                    'FullMakeupOpacity',
                                                    density / 100
                                                );
                                            }}
                                            value={data.player_data.skin.Makeup.FullMakeupOpacity * 100}
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
                                            checked={data.player_data.skin.Makeup.FullMakeupDefaultColor}
                                            onChange={checked => {
                                                updateConfiguration(
                                                    cat.category,
                                                    cat.overlay,
                                                    'FullMakeupDefaultColor',
                                                    checked
                                                );
                                            }}
                                        >
                                            Utiliser la couleur par défaut
                                        </MenuItemCheckbox>
                                        <MenuItemSelect
                                            title="Couleur principale"
                                            distance={3}
                                            onChange={async (_, color) => {
                                                updateConfiguration(
                                                    cat.category,
                                                    cat.overlay,
                                                    'FullMakeupPrimaryColor',
                                                    color
                                                );
                                            }}
                                            value={data.player_data.skin.Makeup.FullMakeupPrimaryColor}
                                        >
                                            {data.shop_colors.Makeup.map(entry => (
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
                                                updateConfiguration(
                                                    cat.category,
                                                    cat.overlay,
                                                    'FullMakeupSecondaryColor',
                                                    color
                                                );
                                            }}
                                            value={data.player_data.skin.Makeup.FullMakeupSecondaryColor}
                                        >
                                            {data.shop_colors.Makeup.map(entry => (
                                                <MenuItemSelectOptionColor
                                                    key={entry.value}
                                                    value={entry.value}
                                                    color={[entry.r, entry.g, entry.b]}
                                                ></MenuItemSelectOptionColor>
                                            ))}
                                        </MenuItemSelect>
                                    </>
                                );
                                break;
                            case 'Blush':
                                core = (
                                    <>
                                        <MenuItemSelect
                                            title="Type"
                                            onChange={async (_, type) => {
                                                updateConfiguration(cat.category, cat.overlay, 'BlushType', type);
                                            }}
                                            value={data.player_data.skin.Makeup.BlushType}
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
                                                updateConfiguration(
                                                    cat.category,
                                                    cat.overlay,
                                                    'BlushOpacity',
                                                    density / 100
                                                );
                                            }}
                                            value={data.player_data.skin.Makeup.BlushOpacity * 100}
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
                                            value={data.player_data.skin.Makeup.BlushColor}
                                        >
                                            {data.shop_colors.Makeup.map(entry => (
                                                <MenuItemSelectOptionColor
                                                    key={entry.value}
                                                    value={entry.value}
                                                    color={[entry.r, entry.g, entry.b]}
                                                ></MenuItemSelectOptionColor>
                                            ))}
                                        </MenuItemSelect>
                                    </>
                                );
                                break;
                            case 'Lipstick':
                                core = (
                                    <>
                                        <MenuItemSelect
                                            title="Type"
                                            onChange={async (_, type) => {
                                                updateConfiguration(cat.category, cat.overlay, 'LipstickType', type);
                                            }}
                                            value={data.player_data.skin.Makeup.LipstickType}
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
                                                updateConfiguration(
                                                    cat.category,
                                                    cat.overlay,
                                                    'LipstickOpacity',
                                                    density / 100
                                                );
                                            }}
                                            value={data.player_data.skin.Makeup.LipstickOpacity * 100}
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
                                            value={data.player_data.skin.Makeup.LipstickColor}
                                        >
                                            {data.shop_colors.Makeup.map(entry => (
                                                <MenuItemSelectOptionColor
                                                    key={entry.value}
                                                    value={entry.value}
                                                    color={[entry.r, entry.g, entry.b]}
                                                ></MenuItemSelectOptionColor>
                                            ))}
                                        </MenuItemSelect>
                                    </>
                                );
                        }
                        return (
                            <>
                                {title}
                                {core}
                                {validateButton}
                            </>
                        );
                    })}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

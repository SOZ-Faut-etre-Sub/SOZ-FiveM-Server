import { fetchNui } from '@public/nui/fetch';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { JewelryShopItem, ShopJewelryContent } from '@public/shared/shop';
import { FunctionComponent } from 'react';

import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuJewelryShopStateProps = {
    catalog: {
        shop_content: ShopJewelryContent;
    };
};

export const JewelryShopMenu: FunctionComponent<MenuJewelryShopStateProps> = ({ catalog }) => {
    const banner = 'https://nui-img/soz/menu_shop_jewelry';

    useNuiEvent('menu', 'Backspace', () => {
        fetchNui(NuiEvent.JewelryShopBackspace);
    });

    if (!catalog || !catalog.shop_content) {
        return null;
    }

    return (
        <Menu type={MenuType.JewelryShop}>
            <MainMenu>
                <MenuTitle banner={banner}> Bijoutier </MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        onChange={check => {
                            fetchNui(NuiEvent.JewelryShopToggleCamera, check);
                        }}
                    >
                        Libérer la caméra
                    </MenuItemCheckbox>
                    {Object.entries(catalog.shop_content).map(([catName, cat]) => (
                        <MenuItemSubMenuLink id={String(cat.categoryId)}>{catName}</MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {Object.entries(catalog.shop_content).map(([catName, cat]) => (
                <SubMenu key={cat.categoryId} id={String(cat.categoryId)}>
                    <MenuTitle banner={banner}> {catName} </MenuTitle>
                    <MenuContent>
                        {Object.keys(cat.items).map(subCatName => (
                            <MenuItemSubMenuLink id={(String(cat.categoryId) + String(subCatName)).replace(/\s/g, '')}>
                                {subCatName}
                            </MenuItemSubMenuLink>
                        ))}
                    </MenuContent>
                </SubMenu>
            ))}
            {Object.values(catalog.shop_content).map(cat =>
                Object.entries(cat.items).map(([subCatName, subCat]) => (
                    <SubMenu id={(String(cat.categoryId) + String(subCatName)).replace(/\s/g, '')}>
                        <MenuTitle banner={banner}> {subCatName} </MenuTitle>
                        <MenuContent>
                            {Object.entries(subCat).map(([drawable, next]) => (
                                <MenuItemSelect
                                    key={parseInt(drawable)}
                                    title={''}
                                    titleWidth={0}
                                    value={Object.keys(next)[0]}
                                    onSelectedValue={async (_, value) => {
                                        await fetchNui(NuiEvent.JewelryShopPreview, {
                                            drawable: parseInt(drawable),
                                            texture: parseInt(value),
                                            propId: cat.propId,
                                            componentId: cat.componentId,
                                        });
                                    }}
                                    description={`💸 Prix : $${cat.price}`}
                                    onConfirm={async (_, value) => {
                                        fetchNui(NuiEvent.JewelryShopBuy, {
                                            label: next[value].Localized,
                                            price: cat.price,
                                            overlay: cat.overlay,
                                            components:
                                                cat.componentId != null
                                                    ? {
                                                          [cat.componentId]: {
                                                              Drawable: parseInt(drawable),
                                                              Texture: parseInt(value),
                                                              Palette: 0,
                                                          },
                                                      }
                                                    : null,
                                            props:
                                                cat.propId != null
                                                    ? {
                                                          [cat.propId]: {
                                                              Drawable: parseInt(drawable),
                                                              Texture: parseInt(value),
                                                              Palette: 0,
                                                          },
                                                      }
                                                    : null,
                                        } as JewelryShopItem);
                                    }}
                                >
                                    {Object.entries(next).map(([texture, content]) => (
                                        <MenuItemSelectOption
                                            key={parseInt(texture)}
                                            value={texture}
                                            onSelected={async () => {
                                                await fetchNui(NuiEvent.JewelryShopPreview, {
                                                    drawable: parseInt(drawable),
                                                    texture: parseInt(texture),
                                                    propId: cat.propId,
                                                    componentId: cat.componentId,
                                                });
                                            }}
                                        >
                                            {content.Localized}
                                        </MenuItemSelectOption>
                                    ))}
                                </MenuItemSelect>
                            ))}
                        </MenuContent>
                    </SubMenu>
                ))
            )}
        </Menu>
    );
};

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
    MenuItemButton,
    MenuItemCheckbox,
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
                            {Object.entries(subCat).map(([drawable, next]) =>
                                Object.entries(next).map(([texture, content]) => (
                                    <MenuItemButton
                                        key={content.Localized}
                                        onConfirm={async () => {
                                            fetchNui(NuiEvent.JewelryShopBuy, {
                                                label: content.Localized,
                                                price: cat.price,
                                                overlay: cat.overlay,
                                                components:
                                                    cat.componentId != null
                                                        ? {
                                                              [cat.componentId]: {
                                                                  Drawable: parseInt(drawable),
                                                                  Texture: parseInt(texture),
                                                                  Palette: 0,
                                                              },
                                                          }
                                                        : null,
                                                props:
                                                    cat.propId != null
                                                        ? {
                                                              [cat.propId]: {
                                                                  Drawable: parseInt(drawable),
                                                                  Texture: parseInt(texture),
                                                                  Palette: 0,
                                                              },
                                                          }
                                                        : null,
                                            } as JewelryShopItem);
                                        }}
                                        onSelected={async () => {
                                            fetchNui(NuiEvent.JewelryShopPreview, {
                                                drawable: parseInt(drawable),
                                                texture: parseInt(texture),
                                                propId: cat.propId,
                                                componentId: cat.componentId,
                                            });
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{content.Localized}</span>
                                            <span className="mr-1">${cat.price}</span>
                                        </div>
                                    </MenuItemButton>
                                ))
                            )}
                        </MenuContent>
                    </SubMenu>
                ))
            )}
        </Menu>
    );
};

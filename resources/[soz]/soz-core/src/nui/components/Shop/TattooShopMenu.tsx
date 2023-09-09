import { BrandConfig, BrandsConfig } from '@public/config/shops';
import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { TattooShopCategory, TattooShopItem } from '@public/shared/shop';
import { FunctionComponent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { MainMenu, Menu, MenuContent, MenuItemButton, MenuTitle, SubMenu } from '../Styleguide/Menu';

type MenuTattooShopStateProps = {
    data: {
        brand: string;
        categories: Record<string, TattooShopCategory>;
        products: TattooShopItem[];
    };
};

export const TattooShopMenu: FunctionComponent<MenuTattooShopStateProps> = ({ data }) => {
    const config = BrandsConfig[data.brand] as BrandConfig;
    const navigate = useNavigate();
    const location = useLocation();

    if (!data.products || data.products.length === 0 || !data.brand || !config) {
        return null;
    }

    const selectCategory = (category: string) => {
        navigate(`/${MenuType.TattooShop}/${category}`, {
            state: location.state,
        });
    };

    return (
        <Menu type={MenuType.TattooShop}>
            <MainMenu>
                <MenuTitle banner={config.banner}> Tatoueur </MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={async () => {
                            await fetchNui(NuiEvent.TattooShopResetTattos);
                        }}
                        description="Suite à une encre de mauvaise qualité, vous pouvez retirer tous vos tatouages."
                    >
                        ⚠️ Se faire retirer les tatouages
                    </MenuItemButton>
                    {Object.keys(data.categories).map(category => (
                        <MenuItemButton
                            key={category}
                            onConfirm={async () => {
                                await fetchNui(NuiEvent.TattooShopSelectCategory, category);
                                selectCategory(category);
                            }}
                        >
                            {data.categories[category].label}
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </MainMenu>
            {Object.keys(data.categories).map(category => (
                <SubMenu key={category} id={category}>
                    <MenuTitle banner={config.banner}> {data.categories[category].label} </MenuTitle>
                    <MenuContent>
                        {Object.values(data.products)
                            .filter(product => product.Zone === category)
                            .map((product, id) => (
                                <MenuItemButton
                                    key={id}
                                    onConfirm={async () => {
                                        await fetchNui(NuiEvent.TattooShopBuy, product);
                                    }}
                                    onSelected={async () => {
                                        await fetchNui(NuiEvent.TattoShopPreview, product);
                                    }}
                                    description="Utilisez Shift pour changer la caméra."
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{product.Name}</span>
                                        <span className="mr-1">${product.Price}</span>
                                    </div>
                                </MenuItemButton>
                            ))}
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};

import { fetchNui } from '@public/nui/fetch';
import { useGetPrice } from '@public/nui/hook/price';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { FormatedFournitureItemList, isHousingPropvalid, ZkeaFourniture } from '@public/shared/shop/zkea_fourniture';
import { TaxType } from '@public/shared/tax';
import { FunctionComponent, useEffect, useState } from 'react';

import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemStringInput,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export const ZkeaFournitureMenu: FunctionComponent = () => {
    const banner = 'https://soz.zerator.com/static/game/images/banner/menu_zkea_fourniture.webp';
    const [textFilter, setTextFilter] = useState<string>();

    const fournituresByType: FormatedFournitureItemList = {};
    for (const fourniture of Object.values(ZkeaFourniture)) {
        if (isHousingPropvalid(fourniture.model) && !fourniture.notBuyable) {
            fournituresByType[fourniture.type] ??= [];
            fournituresByType[fourniture.type].push(fourniture);
        }
    }

    const [fournitures, setFrouniture] = useState<FormatedFournitureItemList>(fournituresByType);
    const getPrice = useGetPrice();

    const handleFilter = (value: string) => {
        setTextFilter(value);
    };

    useEffect(() => {
        const propList = {};
        for (const type of Object.keys(fournituresByType)) {
            propList[type] = fournituresByType[type]
                .filter(
                    item =>
                        !textFilter ||
                        item.name
                            .toLocaleLowerCase()
                            .normalize('NFD')
                            .replace(/\p{Diacritic}/gu, '')
                            .includes(textFilter.normalize('NFD').replace(/\p{Diacritic}/gu, ''))
                )
                .sort((a, b) => {
                    if (a.price < b.price) {
                        return -1;
                    }

                    if (a.price > b.price) {
                        return 1;
                    }

                    return a.name.localeCompare(b.name);
                });
            setFrouniture(propList);
        }
    }, [textFilter]);

    return (
        <Menu type={MenuType.ZkeaFournitureMenu}>
            <MainMenu>
                <MenuTitle banner={banner}>Zkea</MenuTitle>
                <MenuContent>
                    <MenuItemStringInput onChange={handleFilter} value={textFilter}>
                        Filtre:
                    </MenuItemStringInput>
                    {Object.keys(fournitures).map(type => (
                        <MenuItemSubMenuLink
                            id={`zkea_fourniture${type}`}
                            key={`zkea_fourniture${type}`}
                            disabled={fournitures[type].length === 0}
                            selectable={!(fournitures[type].length === 0)}
                        >
                            {type}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {Object.entries(fournitures).map(([type, fournitures]) => (
                <SubMenu id={`zkea_fourniture${type}`} key={`zkea_fourniture${type}`}>
                    <MenuTitle banner={banner}>{`Zkea - ${type}`}</MenuTitle>
                    <MenuContent>
                        <MenuItemStringInput onChange={handleFilter} value={textFilter}>
                            Filtre:
                        </MenuItemStringInput>
                        {Object.values(fournitures)
                            .sort((a, b) => {
                                if (a.price < b.price) {
                                    return -1;
                                }

                                if (a.price > b.price) {
                                    return 1;
                                }

                                return 0;
                            })
                            .map(fourniture => (
                                <MenuItemButton
                                    onSelected={() => {
                                        fetchNui(NuiEvent.ZkeaFournitureShow, fourniture.model);
                                    }}
                                    onConfirm={() => {
                                        fetchNui(NuiEvent.ZkeaFourniturePurchase, fourniture);
                                    }}
                                    description={
                                        ZkeaFourniture[fourniture.model]?.collision !== true
                                            ? '⚠ : Sans collision'
                                            : null
                                    }
                                >
                                    <div className="flex justify-between items-center">
                                        <span>
                                            {ZkeaFourniture[fourniture.model]?.collision !== true
                                                ? `⚠ ${fourniture.name}`
                                                : `${fourniture.name}`}
                                        </span>
                                        <span className="mr-1">${getPrice(fourniture.price, TaxType.HOUSING)}</span>
                                    </div>
                                </MenuItemButton>
                            ))}
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};

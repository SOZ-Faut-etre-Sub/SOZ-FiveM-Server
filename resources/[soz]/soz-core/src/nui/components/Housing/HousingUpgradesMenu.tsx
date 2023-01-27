import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event';
import { HousingUpgradesMenuData } from '@public/shared/housing/menu';
import { HousingTiers } from '@public/shared/housing/upgrades';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent, useEffect, useState } from 'react';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOptionBox,
    MenuTitle,
} from '../Styleguide/Menu';

type HousingUpgradesMenuProps = {
    data?: HousingUpgradesMenuData;
};

export const HousingUpgradesMenu: FunctionComponent<HousingUpgradesMenuProps> = ({ data }) => {
    if (!data) {
        data = {
            currentTier: 0,
            hasParking: true,
            apartmentPrice: 0,
            enableParking: true,
        };
    }

    const [tier, setTier] = useState(0);
    const [parking, setParking] = useState(true);
    const [tierPrice, setTierPrice] = useState(0);
    const [zkeaPrice, setZkeaPrice] = useState(0);
    const [parkingPrice, setParkingPrice] = useState(0);

    const banner = 'https://nui-img/soz/menu_housing_upgrades';

    useEffect(() => {
        if (data?.currentTier !== null && data?.currentTier !== undefined) {
            setTier(data.currentTier);
        }
        if (data?.hasParking !== null && data?.hasParking !== undefined) {
            setParking(data.hasParking);
        }
    }, [data]);

    useEffect(() => {
        const { currentTier, apartmentPrice } = data;
        let newPrice = 0;
        let newZkeaPrice = 0;
        for (let i = currentTier + 1; i <= tier; i++) {
            newPrice += (apartmentPrice * HousingTiers[i].pricePercent) / 100;
            newZkeaPrice += HousingTiers[i].zkeaPrice;
        }
        setTierPrice(newPrice);
        setZkeaPrice(newZkeaPrice);
        setParkingPrice(parking && !data.hasParking ? (apartmentPrice * 50) / 100 : 0);
    }, [tier, parking]);

    const onConfirm = () => {
        fetchNui(NuiEvent.HousingUpgradeApartment, {
            tier,
            price: tierPrice,
            zkeaPrice,
            enableParking: data.enableParking,
            hasParking: parking,
            parkingPrice,
        });
    };

    const onChange = (selectedTier: number) => {
        setTier(selectedTier);
    };

    const onParkingChange = (selected: boolean) => {
        setParking(selected);
    };

    return (
        <Menu type={MenuType.HousingUpgrades}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemSelect
                        title={
                            <div className="flex items-center">
                                <img alt="engine" className="ml-2 w-8 h-8" src={`/public/images/housing/maison.png`} />
                                <h3 className="ml-4">Palier</h3>
                            </div>
                        }
                        value={data.currentTier}
                        onChange={(_, value) => onChange(value)}
                        showAllOptions
                        alignRight
                    >
                        {Object.entries(HousingTiers).map(([tier, _]) => {
                            const value = parseInt(tier);
                            const label = value !== 0 ? value : 'Origine';
                            return (
                                <MenuItemSelectOptionBox key={value} value={value}>
                                    {label}
                                </MenuItemSelectOptionBox>
                            );
                        })}
                    </MenuItemSelect>
                    <MenuItemSelect
                        title={
                            <div className="flex items-center">
                                <img alt="engine" className="ml-2 w-8 h-8" src={`/public/images/housing/garage.png`} />
                                <h3 className="ml-4">Garage</h3>
                            </div>
                        }
                        value={data.hasParking}
                        onChange={(_, value) => onParkingChange(value)}
                        showAllOptions
                        alignRight
                    >
                        {data.enableParking && (
                            <MenuItemSelectOptionBox value={false}>Désactivé</MenuItemSelectOptionBox>
                        )}
                        <MenuItemSelectOptionBox value={true}>Activé</MenuItemSelectOptionBox>
                    </MenuItemSelect>
                    <MenuItemButton className="border-t border-white/50" onConfirm={() => onConfirm()}>
                        <div className="flex w-full justify-between items-center">
                            <span>Confirmer</span>
                            <span>${(tierPrice + parkingPrice).toFixed()}</span>
                        </div>
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

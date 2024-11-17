import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event';
import { ApartementTiers } from '@public/shared/housing/housing';
import { HousingUpgradesMenuData } from '@public/shared/housing/menu';
import { HousingTiers, MAX_TIER, MAX_TRAILER_TIER, TYPE_DESCRPTION, TYPE_LABEL } from '@public/shared/housing/upgrades';
import { MenuType } from '@public/shared/nui/menu';
import { FunctionComponent, useEffect, useState } from 'react';

import { TaxType } from '../../../shared/bank';
import { useGetPrice } from '../../hook/price';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSelectOptionBox,
    MenuTitle,
} from '../Styleguide/Menu';

type HousingUpgradesMenuProps = {
    data?: HousingUpgradesMenuData;
};

export const HousingUpgradesMenu: FunctionComponent<HousingUpgradesMenuProps> = ({ data }) => {
    if (!data) {
        data = {
            currentTier: {
                tier: 0,
                cloth_tier: 0,
                money_tier: 0,
                park_tier: 0,
            },
            hasParking: true,
            apartmentPrice: 0,
            isApartmentTrailer: true,
        };
    }
    if (!data.currentTier) {
        data.currentTier = {
            tier: 0,
            cloth_tier: 0,
            money_tier: 0,
            park_tier: 0,
        };
    } else {
        for (const type of Object.keys(TYPE_LABEL)) {
            if (data.currentTier[type] === undefined || data.currentTier[type] === null) {
                data.currentTier[type] = 0;
            }
        }
    }

    const maxTier = data.isApartmentTrailer ? MAX_TRAILER_TIER : MAX_TIER;

    const getPrice = useGetPrice();
    const [tier, setTier] = useState<ApartementTiers>(data.currentTier);
    const [parking, setParking] = useState(true);
    const [tierPrice, setTierPrice] = useState(0);
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
        for (const type of Object.keys(currentTier)) {
            for (let i = currentTier[type] + 1; i <= tier[type]; i++) {
                newPrice += (apartmentPrice * HousingTiers[type][i].pricePercent) / 100;
            }
        }
        setTierPrice(newPrice);
        setParkingPrice(parking && !data.hasParking ? (apartmentPrice * 50) / 100 : 0);
    }, [tier, parking]);

    const onConfirm = () => {
        fetchNui(NuiEvent.HousingUpgradeApartment, {
            apartmentTier: tier,
            price: tierPrice,
            isApartmentTrailer: data.isApartmentTrailer,
            hasParking: parking,
            parkingPrice,
        });
    };

    const onChange = (type: string, selectedTier: number) => {
        const newTier = { ...tier };
        newTier[type] = selectedTier;
        setTier(newTier);
    };

    const onParkingChange = (selected: boolean) => {
        setParking(selected);
    };

    return (
        <Menu type={MenuType.HousingUpgrades}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    {Object.entries(TYPE_LABEL).map(([type, label]) => {
                        if (label !== TYPE_LABEL.park_tier || !data.isApartmentTrailer) {
                            return (
                                <MenuItemSelect
                                    description={
                                        <>
                                            <p>{TYPE_DESCRPTION[type]}</p>
                                            <p>{TYPE_DESCRPTION.all}</p>
                                        </>
                                    }
                                    title={
                                        <div className="flex items-center">
                                            <img
                                                alt="engine"
                                                className="ml-2 w-8 h-8"
                                                src={
                                                    type === 'park_tier'
                                                        ? `https://soz.zerator.com/static/game/images/housing/garage.webp`
                                                        : `https://soz.zerator.com/static/game/images/housing/maison.webp`
                                                }
                                            />
                                            <h3 className="ml-4">{label}</h3>
                                        </div>
                                    }
                                    value={Math.min(data.currentTier[type], maxTier)}
                                    onChange={(_, value) => onChange(type, value)}
                                >
                                    {Array.from(Array(maxTier + 1).keys()).map(tier => {
                                        const label = tier !== 0 ? `Niveau ${tier + 1}` : 'Origine';
                                        return (
                                            <MenuItemSelectOption key={tier} value={tier}>
                                                {label}
                                            </MenuItemSelectOption>
                                        );
                                    })}
                                </MenuItemSelect>
                            );
                        } else {
                            return (
                                <MenuItemSelect
                                    description={
                                        <>
                                            <p>{TYPE_DESCRPTION.park_trailer}</p>
                                            <p>{TYPE_DESCRPTION.all}</p>
                                        </>
                                    }
                                    title={
                                        <div className="flex items-center">
                                            <img
                                                alt="engine"
                                                className="ml-2 w-8 h-8"
                                                src={`https://soz.zerator.com/static/game/images/housing/garage.webp`}
                                            />
                                            <h3 className="ml-4">{TYPE_LABEL.park_tier}</h3>
                                        </div>
                                    }
                                    value={data.hasParking}
                                    onChange={(_, value) => onParkingChange(value)}
                                    showAllOptions
                                    alignRight
                                >
                                    <MenuItemSelectOptionBox value={false}>Désactivé</MenuItemSelectOptionBox>
                                    <MenuItemSelectOptionBox value={true}>Activé</MenuItemSelectOptionBox>
                                </MenuItemSelect>
                            );
                        }
                    })}
                    <MenuItemButton className="border-t border-white/50" onConfirm={() => onConfirm()}>
                        <div className="flex w-full justify-between items-center">
                            <span>Confirmer</span>
                            <span>${getPrice(tierPrice + parkingPrice, TaxType.HOUSING).toFixed()}</span>
                        </div>
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

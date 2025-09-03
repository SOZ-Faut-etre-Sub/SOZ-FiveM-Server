import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '@public/nui/components/Styleguide/Menu';
import { fetchNui } from '@public/nui/fetch';
import { useDebounce } from '@public/nui/hook/debounce';
import { useGetPrice } from '@public/nui/hook/price';
import { petInShop, petShopContent, PetVariation } from '@public/shared/animal';
import { NuiEvent } from '@public/shared/event/nui';
import { MenuType } from '@public/shared/nui/menu';
import { TaxType } from '@public/shared/tax';
import { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';

export const PetShopMenu: FunctionComponent = () => {
    const getPrice = useGetPrice();
    const [currentPet, setCurrentPet] = useState(null);
    const debouncedSearch = useDebounce(currentPet, 50);

    useEffect(() => {
        if (!debouncedSearch) return;
        fetchNui(NuiEvent.PetShopShowAnimal, {
            pet: debouncedSearch,
        });
    }, [debouncedSearch]);
    const onConfirm = (pet: petInShop) => {
        fetchNui(NuiEvent.PetShopBuyAnimal, {
            pet,
        });
    };

    return (
        <Menu type={MenuType.PetShop}>
            <MainMenu>
                <MenuTitle title="Animalerie" />
                <MenuContent>
                    {Object.values(petShopContent).map(pet => (
                        <MenuItemSubMenuLink id={pet.model} key={pet.model} onSelected={() => setCurrentPet(pet)}>
                            {pet.label}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {Object.values(petShopContent).map(pet => (
                <SubMenu id={pet.model} key={pet.model}>
                    <MenuTitle title={pet.label} />
                    <MenuContent>
                        {Object.keys(PetVariation[pet.model]).map(type => (
                            <MenuItemSelect
                                key={type}
                                title={type}
                                onChange={async (_, value) => {
                                    if (!value) return;
                                    await fetchNui(NuiEvent.PetShopChangeTexture, value);
                                }}
                            >
                                {Object.entries(PetVariation[pet.model][type]).map(([color, petDrawable]) => (
                                    <MenuItemSelectOption key={color} value={petDrawable}>
                                        {color}
                                    </MenuItemSelectOption>
                                ))}
                            </MenuItemSelect>
                        ))}
                        <MenuItemButton onConfirm={() => onConfirm(pet)}>Acheter</MenuItemButton>
                        <MenuItemText> {`💸 Prix : $${getPrice(pet.price, TaxType.SUPPLY)}`}</MenuItemText>
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};

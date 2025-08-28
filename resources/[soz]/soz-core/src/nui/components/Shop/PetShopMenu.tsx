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
import { petInShop, PetShopMenuData, PetVariation } from '@public/shared/animal';
import { NuiEvent } from '@public/shared/event/nui';
import { PUBLIC_SERVICES } from '@public/shared/job';
import { MenuType } from '@public/shared/nui/menu';
import { TaxType } from '@public/shared/tax';
import { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';

type JobPetShopMenuProps = {
    data: PetShopMenuData;
};

export const PetShopMenu: FunctionComponent<JobPetShopMenuProps> = ({ data }) => {
    const getPrice = useGetPrice();
    const [currentPet, setCurrentPet] = useState(null);
    const debouncedSearch = useDebounce(currentPet, 50);

    useEffect(() => {
        if (!debouncedSearch) return;
        fetchNui(NuiEvent.PetShopShowAnimal, {
            pet: debouncedSearch,
            job: data.job,
        });
    }, [debouncedSearch]);
    const onConfirm = (pet: petInShop) => {
        fetchNui(NuiEvent.PetShopBuyAnimal, {
            pet,
            job: data.job,
        });
    };

    return (
        <Menu type={MenuType.PetShop}>
            <MainMenu>
                <MenuTitle title="Animalerie" />
                <MenuContent>
                    {data.pets.map(pet => (
                        <MenuItemSubMenuLink id={pet.model} key={pet.model} onSelected={() => setCurrentPet(pet)}>
                            {pet.label}
                        </MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {data.pets.map(pet => (
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
                        <MenuItemText>{`💸 Prix : $${getPrice(pet.price, PUBLIC_SERVICES.includes(data.job) ? null : TaxType.SERVICE)}`}</MenuItemText>
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};

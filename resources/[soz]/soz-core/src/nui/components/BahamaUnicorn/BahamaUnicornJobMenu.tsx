import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { BaunRecipe } from '../../../shared/job/baun';
import { FoodRecipe } from '../../../shared/job/food';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { CraftList } from '../Shared/CraftList';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type BahamaUnicornStateProps = {
    data: {
        recipes: BaunRecipe[];
        state: {
            displayLiquorBlip: boolean;
            displayFlavorBlip: boolean;
            displayFurnitureBlip: boolean;
            displayResellBlip: boolean;
        };
        onDuty: boolean;
    };
};

export const BahamaUnicornJobMenu: FunctionComponent<BahamaUnicornStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_baun';
    const [state, setState] = useState(null);
    const [currentRecipe, setCurrentRecipe] = useState<FoodRecipe>();

    useEffect(() => {
        if (data && data.state) {
            setState(data.state);
        }
    }, [data]);

    if (!state || !data.recipes) {
        return null;
    }

    const recipes = data.recipes;

    const displayBlip = async (key: string, value: boolean) => {
        setState({ ...state, [key]: value });
        await fetchNui(NuiEvent.BaunDisplayBlip, { blip: key, value });
    };

    if (!data.onDuty) {
        return (
            <Menu type={MenuType.BahamaUnicornJobMenu}>
                <MainMenu>
                    <MenuTitle banner={banner}></MenuTitle>
                    <MenuContent>
                        <MenuItemText>Vous n'êtes pas en service.</MenuItemText>
                    </MenuContent>
                </MainMenu>
            </Menu>
        );
    }

    return (
        <Menu type={MenuType.BahamaUnicornJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="recipe">Livre de recettes</MenuItemSubMenuLink>
                    <MenuItemCheckbox
                        checked={state.displayLiquorBlip}
                        onChange={value => displayBlip('displayLiquorBlip', value)}
                    >
                        Afficher la récolte d'alcools
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={state.displayFlavorBlip}
                        onChange={value => displayBlip('displayFlavorBlip', value)}
                    >
                        Afficher la récolte de saveurs
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={state.displayFurnitureBlip}
                        onChange={value => displayBlip('displayFurnitureBlip', value)}
                    >
                        Afficher la récolte de fournitures
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={state.displayResellBlip}
                        onChange={value => displayBlip('displayResellBlip', value)}
                    >
                        Afficher la vente des cocktails
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
            <SubMenu id="recipe">
                <MenuTitle banner={banner}>Livre de recettes</MenuTitle>
                <MenuContent>
                    <MenuItemSelect title={'Cocktail'}>
                        {recipes.map(recipe => (
                            <MenuItemSelectOption
                                key={recipe.output.label}
                                onSelected={() => {
                                    setCurrentRecipe(recipe);
                                }}
                            >
                                {recipe.output.label}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    {currentRecipe && <CraftList inputs={currentRecipe.inputs} />}
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};

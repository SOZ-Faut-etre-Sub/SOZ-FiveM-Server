import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { CraftProcess } from '../../../shared/job/ffs';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
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

export type BaunRecipe = {
    canCraft: boolean;
    label: string;
    inputs: {
        label: string;
        hasRequiredAmount: boolean;
        amount: number;
    }[];
    output: {
        label: string;
        amount: number;
    };
};

type BahamaUnicornStateProps = {
    data: {
        recipes: BaunRecipe[];
        state: {
            displayLiquorBlip: boolean;
            displayFlavorBlip: boolean;
            displayFurnitureBlip: boolean;
        };
    };
};

export const BahamaUnicornJobMenu: FunctionComponent<BahamaUnicornStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_baun';
    const [state, setState] = useState(null);
    const [currentRecipe, setCurrentRecipe] = useState<BaunRecipe>(null);

    useEffect(() => {
        if (data && data.state) {
            setState(data.state);
        }
    }, [data]);

    if (!state) {
        return null;
    }

    const recipes = data.recipes;

    const displayBlip = async (key: string, value: boolean) => {
        setState({ ...state, [key]: value });
        await fetchNui(NuiEvent.BaunDisplayBlip, { blip: key, value });
    };

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
                </MenuContent>
            </MainMenu>
            <SubMenu id="recipe">
                <MenuTitle banner={banner}>Livre de recettes</MenuTitle>
                <MenuContent>
                    <MenuItemSelect title={'Cocktail'}>
                        {recipes.map(recipe => (
                            <MenuItemSelectOption
                                onSelected={() => {
                                    setCurrentRecipe(recipe);
                                }}
                            >
                                {recipe.label}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    {currentRecipe &&
                        currentRecipe.inputs.map(input => (
                            // TODO: Use the checkbox component instead
                            // <MenuItemCheckbox checked={input.hasRequiredAmount}>
                            //     {input.amount} {input.label}
                            // </MenuItemCheckbox>
                            <MenuItemText>
                                {input.amount} {input.label}
                            </MenuItemText>
                        ))}
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};

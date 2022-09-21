import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
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

export type FoodRecipe = {
    canCraft: boolean;
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

type FoodStateProps = {
    data: {
        recipes: FoodRecipe[];
        state: {
            displayMilkBlip: boolean;
        };
        onDuty: boolean;
    };
};

export const FoodJobMenu: FunctionComponent<FoodStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_food';
    const [blips, setBlips] = useState(null);
    const [currentRecipe, setCurrentRecipe] = useState<FoodRecipe>(null);

    useEffect(() => {
        if (data && data.state) {
            setBlips(data.state);
        }
    }, [data]);

    const displayBlip = async (blip: string, value: boolean) => {
        setBlips({ ...blips, [blip]: value });
        await fetchNui(NuiEvent.FoodDisplayBlip, { blip, value });
    };

    if (!data.recipes) {
        return null;
    }

    if (!data.onDuty) {
        return (
            <Menu type={MenuType.FoodJobMenu}>
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
        <Menu type={MenuType.FoodJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="recipe">Livre de recettes</MenuItemSubMenuLink>
                    <MenuItemCheckbox
                        checked={data.state.displayMilkBlip}
                        onChange={value => displayBlip('displayMilkBlip', value)}
                    >
                        Afficher le point de collecte de lait
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
            <SubMenu id="recipe">
                <MenuTitle banner={banner}>Livre de recettes</MenuTitle>
                <MenuContent>
                    <MenuItemSelect title={'Recette'}>
                        {data.recipes.map(recipe => (
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

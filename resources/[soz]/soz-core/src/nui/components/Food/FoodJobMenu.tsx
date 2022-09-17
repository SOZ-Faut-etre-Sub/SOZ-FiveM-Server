import { FunctionComponent, useState } from 'react';

import { MenuType } from '../../../shared/nui/menu';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemText,
    MenuTitle,
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
    };
};

export const FoodJobMenu: FunctionComponent<FoodStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_food';
    const [currentRecipe, setCurrentRecipe] = useState<FoodRecipe>(null);

    if (!data.recipes) {
        return null;
    }

    return (
        <Menu type={MenuType.FoodJobMenu}>
            <MainMenu>
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
                    {currentRecipe &&
                        currentRecipe.inputs.map(input => (
                            <MenuItemText key={'ingredient_' + input.label}>
                                {input.amount} {input.label}
                            </MenuItemText>
                        ))}
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

import { FunctionComponent } from 'react';

import { NuiEvent } from '../../../shared/event';
import { CraftProcess } from '../../../shared/job/ffs';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type FfsRecipe = {
    canCraft: boolean;
    craftProcess: CraftProcess;
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

type FfsRecipeBookStateProps = {
    recipes: FfsRecipe[];
};

export const FfsRecipeBook: FunctionComponent<FfsRecipeBookStateProps> = ({ recipes }) => {
    const banner = 'https://nui-img/soz/menu_job_ffs';

    const craft = craftProcess => {
        return async () => {
            await fetchNui(NuiEvent.FfsCraft, craftProcess);
        };
    };

    return (
        <Menu type={MenuType.FfsRecipeBook}>
            <MainMenu>
                <MenuTitle banner={banner}>Livre de recettes</MenuTitle>
                <MenuContent>
                    {recipes.map((recipe, index) => (
                        <MenuItemSubMenuLink id={'process' + index}>{recipe.label}</MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {recipes.map((recipe, index) => (
                <SubMenu id={'process' + index}>
                    <MenuTitle banner={banner}>{recipe.label}</MenuTitle>
                    <MenuContent>
                        {recipe.inputs.map(input => (
                            <MenuItemCheckbox disabled={true} checked={input.hasRequiredAmount}>
                                {input.amount} {input.label}
                            </MenuItemCheckbox>
                        ))}
                        <MenuItemButton onConfirm={craft(recipe.craftProcess)} disabled={!recipe.canCraft}>
                            Confectionner {recipe.canCraft ? '' : `(Pas assez d'ingrédients)`}
                        </MenuItemButton>
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};

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

type FightForStyleStateProps = {
    data: {
        recipes: FfsRecipe[];
        state: {
            ffs_cotton_bale: boolean;
        };
    };
};

export const FightForStyleJobMenu: FunctionComponent<FightForStyleStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_ffs';
    const [blips, setBlips] = useState(null);

    useEffect(() => {
        if (data && data.state) {
            setBlips(data.state);
        }
    }, [data]);

    if (!blips) {
        return null;
    }

    const recipes = data.recipes;

    const displayBlip = async (blip: string, value: boolean) => {
        setBlips({ ...blips, [blip]: value });
        await fetchNui(NuiEvent.FfsDisplayBlip, { blip, value });
    };

    return (
        <Menu type={MenuType.FightForStyleJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="recipe">Livre de recettes</MenuItemSubMenuLink>
                    <MenuItemCheckbox
                        checked={blips['ffs_cotton_bale']}
                        onChange={value => displayBlip('ffs_cotton_bale', value)}
                    >
                        Afficher la récolte de balle de coton
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
            <SubMenu id="recipe">
                <MenuTitle banner={banner}>Livre de recettes</MenuTitle>
                <MenuContent>
                    {recipes.map((recipe, index) => (
                        <MenuItemSubMenuLink id={'process' + index}>{recipe.label}</MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </SubMenu>
            {recipes.map((recipe, index) => (
                <SubMenu id={'process' + index}>
                    <MenuTitle banner={banner}>{recipe.label}</MenuTitle>
                    <MenuContent>
                        {recipe.inputs.map(input => (
                            <MenuItemCheckbox disabled={true} checked={input.hasRequiredAmount}>
                                {input.amount} {input.label}
                            </MenuItemCheckbox>
                        ))}
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};

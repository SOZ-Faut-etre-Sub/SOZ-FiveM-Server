import { useItems } from '@public/nui/hook/data';
import { CraftCategory, CraftRecipe } from '@public/shared/craft/craft';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { CraftInputs } from '../Shared/CraftInputs';
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

type FightForStyleStateProps = {
    data: {
        recipes: Record<string, CraftCategory>;
        state: {
            ffs_cotton_bale: boolean;
        };
        onDuty: boolean;
    };
};

export const FightForStyleJobMenu: FunctionComponent<FightForStyleStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_ffs';
    const [blips, setBlips] = useState(null);
    const [currentRecipe, setCurrentRecipe] = useState<CraftRecipe>();
    const items = useItems();

    useEffect(() => {
        if (data && data.state) {
            setBlips(data.state);
        }
    }, [data]);

    const recipes = data.recipes;

    if (!blips || !recipes) {
        return null;
    }

    const displayBlip = async (blip: string, value: boolean) => {
        setBlips({ ...blips, [blip]: value });
        await fetchNui(NuiEvent.FfsDisplayBlip, { blip, value });
    };

    if (!data.onDuty) {
        return (
            <Menu type={MenuType.FightForStyleJobMenu}>
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
        <Menu type={MenuType.FightForStyleJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    {Object.keys(data.recipes).map(category => (
                        <MenuItemSubMenuLink
                            id={`recipe_${category}`}
                            key={`recipe_${category}`}
                        >{`Livre de recettes ${data.recipes[category].icon} ${category}`}</MenuItemSubMenuLink>
                    ))}
                    <MenuItemCheckbox
                        checked={blips['ffs_cotton_bale']}
                        onChange={value => displayBlip('ffs_cotton_bale', value)}
                    >
                        Afficher la récolte de balles de coton
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
            {Object.entries(data.recipes).map(([name, category]) => (
                <SubMenu id={`recipe_${name}`}>
                    <MenuTitle banner={banner}>{`Livre de recettes ${data.recipes[name].icon} ${name}`}</MenuTitle>
                    <MenuContent>
                        <MenuItemSelect title="" titleWidth={0}>
                            {Object.entries(category.recipes).map(([output, recipe]) => (
                                <MenuItemSelectOption
                                    key={output}
                                    onSelected={() => {
                                        setCurrentRecipe(recipe);
                                    }}
                                >
                                    {recipe.amount}x {items.find(elem => elem.name == output)?.label}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                        {currentRecipe && <CraftInputs inputs={currentRecipe.inputs} />}
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};

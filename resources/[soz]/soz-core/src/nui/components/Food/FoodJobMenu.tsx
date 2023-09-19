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

type FoodStateProps = {
    data: {
        recipes: Record<string, CraftCategory>;
        state: {
            displayMilkBlip: boolean;
            displayEasterEggBlip: boolean;
            easterEnabled: boolean;
        };
        onDuty: boolean;
    };
};

export const FoodJobMenu: FunctionComponent<FoodStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_food';
    const [blips, setBlips] = useState(null);
    const [currentRecipe, setCurrentRecipe] = useState<CraftRecipe>(null);
    const items = useItems();

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
                    {Object.keys(data.recipes).map(category => (
                        <MenuItemSubMenuLink
                            id={`recipe_${category}`}
                            key={`recipe_${category}`}
                        >{`Livre de recettes ${data.recipes[category].icon} ${category}`}</MenuItemSubMenuLink>
                    ))}
                    <MenuItemCheckbox
                        checked={data.state.displayMilkBlip}
                        onChange={value => displayBlip('displayMilkBlip', value)}
                    >
                        Afficher le point de collecte de lait
                    </MenuItemCheckbox>
                    {data.state.easterEnabled && (
                        <MenuItemCheckbox
                            checked={data.state.displayEasterEggBlip}
                            onChange={value => displayBlip('displayEasterEggBlip', value)}
                        >
                            Afficher le point de collecte de Pâques
                        </MenuItemCheckbox>
                    )}
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

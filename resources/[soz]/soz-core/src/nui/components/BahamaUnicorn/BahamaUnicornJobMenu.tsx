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

type BahamaUnicornStateProps = {
    data: {
        recipes: Record<string, CraftCategory>;
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
    const [currentRecipe, setCurrentRecipe] = useState<CraftRecipe>();
    const items = useItems();

    useEffect(() => {
        if (data && data.state) {
            setState(data.state);
        }
    }, [data]);

    if (!state || !data.recipes) {
        return null;
    }

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
                    {Object.keys(data.recipes).map(category => (
                        <MenuItemSubMenuLink
                            id={`recipe_${category}`}
                            key={`recipe_${category}`}
                        >{`Livre de recettes ${category}`}</MenuItemSubMenuLink>
                    ))}
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
            {Object.entries(data.recipes).map(([name, category]) => (
                <SubMenu id={`recipe_${name}`}>
                    <MenuTitle banner={banner}>{`Livre de recettes ${name}`}</MenuTitle>
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

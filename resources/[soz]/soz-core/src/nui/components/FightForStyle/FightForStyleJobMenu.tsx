import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { FfsRecipe } from '../../../shared/job/ffs';
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

type FightForStyleStateProps = {
    data: {
        recipes: FfsRecipe[];
        state: {
            ffs_cotton_bale: boolean;
        };
        onDuty: boolean;
    };
};

export const FightForStyleJobMenu: FunctionComponent<FightForStyleStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_ffs';
    const [blips, setBlips] = useState(null);
    const [inputs, setInputs] = useState(null);

    useEffect(() => {
        if (data && data.state) {
            setBlips(data.state);
        }
        if (data && data.recipes) {
            setInputs([]);
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
                    <MenuItemSelect title={'Vêtement'}>
                        {recipes.map(recipe => (
                            <MenuItemSelectOption
                                key={recipe.label}
                                onSelected={() => {
                                    setInputs([...recipe.inputs]);
                                }}
                            >
                                {recipe.label}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    <CraftList inputs={inputs} />
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};

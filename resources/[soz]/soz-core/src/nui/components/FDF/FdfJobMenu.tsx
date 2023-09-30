import { useItems } from '@public/nui/hook/data';
import { CraftCategory, CraftRecipe } from '@public/shared/craft/craft';
import { FDFFieldBlips, FDFFieldKind, FDFFieldMenu } from '@public/shared/job/fdf';
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

type FDFStateProps = {
    data: {
        recipes: Record<string, CraftCategory>;
        state: {
            [FDFFieldKind.field]: boolean;
            [FDFFieldKind.greenhouse]: boolean;
            [FDFFieldKind.apple]: boolean;
            [FDFFieldKind.orange]: boolean;
        };
        onDuty: boolean;
    };
};

export const FdfJobMenu: FunctionComponent<FDFStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_fdf';
    const [blips, setBlips] = useState(null);
    const [currentRecipe, setCurrentRecipe] = useState<CraftRecipe>();
    const items = useItems();

    useEffect(() => {
        if (data && data.state) {
            setBlips(data.state);
        }
    }, [data]);

    const displayBlip = async (type: string, value: boolean) => {
        setBlips({ ...blips, type: value });
        await fetchNui(NuiEvent.FdfDisplayBlip, { type, value });
    };

    if (!data.onDuty) {
        return (
            <Menu type={MenuType.FDFJobMenu}>
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
        <Menu type={MenuType.FDFJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    {Object.values(FDFFieldBlips).map(kind => (
                        <MenuItemCheckbox
                            key={kind}
                            checked={data.state[kind]}
                            onChange={value => displayBlip(kind, value)}
                        >
                            {FDFFieldMenu[kind]}
                        </MenuItemCheckbox>
                    ))}
                    {Object.keys(data.recipes).map(category => (
                        <MenuItemSubMenuLink
                            id={`recipe_${category}`}
                            key={`recipe_${category}`}
                        >{`Livre de recettes ${category}`}</MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {Object.entries(data.recipes).map(([name, category]) => (
                <SubMenu id={`recipe_${name}`} key={`recipe_${name}`}>
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

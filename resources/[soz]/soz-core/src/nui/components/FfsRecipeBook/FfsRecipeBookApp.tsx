import { FunctionComponent, useState } from 'react';

import { CraftProcess } from '../../../shared/job/ffs';
import { MenuType } from '../../../shared/nui/menu';
import { useNuiEvent } from '../../hook/nui';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export const FfsRecipeBook: FunctionComponent = () => {
    const [craftProcesses, setCraftProcesses] = useState<CraftProcess[] | null>(null);

    useNuiEvent('ffs_recipe_book', 'ShowFfsRecipeBook', craftProcesses => {
        console.log('Set Craft Processes: ' + craftProcesses);
        setCraftProcesses(craftProcesses);
    });

    useNuiEvent('ffs_recipe_book', 'HideFfsRecipeBook', () => {
        setCraftProcesses(null);
    });

    if (!craftProcesses) {
        console.log('craftProcesses is null');
        return null;
    }

    const banner = '';

    const craft = craftProcess => {
        return () => {
            console.log('So you want to craft a ' + craftProcess.name + ' ?');
        };
    };

    return (
        <Menu type={MenuType.FfsRecipeBook}>
            <MainMenu>
                <MenuTitle banner={banner}>Main menu</MenuTitle>
                <MenuContent>
                    {craftProcesses.map(craftProcess => (
                        <MenuItemSubMenuLink id={craftProcess.output}>{craftProcess.label}</MenuItemSubMenuLink>
                    ))}
                </MenuContent>
            </MainMenu>
            {craftProcesses.map(craftProcess => (
                <SubMenu id={craftProcess.output}>
                    <MenuTitle>{craftProcess.label}</MenuTitle>
                    <MenuContent>
                        {craftProcess.inputs.map(input => (
                            <div>
                                {input.amount}x {input.fabric}
                            </div>
                        ))}
                        <MenuItemButton onConfirm={craft(craftProcess)}>Confectionner</MenuItemButton>
                    </MenuContent>
                </SubMenu>
            ))}
        </Menu>
    );
};

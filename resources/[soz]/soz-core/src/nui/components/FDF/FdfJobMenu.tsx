import { CraftCategory } from '@public/shared/craft/craft';
import { FDFFieldBlips, FDFFieldKind, FDFFieldMenu } from '@public/shared/job/fdf';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemCheckbox, MenuItemText, MenuTitle } from '../Styleguide/Menu';

type FoodStateProps = {
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

export const FdfJobMenu: FunctionComponent<FoodStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_fdf';
    const [blips, setBlips] = useState(null);

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
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { fetchNui } from '../../fetch';
import { MainMenu, Menu, MenuContent, MenuItemCheckbox, MenuItemText, MenuTitle } from '../Styleguide/Menu';

type FightForStyleStateProps = {
    data: {
        state: {
            displaySecureContainerTake: boolean;
            displayResellJewelbagBlip: boolean;
            displayResellBigBagBlip: boolean;
            displayResellMediumBagBlip: boolean;
            displayResellSmallBagBlip: boolean;
        };
        onDuty: boolean;
    };
};

export const StonkJobMenu: FunctionComponent<FightForStyleStateProps> = ({ data }) => {
    const banner = 'https://nui-img/soz/menu_job_carrier';
    const [blips, setBlips] = useState(null);

    useEffect(() => {
        if (data && data.state) {
            setBlips(data.state);
        }
    }, [data]);

    if (!blips) {
        return null;
    }

    const displayBlip = async (blip: string, value: boolean) => {
        setBlips({ ...blips, [blip]: value });
        await fetchNui(NuiEvent.StonkDisplayBlip, { blip, value });
    };

    if (!data.onDuty) {
        return (
            <Menu type={MenuType.StonkJobMenu}>
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
        <Menu type={MenuType.StonkJobMenu}>
            <MainMenu>
                <MenuTitle banner={banner}></MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={blips['displaySecureContainerTake']}
                        onChange={value => displayBlip('displaySecureContainerTake', value)}
                    >
                        Afficher la récolte des conteneurs sécurisés
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips['displayResellJewelbagBlip']}
                        onChange={value => displayBlip('displayResellJewelbagBlip', value)}
                    >
                        Afficher la revente de sacs de bijoux
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips['displayResellBigBagBlip']}
                        onChange={value => displayBlip('displayResellBigBagBlip', value)}
                    >
                        Afficher la revente de grand sac d'argent
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips['displayResellMediumBagBlip']}
                        onChange={value => displayBlip('displayResellMediumBagBlip', value)}
                    >
                        Afficher la revente de moyen sac d'argent
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips['displayResellSmallBagBlip']}
                        onChange={value => displayBlip('displayResellSmallBagBlip', value)}
                    >
                        Afficher la revente de petit sac d'argent
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

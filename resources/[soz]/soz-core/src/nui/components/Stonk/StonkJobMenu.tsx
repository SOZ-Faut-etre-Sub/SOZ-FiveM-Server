import { usePlayer } from '@public/nui/hook/data';
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
    };
};

export const StonkJobMenu: FunctionComponent<FightForStyleStateProps> = ({ data }) => {
    const banner = 'https://cfx-nui-soz-core/public/images/banner/menu_job_cash-transfer.webp';
    const [blips, setBlips] = useState(null);
    const player = usePlayer();

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

    if (!player.job.onduty) {
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
                        Afficher "Secure Unit"
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
                        Afficher la revente de grands sacs d'argent
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips['displayResellMediumBagBlip']}
                        onChange={value => displayBlip('displayResellMediumBagBlip', value)}
                    >
                        Afficher la revente de moyens sacs d'argent
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={blips['displayResellSmallBagBlip']}
                        onChange={value => displayBlip('displayResellSmallBagBlip', value)}
                    >
                        Afficher la revente de petits sacs d'argent
                    </MenuItemCheckbox>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

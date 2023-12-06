import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event';
import { LicencesWithPoints, PoliceCanEditLicences, PoliceJobLicencesMenuData } from '@public/shared/job/police';
import { MenuType } from '@public/shared/nui/menu';
import { PlayerLicenceLabels } from '@public/shared/player';
import { FunctionComponent } from 'react';

import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type LicencesStateProps = {
    data: PoliceJobLicencesMenuData;
};

export const LicencesMenu: FunctionComponent<LicencesStateProps> = ({ data }) => {
    const banner = `https://nui-img/soz/menu_job_${data.job}`;

    return (
        <Menu type={MenuType.PoliceJobLicences}>
            <MainMenu>
                <MenuTitle banner={banner}>L'ordre et la justice !</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="removePoints">Retirer des points sur un permis</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="removePermis">Retirer complètement un permis</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="addPermis">Attribuer un permis</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <SubMenu id="removePoints">
                <MenuTitle banner={banner}>Retirer des points</MenuTitle>
                <MenuContent>
                    {Object.keys(data.playerLicences).map(licence => {
                        const value = data.playerLicences[licence];
                        const label = PlayerLicenceLabels[licence];
                        if (!PoliceCanEditLicences[licence] || PoliceCanEditLicences[licence] == false) {
                            return null;
                        }
                        if (LicencesWithPoints[licence]) {
                            if (value > 0) {
                                return (
                                    <MenuItemSelect
                                        value="0"
                                        title={label}
                                        onConfirm={async value => {
                                            await fetchNui(NuiEvent.PoliceRemovePointsLicence, {
                                                playerServerId: data.playerServerId,
                                                licence,
                                                points: value + 1,
                                            });
                                        }}
                                    >
                                        {Array(value)
                                            .fill(null)
                                            .map((_, i) => (
                                                <MenuItemSelectOption value={i + 1}>
                                                    {i + 1} Point{i + 1 > 1 ? 's' : ''}
                                                </MenuItemSelectOption>
                                            ))}
                                    </MenuItemSelect>
                                );
                            } else {
                                return (
                                    <MenuItemButton disabled>
                                        <div className="flex justify-between">
                                            <div>{label}</div>
                                            <div>NON POSSÉDÉ</div>
                                        </div>
                                    </MenuItemButton>
                                );
                            }
                        } else {
                            return null;
                        }
                    })}
                </MenuContent>
            </SubMenu>
            <SubMenu id="removePermis">
                <MenuTitle banner={banner}>Retirer complètement un permis</MenuTitle>
                <MenuContent>
                    {Object.keys(data.playerLicences).map(licence => {
                        const value = data.playerLicences[licence];
                        const label = PlayerLicenceLabels[licence];
                        if (!PoliceCanEditLicences[licence] || PoliceCanEditLicences[licence] == false) {
                            return null;
                        }
                        if (!LicencesWithPoints[licence]) {
                            if (value == true) {
                                return (
                                    <MenuItemButton
                                        onConfirm={async () => {
                                            await fetchNui(NuiEvent.PoliceRemoveLicence, {
                                                playerServerId: data.playerServerId,
                                                licence,
                                            });
                                        }}
                                    >
                                        {label}
                                    </MenuItemButton>
                                );
                            } else {
                                return (
                                    <MenuItemButton disabled>
                                        <div className="flex justify-between">
                                            <div>{label}</div>
                                            <div>NON POSSÉDÉ</div>
                                        </div>
                                    </MenuItemButton>
                                );
                            }
                        } else {
                            return null;
                        }
                    })}
                </MenuContent>
            </SubMenu>
            <SubMenu id="addPermis">
                <MenuTitle banner={banner}>Attribuer un permis</MenuTitle>
                <MenuContent>
                    {Object.keys(data.playerLicences).map(licence => {
                        const value = data.playerLicences[licence];
                        const label = PlayerLicenceLabels[licence];
                        if (!PoliceCanEditLicences[licence] || PoliceCanEditLicences[licence] == false) {
                            return null;
                        }
                        if (!LicencesWithPoints[licence]) {
                            if (value == false) {
                                return (
                                    <MenuItemButton
                                        onConfirm={async () => {
                                            await fetchNui(NuiEvent.PoliceAddLicence, {
                                                playerServerId: data.playerServerId,
                                                licence,
                                            });
                                        }}
                                    >
                                        {label}
                                    </MenuItemButton>
                                );
                            } else {
                                return (
                                    <MenuItemButton disabled>
                                        <div className="flex justify-between">
                                            <div>{label}</div>
                                            <div>DÉJÀ POSSÉDÉ</div>
                                        </div>
                                    </MenuItemButton>
                                );
                            }
                        } else {
                            return null;
                        }
                    })}
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};

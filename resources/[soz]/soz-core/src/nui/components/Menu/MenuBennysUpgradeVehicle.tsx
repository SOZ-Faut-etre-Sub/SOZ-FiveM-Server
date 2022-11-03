import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { MenuType } from '../../../shared/nui/menu';
import { BennysUpgradeVehicleMenuData, VehicleConfiguration } from '../../../shared/vehicle/modification';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuBennysUpgradeVehicleProps = {
    data?: BennysUpgradeVehicleMenuData;
};

export const MenuBennysUpgradeVehicle: FunctionComponent<MenuBennysUpgradeVehicleProps> = ({ data }) => {
    const [configuration, setConfiguration] = useState<VehicleConfiguration | null>(null);

    useEffect(() => {
        if (data?.currentConfiguration) {
            setConfiguration(data.currentConfiguration);
        }
    }, [data]);

    useEffect(() => {
        if (configuration && data) {
            fetchNui(NuiEvent.VehicleCustomApply, {
                vehicleEntityId: data.vehicle,
                vehicleConfiguration: configuration,
            });
        }
    }, [configuration]);

    if (!data) {
        return null;
    }

    const onConfirm = () => {
        fetchNui(NuiEvent.VehicleCustomConfirmModification, {
            vehicleEntityId: data.vehicle,
            vehicleConfiguration: configuration,
        });
    };

    return (
        <Menu type={MenuType.BennysUpgradeVehicle}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Station entretien</MenuTitle>
                <MenuContent>
                    <MenuItemButton onConfirm={() => onConfirm()}>Confirmer les changements</MenuItemButton>
                    <MenuItemSubMenuLink id="body">Carrosserie</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="interior">Intérieur</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="neon_xenon">Neon & Xénon</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="wheel">Roues</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <SubMenu id="body">
                <MenuItemSelect title="Aileron"></MenuItemSelect>
                <MenuItemSelect title="Sticker de base"></MenuItemSelect>
                <MenuItemSelect title="Type de peinture"></MenuItemSelect>
                <MenuItemSelect title="Couleur principale"></MenuItemSelect>
                <MenuItemSelect title="Couleur secondaire"></MenuItemSelect>
                <MenuItemSelect title="Couleur immatriculation"></MenuItemSelect>
                <MenuItemSelect title="Couleur nacré"></MenuItemSelect>
                <MenuItemSelect title="Teinture fénètre">
                    <MenuItemSelectOption value="0">Aucune</MenuItemSelectOption>
                    <MenuItemSelectOption value="1">Noir puree</MenuItemSelectOption>
                    <MenuItemSelectOption value="2">Fumé foncé</MenuItemSelectOption>
                    <MenuItemSelectOption value="3">Fumé léger</MenuItemSelectOption>
                </MenuItemSelect>
            </SubMenu>
            <SubMenu id="interior">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Aspect & couleurs</MenuTitle>
                <MenuContent>
                    <MenuItemSelect title="Couleur tableau de bord"></MenuItemSelect>
                    <MenuItemSelect title="Couleur intérieure"></MenuItemSelect>
                </MenuContent>
            </SubMenu>
            <SubMenu id="neon_xenon">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Néon & Xénon</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox>Installer néon</MenuItemCheckbox>
                    <MenuItemSelect title="Couleur du néon"></MenuItemSelect>
                    <MenuItemCheckbox>Installer xénon</MenuItemCheckbox>
                </MenuContent>
            </SubMenu>
            <SubMenu id="wheel">
                <MenuTitle banner="https://nui-img/soz/menu_job_bennys">Autour de la roue</MenuTitle>
                <MenuContent>
                    <MenuItemSelect title="Type de roue"></MenuItemSelect>
                    <MenuItemSelect title="Type 2 de roue"></MenuItemSelect>
                    <MenuItemSelect title="Fumée de roue"></MenuItemSelect>
                    <MenuItemSelect title="Couleur des roues"></MenuItemSelect>
                </MenuContent>
            </SubMenu>
        </Menu>
    );
};

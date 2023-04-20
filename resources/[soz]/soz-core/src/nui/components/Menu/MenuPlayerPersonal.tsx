import { JSXElement } from '@swc/core';
import { Fragment, FunctionComponent, ReactElement } from 'react';

import { Animations } from '../../../config/animation';
import { AnimationConfigItem } from '../../../shared/animation';
import { NuiEvent } from '../../../shared/event';
import { CardType } from '../../../shared/nui/card';
import { MenuType } from '../../../shared/nui/menu';
import { PlayerPersonalMenuData } from '../../../shared/nui/player';
import { PlayerData } from '../../../shared/player';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
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

type MenuPlayerPersonalProps = {
    data: PlayerPersonalMenuData;
};

export const MenuPlayerPersonal: FunctionComponent<MenuPlayerPersonalProps> = ({ data }) => {
    const player = usePlayer();

    if (!player) {
        return null;
    }

    return (
        <Menu type={MenuType.PlayerPersonal}>
            <MainMenu>
                <MenuTitle banner="https://nui-img/soz/menu_personal">
                    {player.charinfo.firstname} {player.charinfo.lastname}
                </MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="identity" description="Voir/Montrer vos papiers d'identité">
                        Mon identité
                    </MenuItemSubMenuLink>
                    <MenuItemButton>Gestion des clés</MenuItemButton>
                    <MenuItemSubMenuLink id="clothing">Gestion de la tenue</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="animations">Animations</MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>
            <MenuIdentity />
            <SubMenu id="clothing">
                <MenuTitle banner="https://nui-img/soz/menu_personal">Gestion de la tenue</MenuTitle>
            </SubMenu>
            <SubMenu id="invoices"></SubMenu>
            <MenuAnimation />
            <SubMenu id="hud"></SubMenu>
            <SubMenu id="job"></SubMenu>
            <SubMenu id="voip"></SubMenu>
        </Menu>
    );
};

export const MenuIdentity: FunctionComponent = () => {
    const showOrSeeCard = (type: CardType) => {
        return (index, value) => {
            if (value === 'see') {
                fetchNui(NuiEvent.PlayerMenuCardSee, { type });
            } else {
                fetchNui(NuiEvent.PlayerMenuCardShow, { type });
            }
        };
    };

    return (
        <SubMenu id="identity">
            <MenuTitle banner="https://nui-img/soz/menu_personal">Gestion de l'identité</MenuTitle>
            <MenuContent>
                <MenuItemSelect title="Carte d'identité" onConfirm={showOrSeeCard('identity')}>
                    <MenuItemSelectOption value="see">Voir</MenuItemSelectOption>
                    <MenuItemSelectOption value="show">Montrer</MenuItemSelectOption>
                </MenuItemSelect>
                <MenuItemSelect title="Vos licences" onConfirm={showOrSeeCard('license')}>
                    <MenuItemSelectOption value="see">Voir</MenuItemSelectOption>
                    <MenuItemSelectOption value="show">Montrer</MenuItemSelectOption>
                </MenuItemSelect>
                <MenuItemSelect title="Carte de santé" onConfirm={showOrSeeCard('health')}>
                    <MenuItemSelectOption value="see">Voir</MenuItemSelectOption>
                    <MenuItemSelectOption value="show">Montrer</MenuItemSelectOption>
                </MenuItemSelect>
            </MenuContent>
        </SubMenu>
    );
};

const MenuAnimation: FunctionComponent = () => {
    const elements = [];
    const subMenus = [];
    const playAnimation = (animationItem: AnimationConfigItem) => {
        fetchNui(NuiEvent.PlayerMenuAnimationPlay, { animationItem });
    };

    for (const item of Animations) {
        const [element, newSubMenus] = createAnimationItemMenu(item, 'animation', playAnimation);

        elements.push(element);
        subMenus.push(...newSubMenus);
    }

    return (
        <>
            <SubMenu id="animations">
                <MenuTitle banner="https://nui-img/soz/menu_personal">Gestion des animations</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.PlayerMenuAnimationStop);
                        }}
                    >
                        🛑 Stopper l'animation
                    </MenuItemButton>
                    {elements.map((element, index) => {
                        return <Fragment key={index}>{element}</Fragment>;
                    })}
                </MenuContent>
            </SubMenu>
            {subMenus.map((element, index) => {
                return <Fragment key={index}>{element}</Fragment>;
            })}
        </>
    );
};

const createAnimationItemMenu = (
    item: AnimationConfigItem,
    prefix: string,
    playAnimation: (item: AnimationConfigItem) => void
): [ReactElement, ReactElement[]] => {
    if (item.type === 'animation' || item.type === 'scenario' || item.type === 'event') {
        return [
            <MenuItemButton onConfirm={() => playAnimation(item)}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        {item.icon && <div className="mr-2">{item.icon}</div>}
                        <div>{item.name}</div>
                    </div>
                    <div>{item.rightLabel}</div>
                </div>
            </MenuItemButton>,
            [],
        ];
    }

    if (item.type === 'category') {
        const elements = [];
        const subMenus = [];

        for (const subItem of item.items) {
            const [element, newSubMenus] = createAnimationItemMenu(subItem, `${prefix}_${item.name}`, playAnimation);

            elements.push(element);
            subMenus.push(...newSubMenus);
        }

        subMenus.push(
            <SubMenu id={`${prefix}${item.name}`}>
                <MenuTitle banner="https://nui-img/soz/menu_personal">Gestion des animations</MenuTitle>
                <MenuContent>
                    {elements.map((element, index) => {
                        return <Fragment key={index}>{element}</Fragment>;
                    })}
                </MenuContent>
            </SubMenu>
        );

        return [<MenuItemSubMenuLink id={`${prefix}${item.name}`}>{item.name}</MenuItemSubMenuLink>, subMenus];
    }

    return [null, []];
};

import { JSXElement } from '@swc/core';
import { Fragment, FunctionComponent, ReactElement } from 'react';

import { Animations } from '../../../config/animation';
import { AnimationConfigItem } from '../../../shared/animation';
import { Invoice } from '../../../shared/bank';
import { ClothConfig } from '../../../shared/cloth';
import { NuiEvent } from '../../../shared/event';
import { CardType } from '../../../shared/nui/card';
import { MenuType } from '../../../shared/nui/menu';
import { PlayerPersonalMenuData } from '../../../shared/nui/player';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
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

type MenuPlayerPersonalProps = {
    data: PlayerPersonalMenuData;
};

export const MenuPlayerPersonal: FunctionComponent<MenuPlayerPersonalProps> = ({ data }) => {
    const player = usePlayer();

    if (!player) {
        return null;
    }

    const openKeys = () => {
        fetchNui(NuiEvent.PlayerMenuOpenKeys);
    };

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
                    <MenuItemButton onConfirm={openKeys}>Gestion des clés</MenuItemButton>
                    <MenuItemSubMenuLink id="clothing">Gestion de la tenue</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="invoices">Gestion des factures</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="animations">Animations</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="hud">HUD</MenuItemSubMenuLink>
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.PlayerMenuVoipReset)}>
                        Redémarrer la voip
                    </MenuItemButton>
                </MenuContent>
            </MainMenu>
            <MenuIdentity />
            <MenuClothing />
            <MenuInvoice invoices={data.invoices} />
            <MenuAnimation />
            <SubMenu id="hud">
                <MenuTitle banner="https://nui-img/soz/menu_personal">HUD</MenuTitle>
                <MenuContent>
                    <MenuItemCheckbox
                        checked={data.isHudVisible}
                        description="Active/Désactive le HUD"
                        onChange={value => fetchNui(NuiEvent.PlayerMenuHudSetGlobal, { value })}
                    >
                        HUD: Global
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.isCinematicMode}
                        description="Active/Désactive les barres noires"
                        onChange={value => fetchNui(NuiEvent.PlayerMenuHudSetCinematicMode, { value })}
                    >
                        HUD: Cinématique
                    </MenuItemCheckbox>
                    <MenuItemCheckbox
                        checked={data.isCinematicCameraActive}
                        description="Active/Désactive la caméra cinématique"
                        onChange={value => fetchNui(NuiEvent.PlayerMenuHudSetCinematicCameraActive, { value })}
                    >
                        Caméra: Cinématique
                    </MenuItemCheckbox>
                </MenuContent>
            </SubMenu>
            <SubMenu id="job"></SubMenu>
            <SubMenu id="voip"></SubMenu>
        </Menu>
    );
};

const MenuIdentity: FunctionComponent = () => {
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

const MenuClothing: FunctionComponent = () => {
    const player = usePlayer();

    const createUpdateClothConfig = (key: keyof ClothConfig['Config'], inverted = false) => {
        return value => {
            if (!inverted) {
                value = !value;
            }

            fetchNui(NuiEvent.PlayerMenuClothConfigUpdate, { key, value });
        };
    };

    return (
        <SubMenu id="clothing">
            <MenuTitle banner="https://nui-img/soz/menu_personal">Gestion de la tenue</MenuTitle>
            <MenuContent>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('ShowHelmet', true)}
                    checked={player.cloth_config.Config['ShowHelmet']}
                >
                    Casque
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideHead')}
                    checked={!player.cloth_config.Config['HideHead']}
                >
                    Chapeau
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideMask')}
                    checked={!player.cloth_config.Config['HideMask']}
                >
                    Masque
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideGlasses')}
                    checked={!player.cloth_config.Config['HideGlasses']}
                >
                    Lunettes
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideEar')}
                    checked={!player.cloth_config.Config['HideEar']}
                >
                    Boucles
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideChain')}
                    checked={!player.cloth_config.Config['HideChain']}
                >
                    Collier
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideBulletproof')}
                    checked={!player.cloth_config.Config['HideBulletproof']}
                >
                    Gilet
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideTop')}
                    checked={!player.cloth_config.Config['HideTop']}
                >
                    Haut
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideLeftHand')}
                    checked={!player.cloth_config.Config['HideLeftHand']}
                >
                    Montre
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideRightHand')}
                    checked={!player.cloth_config.Config['HideRightHand']}
                >
                    Bracelet
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideBag')}
                    checked={!player.cloth_config.Config['HideBag']}
                >
                    Sac
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HidePants')}
                    checked={!player.cloth_config.Config['HidePants']}
                >
                    Pantalon
                </MenuItemCheckbox>
                <MenuItemCheckbox
                    onChange={createUpdateClothConfig('HideShoes')}
                    checked={!player.cloth_config.Config['HideShoes']}
                >
                    Chaussures
                </MenuItemCheckbox>
            </MenuContent>
        </SubMenu>
    );
};

type MenuInvoiceProps = {
    invoices: Invoice[];
};

const MenuInvoice: FunctionComponent<MenuInvoiceProps> = ({ invoices }) => {
    return (
        <SubMenu id="invoices">
            <MenuTitle banner="https://nui-img/soz/menu_personal">Gestion des factures</MenuTitle>
            <MenuContent>
                {invoices.map((invoice, i) => (
                    <MenuItemSelect
                        title={invoice.label}
                        key={i}
                        onConfirm={(i, value) => {
                            if (value === 'pay') {
                                fetchNui(NuiEvent.PlayerMenuInvoicePay, { invoiceId: invoice.id });
                            } else {
                                fetchNui(NuiEvent.PlayerMenuInvoiceDeny, { invoiceId: invoice.id });
                            }
                        }}
                    >
                        <MenuItemSelectOption value="pay">Payer</MenuItemSelectOption>
                        <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                    </MenuItemSelect>
                ))}
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

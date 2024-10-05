import _ from 'lodash';
import { Fragment, FunctionComponent, JSXElementConstructor, ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Animations, Moods, Walks } from '../../../config/animation';
import { AnimationConfigItem, AnimationConfigList, WalkConfigItem } from '../../../shared/animation';
import { ClothConfig } from '../../../shared/cloth';
import { NuiEvent } from '../../../shared/event';
import { JobPermission } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { JobMenuData, PlayerPersonalMenuData, Shortcut } from '../../../shared/nui/player';
import { fetchNui } from '../../fetch';
import { usePlayer } from '../../hook/data';
import { useJobGrades } from '../../hook/job';
import { useNuiEvent } from '../../hook/nui';
import { RootState } from '../../store';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemStringInput,
    MenuItemSubMenuLink,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

type MenuPlayerPersonalProps = {
    data: PlayerPersonalMenuData;
};

export const MenuPlayerPersonal: FunctionComponent<MenuPlayerPersonalProps> = ({ data }) => {
    const player = usePlayer();
    const isHalloween = useSelector((state: RootState) => state.features.Halloween);

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
                    {data.deguisement && (
                        <MenuItemButton onConfirm={() => fetchNui(NuiEvent.PlayerMenuRemoveDeguisement)}>
                            Enlever le déguisement
                        </MenuItemButton>
                    )}
                    {data.naked && (
                        <MenuItemButton onConfirm={() => fetchNui(NuiEvent.PlayerMenuReDress)}>
                            Se rhabiller
                        </MenuItemButton>
                    )}
                    {!data.naked && !data.deguisement && (
                        <MenuItemSubMenuLink id="clothing">Gestion de la tenue</MenuItemSubMenuLink>
                    )}

                    <MenuItemSubMenuLink id="animations">Animations</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="hud">HUD</MenuItemSubMenuLink>
                    {data.job.enabled && <MenuItemSubMenuLink id="job">Gestion de votre métier</MenuItemSubMenuLink>}
                    <MenuItemButton onConfirm={() => fetchNui(NuiEvent.PlayerMenuVoipReset)}>
                        Redémarrer la voip
                    </MenuItemButton>
                    {isHalloween && (
                        <MenuItemCheckbox
                            checked={data.arachnophobe}
                            onChange={value => fetchNui(NuiEvent.PlayerMenuHudSetArachnophobe, value)}
                        >
                            Mode arachnophobe
                        </MenuItemCheckbox>
                    )}
                </MenuContent>
            </MainMenu>
            <MenuClothing />
            <MenuAnimation shortcuts={data.shortcuts} />
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
                    <MenuItemCheckbox
                        checked={data.scaledNui}
                        description="Active/Désactive le scaling NUI"
                        onChange={value => fetchNui(NuiEvent.PlayerMenuHudSetScaledNui, { value })}
                    >
                        Scaling NUI
                    </MenuItemCheckbox>
                </MenuContent>
            </SubMenu>
            <MenuJob data={data.job} />
        </Menu>
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
                    onChange={createUpdateClothConfig('HideGloves')}
                    checked={!player.cloth_config.Config['HideGloves']}
                >
                    Gants
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

type MenuAnimationProps = {
    shortcuts: Record<string, Shortcut>;
};

const MenuAnimation: FunctionComponent<MenuAnimationProps> = ({ shortcuts: intialShortcuts }) => {
    const [shortcuts, setShortcuts] = useState(intialShortcuts);

    useNuiEvent('player', 'UpdateAnimationShortcuts', shortcuts => {
        setShortcuts(shortcuts);
    });

    return (
        <>
            <SubMenu id="animations">
                <MenuTitle banner="https://nui-img/soz/menu_personal">Gestion des animations</MenuTitle>
                <MenuContent>
                    <MenuItemSubMenuLink id="animation_list">Animations</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="walk_list">Démarches</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="mood_list">Humeurs</MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id="favorite_list">Mes animations</MenuItemSubMenuLink>
                </MenuContent>
            </SubMenu>
            <SubMenu id="mood_list">
                <MenuTitle banner="https://nui-img/soz/menu_personal">Humeurs</MenuTitle>
                <MenuContent>
                    {Moods.map((mood, i) => (
                        <MenuItemButton
                            onConfirm={() => {
                                fetchNui(NuiEvent.PlayerMenuAnimationSetMood, { moodItem: mood });
                            }}
                            key={i}
                        >
                            {mood.name}
                        </MenuItemButton>
                    ))}
                </MenuContent>
            </SubMenu>
            <SubMenu id="favorite_list">
                <MenuTitle banner="https://nui-img/soz/menu_personal">Mes raccourcis d'animations</MenuTitle>
                <MenuContent>
                    {Object.keys(shortcuts).map(key => {
                        const shortcut = shortcuts[key];

                        if (!shortcut.animation) {
                            return <MenuItemButton key={key}>{shortcut.name}</MenuItemButton>;
                        }

                        return (
                            <MenuItemSelect
                                title={shortcut.name}
                                onConfirm={(i, value) => {
                                    if (value === 'delete') {
                                        fetchNui(NuiEvent.PlayerMenuAnimationFavoriteDelete, { key });
                                    }
                                }}
                                key={key}
                            >
                                <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            </MenuItemSelect>
                        );
                    })}
                </MenuContent>
            </SubMenu>
            <MenuWalkList />
            <MenuAnimationList />
        </>
    );
};

const MenuAnimationList: FunctionComponent = () => {
    const [menuConstructor, setMenuConstructor] = useState<{
        elements: ReactElement<any, string | JSXElementConstructor<any>>[];
        subMenus: ReactElement<any, string | JSXElementConstructor<any>>[];
    }>({
        elements: [],
        subMenus: [],
    });
    const [animations, setAnimations] = useState<AnimationConfigList>([]);
    const [textFilter, setTextFilter] = useState<string>();

    const handleFilter = (value: string) => {
        setTextFilter(value);
    };

    const recursiveFilter = (items: AnimationConfigList, level = 0): AnimationConfigItem[] => {
        const newItems = [];
        for (const item of items) {
            if (['animation', 'event', 'scenario'].includes(item.type)) {
                if (
                    !textFilter ||
                    item.name
                        .toLocaleLowerCase()
                        .normalize('NFD')
                        .replace(/\p{Diacritic}/gu, '')
                        .includes(textFilter.normalize('NFD').replace(/\p{Diacritic}/gu, ''))
                ) {
                    newItems.push(item);
                }
            }

            if (item.type === 'category') {
                if (
                    level === 0 ||
                    !textFilter ||
                    !item.name
                        .toLocaleLowerCase()
                        .normalize('NFD')
                        .replace(/\p{Diacritic}/gu, '')
                        .includes(textFilter.normalize('NFD').replace(/\p{Diacritic}/gu, ''))
                ) {
                    item.items = recursiveFilter(item.items, level + 1);
                }

                if (item.items.length) {
                    newItems.push(item);
                }
            }
        }

        return newItems;
    };

    useEffect(() => {
        const newAnimations = recursiveFilter(_.cloneDeep(Animations));

        setAnimations(newAnimations);
    }, [textFilter]);

    useEffect(() => {
        const elementList = [];
        const subMenuList = [];

        for (const item of animations) {
            const [element, newSubMenus] = createAnimationItemMenu(item, 'animation');

            elementList.push(element);
            subMenuList.push(...newSubMenus);
        }
        setMenuConstructor({
            elements: elementList,
            subMenus: subMenuList,
        });
    }, [animations, setAnimations]);

    return (
        <>
            <SubMenu id="animation_list">
                <MenuTitle banner="https://nui-img/soz/menu_personal">Liste des animations</MenuTitle>
                <MenuContent>
                    <MenuItemStringInput onChange={handleFilter} value={textFilter}>
                        Filtre:
                    </MenuItemStringInput>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.PlayerMenuAnimationStop);
                        }}
                    >
                        🛑 Stopper l'animation
                    </MenuItemButton>
                    {menuConstructor.elements.map((element, index) => {
                        return <Fragment key={index}>{element}</Fragment>;
                    })}
                </MenuContent>
            </SubMenu>
            {menuConstructor.subMenus.map((element, index) => {
                return <Fragment key={index}>{element}</Fragment>;
            })}
        </>
    );
};

const MenuWalkList: FunctionComponent = () => {
    const elements = [];
    const subMenus = [];

    for (const item of Walks) {
        const [element, newSubMenus] = createWalkItemMenu(item, 'walk');

        elements.push(element);
        subMenus.push(...newSubMenus);
    }

    return (
        <>
            <SubMenu id="walk_list">
                <MenuTitle banner="https://nui-img/soz/menu_personal">Liste des démarches</MenuTitle>
                <MenuContent>
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

type ItemCategory<T> = {
    type: string;
    name: string;
    items?: T[];
};

const createRecursiveSubMenu = <T extends ItemCategory<T>>(
    item: T,
    prefix: string,
    createLeafItem: (item: T) => ReactElement
): [ReactElement, ReactElement[]] => {
    if (item.type !== 'category') {
        return [createLeafItem(item), []];
    }

    if (item.type === 'category') {
        const elements = [];
        const subMenus = [];

        for (const subItem of item.items) {
            const [element, newSubMenus] = createRecursiveSubMenu(subItem, `${prefix}_${item.name}`, createLeafItem);

            elements.push(element);
            subMenus.push(...newSubMenus);
        }

        subMenus.push(
            <SubMenu id={`${prefix}${item.name}`}>
                <MenuTitle banner="https://nui-img/soz/menu_personal">{item.name}</MenuTitle>
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

const createAnimationLeafItem = (item: AnimationConfigItem): ReactElement => {
    if (item.type === 'category') {
        return null;
    }

    return (
        <MenuItemSelect
            onConfirm={(i, value) => {
                if (value === 'play') {
                    fetchNui(NuiEvent.PlayerMenuAnimationPlay, { animationItem: item });
                } else if (value === 'favorite') {
                    fetchNui(NuiEvent.PlayerMenuAnimationFavorite, {
                        animationItem: item,
                    });
                }
            }}
            title={
                <div className="flex items-center">
                    {item.icon && <div className="mr-2">{item.icon}</div>}
                    <div>{item.name}</div>
                </div>
            }
            titleWidth={60}
        >
            <MenuItemSelectOption value="play">Jouer</MenuItemSelectOption>
            <MenuItemSelectOption value="favorite">Raccourci</MenuItemSelectOption>
        </MenuItemSelect>
    );
};

const createAnimationItemMenu = (item: AnimationConfigItem, prefix: string): [ReactElement, ReactElement[]] => {
    return createRecursiveSubMenu(item, prefix, createAnimationLeafItem);
};

const createWalkLeafItem = (item: WalkConfigItem): ReactElement => {
    if (item.type === 'category') {
        return null;
    }

    return (
        <MenuItemSelect
            onConfirm={(i, value) => {
                if (value === 'play') {
                    fetchNui(NuiEvent.PlayerMenuAnimationSetWalk, { walkItem: item });
                } else if (value === 'favorite') {
                    fetchNui(NuiEvent.PlayerMenuAnimationFavorite, {
                        animationItem: item,
                    });
                }
            }}
            title={
                <div className="flex items-center">
                    {item.icon && <div className="mr-2">{item.icon}</div>}
                    <div>{item.name}</div>
                </div>
            }
            titleWidth={60}
        >
            <MenuItemSelectOption value="play">Jouer</MenuItemSelectOption>
            <MenuItemSelectOption value="favorite">Raccourci</MenuItemSelectOption>
        </MenuItemSelect>
    );
};

const createWalkItemMenu = (item: WalkConfigItem, prefix: string): [ReactElement, ReactElement[]] => {
    return createRecursiveSubMenu(item, prefix, createWalkLeafItem);
};

type MenuJobProps = {
    data: JobMenuData;
};

const MenuJob: FunctionComponent<MenuJobProps> = ({ data }) => {
    const grades = useJobGrades();

    if (!data.enabled) {
        return null;
    }

    const jobGrades = grades.filter(grade => grade.jobId === data.job.id);

    return (
        <>
            <SubMenu id="job">
                <MenuTitle banner="https://nui-img/soz/menu_personal">Gestion du métier {data.job.label}</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.PlayerMenuJobGradeCreate, {
                                job: data.job.id,
                            });
                        }}
                    >
                        Ajouter un grade
                    </MenuItemButton>

                    {jobGrades.map((grade, i) => {
                        return (
                            <MenuItemSubMenuLink key={i} id={`job_grade_${grade.id}`}>
                                {!!grade.owner && '⭐'} {grade.name} {!!grade.is_default && '(par défaut)'}
                            </MenuItemSubMenuLink>
                        );
                    })}
                </MenuContent>
            </SubMenu>
            {jobGrades
                .sort((a, b) => {
                    return b.weight - a.weight;
                })
                .map(grade => {
                    return (
                        <SubMenu id={`job_grade_${grade.id}`} key={`job_grade_${grade.id}`}>
                            <MenuTitle banner="https://nui-img/soz/menu_personal">
                                Gestion du grade {grade.name}
                            </MenuTitle>
                            <MenuContent>
                                <MenuItemButton
                                    onConfirm={() => {
                                        fetchNui(NuiEvent.PlayerMenuJobGradeUpdateWeight, {
                                            gradeId: grade.id,
                                        });
                                    }}
                                >
                                    Changer l'importance ({grade.weight})
                                </MenuItemButton>
                                <MenuItemButton
                                    onConfirm={() => {
                                        fetchNui(NuiEvent.PlayerMenuJobGradeUpdateSalary, {
                                            gradeId: grade.id,
                                        });
                                    }}
                                >
                                    💵 Changer le salaire ({grade.salary}$)
                                </MenuItemButton>
                                {!grade.is_default && (
                                    <MenuItemButton
                                        onConfirm={() => {
                                            fetchNui(NuiEvent.PlayerMenuJobGradeSetDefault, {
                                                gradeId: grade.id,
                                            });
                                        }}
                                    >
                                        Définir comme grade par défaut
                                    </MenuItemButton>
                                )}
                                <MenuItemButton
                                    onConfirm={() => {
                                        fetchNui(NuiEvent.PlayerMenuJobGradeUpdateName, {
                                            gradeId: grade.id,
                                        });
                                    }}
                                >
                                    ✎ Renommer le grade
                                </MenuItemButton>
                                <MenuItemButton
                                    onConfirm={() => {
                                        fetchNui(NuiEvent.PlayerMenuJobGradeDelete, {
                                            grade,
                                        });
                                    }}
                                >
                                    ❌ Supprimer le grade
                                </MenuItemButton>
                                {Object.keys(data.job.permissions).map(permission => {
                                    const permissionValue = data.job.permissions[permission];
                                    const checked = grade.permissions
                                        ? grade.permissions.includes(permission as JobPermission)
                                        : false;

                                    return (
                                        <MenuItemCheckbox
                                            onChange={value => {
                                                fetchNui(NuiEvent.PlayerMenuJobGradePermissionUpdate, {
                                                    gradeId: grade.id,
                                                    permission,
                                                    value,
                                                });
                                            }}
                                            key={permission}
                                            checked={checked}
                                        >
                                            {permissionValue.label}
                                        </MenuItemCheckbox>
                                    );
                                })}
                            </MenuContent>
                        </SubMenu>
                    );
                })}
        </>
    );
};

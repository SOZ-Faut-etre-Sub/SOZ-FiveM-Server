import {
    MainMenu,
    MenuContent,
    MenuItemButton,
    MenuItemNumberInput,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemSelectOptionBox,
    MenuItemStringInput,
    MenuItemSubMenuLink,
    MenuItemText,
    MenuTitle,
    SubMenu,
} from '@public/nui/components/Styleguide/Menu';
import { MenuGizmo } from '@public/nui/components/Styleguide/SubMenuGizmo';
import { fetchNui } from '@public/nui/fetch';
import { usePlayer } from '@public/nui/hook/data';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { HousingProp, HousingPropPlacementMenuData, PlacementHousingPropList } from '@public/shared/nui/prop_placement';
import { HousingDebugProp } from '@public/shared/object';
import { ZkeaFourniture } from '@public/shared/shop/zkea_fourniture';
import { FunctionComponent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type MenuPropPlacementProps = {
    data: HousingPropPlacementMenuData;
};

export const MenuPropPlacementHousing: FunctionComponent<MenuPropPlacementProps> = ({ data }) => {
    const banner = 'https://cfx-nui-soz-core/public/images/banner/menu_housing.webp';
    const player = usePlayer();
    const navigate = useNavigate();
    const location = useLocation();

    const [placed, setPlaced] = useState<PlacementHousingPropList>({});
    const [notPlaced, setNotPlaced] = useState<PlacementHousingPropList>({});
    const [placedFiltered, setPlacedFiltered] = useState<PlacementHousingPropList>({});
    const [notPlacedFiltered, setNotPlacedFiltered] = useState<PlacementHousingPropList>({});
    const [textFilter, setTextFilter] = useState<string>();
    const [counter, setCounter] = useState(0);
    const [childTextFocus, setChildTextFocus] = useState(false);

    const [maxFourntiure, setMaxFourntiure] = useState<number>(data.max);
    const [shell, setShell] = useState<number>(+data.shellEnable);
    const [housingProps, setHousingProps] = useState<HousingProp[]>(data.fournitures);

    const [debugProp, setDebugProp] = useState<HousingDebugProp>();
    const [position, setPosition] = useState<{
        x: number;
        y: number;
        z: number;
        rotX: number;
        rotY: number;
        rotZ: number;
    }>({ x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 });

    useNuiEvent('housing_placement_prop', 'SetFourniture', async ({ fournitures, max, shellEnable }) => {
        setHousingProps(fournitures);
        setMaxFourntiure(max);
        setShell(+shellEnable);
    });

    const handleFilter = (value: string) => {
        setTextFilter(value);
    };

    useEffect(() => {}, [maxFourntiure, placedFiltered, notPlacedFiltered]);

    useEffect(() => {
        const fourniturePropList: PlacementHousingPropList = {};
        for (const fourniture of housingProps) {
            fourniturePropList[ZkeaFourniture[fourniture.model].type] ??= [];
            fourniturePropList[ZkeaFourniture[fourniture.model].type].push(fourniture);
        }

        const propPlaced = {};
        let count = 0;
        for (const type of Object.keys(fourniturePropList)) {
            propPlaced[type] = fourniturePropList[type]
                .filter(item => item.position && (!textFilter || item.label.toLocaleLowerCase().includes(textFilter)))
                .sort((a, b) => a.label.localeCompare(b.label));
            count += propPlaced[type].length;
        }
        setPlaced(propPlaced);
        setCounter(count);

        const propNotPlaced = {};
        for (const type of Object.keys(fourniturePropList)) {
            propNotPlaced[type] = fourniturePropList[type]
                .filter(item => !item.position && (!textFilter || item.label.toLocaleLowerCase().includes(textFilter)))
                .sort((a, b) => a.label.localeCompare(b.label));
        }
        setNotPlaced(propNotPlaced);
    }, [housingProps]);

    useEffect(() => {
        const propPlacedFiltered = {};
        for (const type of Object.keys(placed)) {
            propPlacedFiltered[type] = placed[type].filter(
                item => !textFilter || item.label.toLocaleLowerCase().includes(textFilter)
            );
        }
        setPlacedFiltered(propPlacedFiltered);

        const propNotPlacedFiltered = {};
        for (const type of Object.keys(notPlaced)) {
            propNotPlacedFiltered[type] = notPlaced[type].filter(
                item => !textFilter || item.label.toLocaleLowerCase().includes(textFilter)
            );
        }
        setNotPlacedFiltered(propNotPlacedFiltered);
    }, [textFilter, placed, notPlaced]);

    useEffect(() => {
        const targetLocation = location.pathname.split('/')?.[2];
        if (targetLocation?.length) {
            const [current, menuCat] = targetLocation.split('_');
            if (menuCat) {
                let isEmpty = false;
                if (current.endsWith('props')) {
                    const category = Object.keys(placed).find(k => k.toLowerCase() === menuCat);
                    if (category && !placed[category].length) {
                        isEmpty = true;
                    }
                } else {
                    const category = Object.keys(notPlaced).find(k => k.toLowerCase() === menuCat);
                    if (category && !notPlaced[category].length) {
                        isEmpty = true;
                    }
                }

                if (isEmpty) {
                    navigate(-1);
                }
            }
        }
    }, [placed, notPlaced]);

    const onBlur = async () => {
        await fetchNui(NuiEvent.HousingUpdatePosition, {
            position: [position.x, position.y, position.z],
            rotation: [position.rotX, position.rotY, position.rotZ],
        });
    };

    const updateDebugFromInput = async (key: string, value: number) => {
        const newPosition = { ...position };
        newPosition[key] = value;
        setPosition(newPosition);
    };

    useEffect(() => {
        (async () => {
            if (location.pathname !== `/${MenuType.HousingPropPlacementMenu}/editor`) {
                await fetchNui(NuiEvent.LeaveHousingEditorMode);
            }
        })();
    }, [location.pathname]);

    if (!player) {
        return null;
    }

    const onSelectedCreateProp = (selectedProp?: HousingProp) => {
        return () => {
            fetchNui(NuiEvent.SelectHousingPropToCreate, { selectedProp });
        };
    };

    const onChooseCreateProp = (selectedProp: HousingProp) => {
        return () => {
            fetchNui(NuiEvent.ChooseHousingPropToCreate, { selectedProp });
        };
    };

    return (
        <MenuGizmo
            type={MenuType.HousingPropPlacementMenu}
            setDebugProp={setDebugProp}
            debugProp={debugProp}
            setPosition={setPosition}
            childTextFocus={childTextFocus}
        >
            <MainMenu>
                <MenuTitle banner={banner}>Housing activé</MenuTitle>
                <MenuContent helpPanel={HousingHelpPanel}>
                    <MenuItemSelect
                        title={
                            <div className="flex items-center">
                                <img alt="engine" className="ml-2 w-8 h-8" src={`/public/images/housing/maison.webp`} />
                                <h3 className="ml-4">Housing</h3>
                            </div>
                        }
                        value={shell}
                        key={shell}
                        onConfirm={async (_idx, value) => {
                            if (value !== shell) {
                                await fetchNui(NuiEvent.SetHousingShell, { shellEnable: value });
                            }
                        }}
                        showAllOptions
                        alignRight
                    >
                        <MenuItemSelectOptionBox value={1} highlight={shell === 1}>
                            Désactivé
                        </MenuItemSelectOptionBox>
                        <MenuItemSelectOptionBox value={0} highlight={shell === 0}>
                            Activé
                        </MenuItemSelectOptionBox>
                    </MenuItemSelect>
                    {maxFourntiure && (
                        <MenuTitle>
                            Meubles placés : {counter} / {maxFourntiure}
                        </MenuTitle>
                    )}
                    <MenuItemSubMenuLink id={`collection/props`} disabled={Boolean(shell)}>
                        📝 Voir la liste des meubles placés
                    </MenuItemSubMenuLink>
                    <MenuItemSubMenuLink id={`collection/propchoose`} disabled={Boolean(shell)}>
                        ➕ Placer un meuble
                    </MenuItemSubMenuLink>
                </MenuContent>
            </MainMenu>

            <SubMenu id="collection/props">
                <MenuTitle banner={banner}>Choisir un type de meuble</MenuTitle>
                <MenuContent helpPanel={HousingHelpPanel}>
                    <MenuTitle>Type de meuble</MenuTitle>
                    <MenuItemStringInput
                        setChildTextFocus={setChildTextFocus}
                        onChange={handleFilter}
                        value={textFilter}
                    >
                        Filtre:
                    </MenuItemStringInput>
                    {Object.keys(placedFiltered)
                        .sort((a, b) => a.localeCompare(b))
                        .map(propCategory => (
                            <MenuItemSubMenuLink
                                key={propCategory}
                                id={`collection/props_${propCategory}`}
                                disabled={placedFiltered[propCategory].length === 0}
                            >
                                {propCategory}
                            </MenuItemSubMenuLink>
                        ))}
                </MenuContent>
            </SubMenu>

            {Object.keys(placedFiltered).map(propCategory => (
                <SubMenu id={`collection/props_${propCategory}`}>
                    <MenuTitle banner={banner}>{`Choisir un ${propCategory}`}</MenuTitle>
                    <MenuContent helpPanel={HousingHelpPanel}>
                        <MenuItemStringInput
                            onSelected={onSelectedCreateProp()}
                            setChildTextFocus={setChildTextFocus}
                            onChange={handleFilter}
                            value={textFilter}
                        >
                            Filtre:
                        </MenuItemStringInput>
                        {placedFiltered[propCategory].map(prop => (
                            <MenuItemSelect
                                key={prop.id}
                                title={
                                    <div className="flex justify-between items-center">
                                        <span>{prop.label}</span>
                                        {ZkeaFourniture[prop.model]?.collision !== true && <span>⚠</span>}
                                    </div>
                                }
                                titleWidth={60}
                                onSelected={async () => {
                                    await fetchNui(NuiEvent.SelectHousingPlacedProp, { prop: prop });
                                }}
                                description={
                                    ZkeaFourniture[prop.model]?.collision !== true ? '⚠ : Sans collision' : null
                                }
                                onConfirm={async (_, value) => {
                                    switch (value) {
                                        case 'delete':
                                            await fetchNui(NuiEvent.RequestHousingDeleteProp, { prop: prop });
                                            break;

                                        case 'edit':
                                            await fetchNui(NuiEvent.ChooseHousingPlacedPropToEdit, {
                                                prop: prop,
                                            });
                                            break;
                                    }
                                }}
                            >
                                <MenuItemSelectOption value="edit">Editer</MenuItemSelectOption>
                                <MenuItemSelectOption value="delete">Supprimer</MenuItemSelectOption>
                            </MenuItemSelect>
                        ))}
                    </MenuContent>
                </SubMenu>
            ))}

            <SubMenu id="collection/propchoose">
                <MenuTitle banner={banner}>Choisir un type de meuble</MenuTitle>
                <MenuContent helpPanel={HousingHelpPanel}>
                    <MenuTitle>Type de meuble</MenuTitle>
                    <MenuItemStringInput
                        setChildTextFocus={setChildTextFocus}
                        onChange={handleFilter}
                        value={textFilter}
                    >
                        Filtre:
                    </MenuItemStringInput>
                    {Object.keys(notPlacedFiltered)
                        .sort((a, b) => a.localeCompare(b))
                        .map(propCategory => (
                            <MenuItemSubMenuLink
                                key={propCategory}
                                id={`collection/propchoose_${propCategory}`}
                                disabled={notPlacedFiltered[propCategory].length === 0}
                            >
                                {propCategory}
                            </MenuItemSubMenuLink>
                        ))}
                </MenuContent>
            </SubMenu>

            {Object.keys(notPlacedFiltered).map(propCategory => (
                <SubMenu key={propCategory} id={`collection/propchoose_${propCategory}`}>
                    <MenuTitle banner={banner}>{`Choisir un ${propCategory}`}</MenuTitle>
                    <MenuContent helpPanel={HousingHelpPanel}>
                        <MenuItemStringInput
                            onSelected={onSelectedCreateProp()}
                            setChildTextFocus={setChildTextFocus}
                            onChange={handleFilter}
                            value={textFilter}
                        >
                            Filtre:
                        </MenuItemStringInput>
                        {notPlacedFiltered[propCategory].map(prop => (
                            <MenuItemButton
                                key={prop.model}
                                onSelected={onSelectedCreateProp(prop)}
                                onConfirm={onChooseCreateProp(prop)}
                                description={
                                    ZkeaFourniture[prop.model]?.collision !== true ? '⚠ : Sans collision' : null
                                }
                            >
                                <div className="flex justify-between items-center">
                                    <span>{`${prop.label}`}</span>
                                    {ZkeaFourniture[prop.model]?.collision !== true && <span>⚠</span>}
                                </div>
                            </MenuItemButton>
                        ))}
                    </MenuContent>
                </SubMenu>
            ))}

            <SubMenu id="editor">
                <MenuTitle banner={banner}>Mode Editeur</MenuTitle>
                <MenuContent helpPanel={HousingPlacementHelpPanel}>
                    <MenuItemSelect
                        title="Type de stockage"
                        value={debugProp?.storageType}
                        onChange={async (_, value) => {
                            await fetchNui(NuiEvent.HousingUpdateDebugStorageType, value);
                        }}
                        disabled={ZkeaFourniture[debugProp?.model]?.collision !== true}
                    >
                        <MenuItemSelectOption
                            disabled={ZkeaFourniture[debugProp?.model]?.collision !== true}
                            value={null}
                        >
                            Aucun
                        </MenuItemSelectOption>
                        <MenuItemSelectOption
                            disabled={ZkeaFourniture[debugProp?.model]?.collision !== true}
                            value="stock"
                        >
                            Coffre de stockage
                        </MenuItemSelectOption>
                        <MenuItemSelectOption
                            disabled={ZkeaFourniture[debugProp?.model]?.collision !== true}
                            value="cash_stock"
                        >
                            Coffre d'argent
                        </MenuItemSelectOption>
                        <MenuItemSelectOption
                            disabled={ZkeaFourniture[debugProp?.model]?.collision !== true}
                            value="food_stock"
                        >
                            Frigo
                        </MenuItemSelectOption>
                        <MenuItemSelectOption
                            disabled={ZkeaFourniture[debugProp?.model]?.collision !== true}
                            value="cloth_stock"
                        >
                            Penderie
                        </MenuItemSelectOption>
                    </MenuItemSelect>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.PropPlacementHousingReset, { position: true });
                        }}
                    >
                        🔄 Réinitialiser la position
                    </MenuItemButton>
                    <MenuItemNumberInput
                        setChildTextFocus={setChildTextFocus}
                        name="x"
                        onChange={updateDebugFromInput}
                        onBlur={onBlur}
                        value={position.x}
                    >
                        Position X:
                    </MenuItemNumberInput>
                    <MenuItemNumberInput
                        setChildTextFocus={setChildTextFocus}
                        name="y"
                        onChange={updateDebugFromInput}
                        onBlur={onBlur}
                        value={position.y}
                    >
                        Position Y:
                    </MenuItemNumberInput>
                    <MenuItemNumberInput
                        setChildTextFocus={setChildTextFocus}
                        name="z"
                        onChange={updateDebugFromInput}
                        onBlur={onBlur}
                        value={position.z}
                    >
                        Position Z:
                    </MenuItemNumberInput>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.PropPlacementHousingReset, { rotation: true });
                        }}
                    >
                        🔄 Réinitialiser la rotation
                    </MenuItemButton>
                    <MenuItemNumberInput
                        setChildTextFocus={setChildTextFocus}
                        name="rotX"
                        onChange={updateDebugFromInput}
                        onBlur={onBlur}
                        value={position.rotX}
                    >
                        Rotation X:
                    </MenuItemNumberInput>
                    <MenuItemNumberInput
                        setChildTextFocus={setChildTextFocus}
                        name="rotY"
                        onChange={updateDebugFromInput}
                        onBlur={onBlur}
                        value={position.rotY}
                    >
                        Rotation Y:
                    </MenuItemNumberInput>
                    <MenuItemNumberInput
                        setChildTextFocus={setChildTextFocus}
                        name="rotZ"
                        onChange={updateDebugFromInput}
                        onBlur={onBlur}
                        value={position.rotZ}
                    >
                        Rotation Z:
                    </MenuItemNumberInput>
                </MenuContent>
            </SubMenu>
        </MenuGizmo>
    );
};

const HousingHelpPanel = (
    <>
        <MenuTitle>Contrôle du menu</MenuTitle>
        <MenuItemText> Tab : Basculer le mode caméra ou souris</MenuItemText>
        <MenuItemText> Clic Gauche (en mode souris) : Sélection d'objet</MenuItemText>
    </>
);

const HousingPlacementHelpPanel = (
    <>
        <MenuTitle>Contrôle du mode editeur</MenuTitle>
        <MenuItemText> Tab : Basculer le mode caméra ou souris</MenuItemText>
        <MenuItemText> R : Basculer le mode translation/rotation</MenuItemText>
        <MenuItemText> L : Basculer mode de reférence</MenuItemText>
        <MenuItemText> C : Aligner l'objet ⬇️</MenuItemText>
        <MenuItemText> Espace : Confirmer et placer l'objet ✔️</MenuItemText>
        <MenuItemText> Suppr : Effacer l'objet sélectionné ❌</MenuItemText>
    </>
);

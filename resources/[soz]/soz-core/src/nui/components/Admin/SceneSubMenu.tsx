import { SozRole } from '@core/permissions';
import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event/nui';
import { AskInput } from '@public/shared/nui/input';
import {
    SCENE_COLORS,
    SCENE_COLORS_LABELS,
    SceneColor,
    SenatSceneState,
    Spot,
    SPOT_COLORS,
    SPOT_COLORS_LABELS,
    SPOT_GROUP_BOTTOM,
    SPOT_GROUP_FIRST_ROW,
    SPOT_GROUP_SECOND_ROW,
    SPOT_LABELS,
} from '@public/shared/story/story';
import { Fragment, FunctionComponent, useState } from 'react';

import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuSubTitle,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type MeteorSubMenuProps = {
    permission: SozRole;
    state: SenatSceneState;
};

const SPOT_GROUP_ALL = [...SPOT_GROUP_BOTTOM, ...SPOT_GROUP_FIRST_ROW, ...SPOT_GROUP_SECOND_ROW];

const copyToClipboard = text => {
    const clipElem = document.createElement('input');
    clipElem.value = text;
    document.body.appendChild(clipElem);
    clipElem.select();
    document.execCommand('copy');
    document.body.removeChild(clipElem);
};

export const SceneSubMenu: FunctionComponent<MeteorSubMenuProps> = ({ permission, state }) => {
    const [temporaryState, setTemporaryState] = useState<SenatSceneState>(state);

    return (
        <>
            <SubMenu id="christmas">
                <MenuTitle title={permission} />
                <MenuContent subtitle="Vive le vent !">
                    <MenuSubTitle>Scène</MenuSubTitle>
                    <MenuItemButton
                        description={temporaryState.video_url || 'Aucune vidéo'}
                        onConfirm={async () => {
                            const newVideoUrl = await fetchNui<AskInput, string>(NuiEvent.AskInput, {
                                title: 'Url de la vidéo',
                                defaultValue: temporaryState.video_url || '',
                                maxCharacters: 255,
                            });

                            setTemporaryState({
                                ...temporaryState,
                                video_url: !newVideoUrl || newVideoUrl === '' ? null : newVideoUrl,
                            });
                        }}
                    >
                        Url de la vidéo
                    </MenuItemButton>
                    <MenuItemSelect
                        title="Scene bas"
                        value={temporaryState.scene_bottom_color}
                        onChange={(index, color) => {
                            setTemporaryState({
                                ...temporaryState,
                                scene_bottom_color: color,
                            });
                        }}
                    >
                        {Object.keys(SCENE_COLORS).map(colorId => (
                            <MenuItemSelectOption value={colorId} key={`color_${colorId}`}>
                                {SCENE_COLORS_LABELS[colorId]}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    <MenuItemSelect
                        title="Scene milieu"
                        value={temporaryState.scene_middle_color}
                        onChange={(index, color) => {
                            setTemporaryState({
                                ...temporaryState,
                                scene_middle_color: color,
                            });
                        }}
                    >
                        {Object.keys(SCENE_COLORS).map(colorId => (
                            <MenuItemSelectOption value={colorId} key={`color_${colorId}`}>
                                {SCENE_COLORS_LABELS[colorId]}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    <MenuItemSelect
                        title="Scene haut"
                        value={temporaryState.scene_top_color}
                        onChange={(index, color) => {
                            setTemporaryState({
                                ...temporaryState,
                                scene_top_color: color,
                            });
                        }}
                    >
                        {Object.keys(SCENE_COLORS).map(colorId => (
                            <MenuItemSelectOption value={colorId} key={`color_${colorId}`}>
                                {SCENE_COLORS_LABELS[colorId]}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    <MenuItemCheckbox
                        checked={temporaryState.track_player}
                        description="Active/Désactive le tracking du joueur par les spots, le tracking est fait sur le
                        joueur le plus proche du centre de l'étoile"
                        onChange={checked => {
                            setTemporaryState({
                                ...temporaryState,
                                track_player: checked,
                            });
                        }}
                    >
                        Tracking joueur
                    </MenuItemCheckbox>
                    <MenuItemSelect
                        title="Toutes les lumieres"
                        onChange={(_index, color) => {
                            const spotState = {
                                enabled: color !== null,
                                color: color === null ? SceneColor.Black : color,
                            };

                            const spots = {};

                            for (const spotName of SPOT_GROUP_ALL) {
                                spots[spotName] = spotState;
                            }

                            setTemporaryState({
                                ...temporaryState,
                                spots: {
                                    ...temporaryState.spots,
                                    ...spots,
                                },
                            });
                        }}
                    >
                        <MenuItemSelectOption value={null}>Eteint</MenuItemSelectOption>
                        {Object.keys(SPOT_COLORS).map((colorId, index) => (
                            <MenuItemSelectOption value={colorId} key={index}>
                                {SPOT_COLORS_LABELS[colorId]}
                            </MenuItemSelectOption>
                        ))}
                    </MenuItemSelect>
                    <MenuLightGroup
                        setTemporaryState={setTemporaryState}
                        temporaryState={temporaryState}
                        spots={SPOT_GROUP_BOTTOM}
                        suffix="bas de scène"
                    />
                    <MenuLightGroup
                        setTemporaryState={setTemporaryState}
                        temporaryState={temporaryState}
                        spots={SPOT_GROUP_FIRST_ROW}
                        suffix="première rangée"
                    />
                    <MenuLightGroup
                        setTemporaryState={setTemporaryState}
                        temporaryState={temporaryState}
                        spots={SPOT_GROUP_SECOND_ROW}
                        suffix="deuxième rangée"
                    />
                    <MenuSubTitle>Etat</MenuSubTitle>
                    <MenuItemButton
                        onConfirm={() => {
                            copyToClipboard(JSON.stringify(temporaryState));
                        }}
                        description="Sauvegarde l'état actuel de la scène dans votre presse papier"
                    >
                        Sauvegarder
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={async () => {
                            const newVideoUrl = await fetchNui<AskInput, string>(NuiEvent.AskInput, {
                                title: 'Etat à importer',
                                defaultValue: temporaryState.video_url || '',
                                maxCharacters: 16 * 1024 * 1024,
                            });

                            if (!newVideoUrl || newVideoUrl === '') return;

                            try {
                                const newState = JSON.parse(newVideoUrl);
                                setTemporaryState(newState);
                            } catch (e) {
                                console.error(e);
                            }
                        }}
                    >
                        Importer
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.AdminMenuXmasSetState, temporaryState);
                        }}
                    >
                        Appliquer
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
        </>
    );
};

type MenuLightGroupProps = {
    temporaryState: SenatSceneState;
    setTemporaryState: (state: SenatSceneState) => void;
    suffix: string;
    spots: Spot[];
};

export const MenuLightGroup: FunctionComponent<MenuLightGroupProps> = ({
    suffix,
    spots,
    temporaryState,
    setTemporaryState,
}) => {
    return (
        <>
            <MenuSubTitle>Lumières {suffix}</MenuSubTitle>
            <MenuItemSelect
                title={`Toutes les lumieres ${suffix}`}
                onChange={(_index, color) => {
                    const spotState = {
                        enabled: color !== null,
                        color: color === null ? SceneColor.Black : color,
                    };

                    const spotStates = {};

                    for (const spotName of spots) {
                        spotStates[spotName] = spotState;
                    }

                    setTemporaryState({
                        ...temporaryState,
                        spots: {
                            ...temporaryState.spots,
                            ...spotStates,
                        },
                    });
                }}
            >
                <MenuItemSelectOption value={null}>Eteint</MenuItemSelectOption>
                {Object.keys(SPOT_COLORS).map((colorId, index) => (
                    <MenuItemSelectOption value={colorId} key={index}>
                        {SPOT_COLORS_LABELS[colorId]}
                    </MenuItemSelectOption>
                ))}
            </MenuItemSelect>
            {spots.map((spotName, index) => {
                return (
                    <Fragment key={index}>
                        <MenuItemSelect
                            syncValue
                            title={SPOT_LABELS[spotName]}
                            value={
                                temporaryState.spots[spotName]?.enabled
                                    ? temporaryState.spots[spotName]?.color ?? null
                                    : null
                            }
                            onChange={(index, color) => {
                                setTemporaryState({
                                    ...temporaryState,
                                    spots: {
                                        ...temporaryState.spots,
                                        [spotName]: {
                                            enabled: color !== null,
                                            color: color === null ? SceneColor.Black : color,
                                        },
                                    },
                                });
                            }}
                        >
                            <MenuItemSelectOption value={null}>Eteint</MenuItemSelectOption>
                            {Object.keys(SPOT_COLORS).map((colorId, index) => (
                                <MenuItemSelectOption value={colorId} key={index}>
                                    {SPOT_COLORS_LABELS[colorId]}
                                </MenuItemSelectOption>
                            ))}
                        </MenuItemSelect>
                    </Fragment>
                );
            })}
        </>
    );
};

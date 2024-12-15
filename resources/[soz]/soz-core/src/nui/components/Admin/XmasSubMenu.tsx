import { SozRole } from '@core/permissions';
import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event/nui';
import { AskInput } from '@public/shared/nui/input';
import { Fragment, FunctionComponent, useState } from 'react';

import { SCENE_COLORS, SceneColor, Spot, SPOT_LABELS, XmasSceneState } from '../../../shared/story/story';
import {
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export type MeteorSubMenuProps = {
    banner: string;
    permission: SozRole;
    state: XmasSceneState;
};

const SPOT_GROUP_ALL = [
    Spot.SPOT_SCENE_BOTTOM_FRONT_RIGHT,
    Spot.SPOT_SCENE_BOTTOM_FRONT_LEFT,
    Spot.SPOT_SCENE_BOTTOM_BACK_RIGHT,
    Spot.SPOT_SCENE_BOTTOM_BACK_LEFT,
    Spot.SPOT_SCENE_UP_FIRST_ROW_1,
    Spot.SPOT_SCENE_UP_FIRST_ROW_2,
    Spot.SPOT_SCENE_UP_FIRST_ROW_3,
    Spot.SPOT_SCENE_UP_FIRST_ROW_4,
    Spot.SPOT_SCENE_UP_FIRST_ROW_5,
    Spot.SPOT_SCENE_UP_FIRST_ROW_6,
    Spot.SPOT_SCENE_UP_SECOND_ROW_1,
    Spot.SPOT_SCENE_UP_SECOND_ROW_2,
    Spot.SPOT_SCENE_UP_SECOND_ROW_3,
    Spot.SPOT_SCENE_UP_SECOND_ROW_4,
    Spot.SPOT_SCENE_UP_SECOND_ROW_5,
    Spot.SPOT_SCENE_UP_SECOND_ROW_6,
];

const SPOT_GROUP_BOTTOM = [
    Spot.SPOT_SCENE_BOTTOM_FRONT_RIGHT,
    Spot.SPOT_SCENE_BOTTOM_FRONT_LEFT,
    Spot.SPOT_SCENE_BOTTOM_BACK_RIGHT,
    Spot.SPOT_SCENE_BOTTOM_BACK_LEFT,
];

const SPOT_GROUP_FIRST_ROW = [
    Spot.SPOT_SCENE_UP_FIRST_ROW_1,
    Spot.SPOT_SCENE_UP_FIRST_ROW_2,
    Spot.SPOT_SCENE_UP_FIRST_ROW_3,
    Spot.SPOT_SCENE_UP_FIRST_ROW_4,
    Spot.SPOT_SCENE_UP_FIRST_ROW_5,
    Spot.SPOT_SCENE_UP_FIRST_ROW_6,
];

const SPOT_GROUP_SECOND_ROW = [
    Spot.SPOT_SCENE_UP_SECOND_ROW_1,
    Spot.SPOT_SCENE_UP_SECOND_ROW_2,
    Spot.SPOT_SCENE_UP_SECOND_ROW_3,
    Spot.SPOT_SCENE_UP_SECOND_ROW_4,
    Spot.SPOT_SCENE_UP_SECOND_ROW_5,
    Spot.SPOT_SCENE_UP_SECOND_ROW_6,
];

const GROUPS: Record<string, Spot[]> = {
    Tout: SPOT_GROUP_ALL,
    Bas: SPOT_GROUP_BOTTOM,
    'Première rangée': SPOT_GROUP_FIRST_ROW,
    'Deuxième rangée': SPOT_GROUP_SECOND_ROW,
};

const copyToClipboard = text => {
    const clipElem = document.createElement('input');
    clipElem.value = text;
    document.body.appendChild(clipElem);
    clipElem.select();
    document.execCommand('copy');
    document.body.removeChild(clipElem);
};

export const XmasSubMenu: FunctionComponent<MeteorSubMenuProps> = ({ banner, state }) => {
    const [temporaryState, setTemporaryState] = useState<XmasSceneState>(state);

    return (
        <>
            <SubMenu id="christmas">
                <MenuTitle banner={banner}>Vive le vent !</MenuTitle>
                <MenuContent>
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
                                {colorId}
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
                                {colorId}
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
                                {colorId}
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
                    {Object.keys(GROUPS).map((groupName, index) => {
                        return (
                            <Fragment key={index}>
                                <MenuItemSelect
                                    title={groupName}
                                    onChange={(index, color) => {
                                        const spotState = {
                                            enabled: color !== null,
                                            color: color === null ? SceneColor.Black : color,
                                        };

                                        const spots = {};

                                        for (const spotName of GROUPS[groupName]) {
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
                                    {Object.keys(SCENE_COLORS).map((colorId, index) => (
                                        <MenuItemSelectOption value={colorId} key={index}>
                                            {colorId}
                                        </MenuItemSelectOption>
                                    ))}
                                </MenuItemSelect>
                            </Fragment>
                        );
                    })}

                    {Object.keys(SPOT_LABELS).map((spotName, index) => {
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
                                    {Object.keys(SCENE_COLORS).map((colorId, index) => (
                                        <MenuItemSelectOption value={colorId} key={index}>
                                            {colorId}
                                        </MenuItemSelectOption>
                                    ))}
                                </MenuItemSelect>
                            </Fragment>
                        );
                    })}
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

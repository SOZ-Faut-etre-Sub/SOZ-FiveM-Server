import { SozRole } from '@core/permissions';
import { fetchNui } from '@public/nui/fetch';
import { NuiEvent } from '@public/shared/event/nui';
import { AskInput } from '@public/shared/nui/input';
import { Fragment, FunctionComponent, useState } from 'react';

import { SCENE_COLORS, SceneColor, SPOT_LABELS, XmasSceneState } from '../../../shared/story/story';
import {
    MenuContent,
    MenuItemButton,
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
                    <MenuItemButton
                        onConfirm={() => {
                            setTemporaryState({
                                ...temporaryState,
                                spots: {},
                            });
                        }}
                    >
                        Eteindre les lumières
                    </MenuItemButton>

                    {Object.keys(SPOT_LABELS).map((spotName, index) => {
                        return (
                            <Fragment key={index}>
                                <MenuItemSelect
                                    syncValue
                                    title={SPOT_LABELS[spotName]}
                                    value={temporaryState.spots[spotName]?.color ?? null}
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
                            console.log(JSON.stringify(temporaryState));

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

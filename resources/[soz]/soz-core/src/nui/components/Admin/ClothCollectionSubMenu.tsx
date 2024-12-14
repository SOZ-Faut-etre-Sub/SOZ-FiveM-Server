import { ClothCollectionSubMenuState, ClothingFields, CollectionInfo } from '@public/shared/cloth';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { MenuContent, MenuItemSelect, MenuItemSelectOption, MenuTitle, SubMenu } from '../Styleguide/Menu';

export type ClothCollectionSubMenuProps = {
    banner: string;
};

export const ClothCollectionSubMenu: FunctionComponent<ClothCollectionSubMenuProps> = ({ banner }) => {
    const [data, setData] = useState<CollectionInfo>(null);
    const [state, setState] = useState<ClothCollectionSubMenuState>();
    const [defaults, setDefault] = useState<ClothCollectionSubMenuState[]>([]);

    useEffect(() => {
        fetchNui<any, CollectionInfo>(NuiEvent.AdminMenuClothCollectionFetch).then(data => setData(data));
        fetchNui<any, ClothCollectionSubMenuState[]>(NuiEvent.AdminMenuClothCollectionCurrent).then(data => {
            setDefault(data);
            setState({ field: 0, dlc: data[0].dlc, drawable: data[0].drawable, texture: data[0].texture });
        });
    }, []);

    const update = (subState: Partial<ClothCollectionSubMenuState>, skipRedraw: boolean) => {
        if (!subState) {
            return;
        }
        const newState: ClothCollectionSubMenuState = {
            ...state,
            ...subState,
        };

        if (
            newState.field != state.field ||
            newState.dlc != state.dlc ||
            newState.drawable != state.drawable ||
            newState.texture != state.texture
        ) {
            setState(newState);

            if (!skipRedraw) {
                fetchNui(NuiEvent.AdminMenuClothCollectionPreview, newState);
            }
        }
    };

    if (!data || !state || !defaults) {
        return null;
    }

    return (
        <SubMenu id="player_style2">
            <MenuTitle banner={banner}></MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Type"
                    titleWidth={20}
                    onChange={index => {
                        if (index != null) {
                            update(
                                {
                                    field: index,
                                    dlc: defaults[index].dlc,
                                    drawable: defaults[index].drawable,
                                    texture: defaults[index].texture,
                                },
                                true
                            );
                        }
                    }}
                >
                    {ClothingFields.map(elem => (
                        <MenuItemSelectOption key={'field_' + elem.label}>{elem.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title="DLC"
                    titleWidth={20}
                    value={state.dlc}
                    onChange={(index, value) => {
                        if (value != null) {
                            update(
                                {
                                    dlc: value,
                                    drawable: parseInt(Object.keys(data.data[value][state.field])[0]),
                                    texture: 0,
                                },
                                true
                            );
                        }
                    }}
                >
                    {data.dlc
                        .map((name, index) => ({ name, index }))
                        .filter(elem => {
                            return Object.values(data.data[elem.index][state.field]).length > 0;
                        })
                        .map(elem => (
                            <MenuItemSelectOption value={elem.index} key={'dlc_' + elem.index}>
                                {elem.name || 'base'}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title={ClothingFields[state.field].type == 'comp' ? `Drawable` : 'Prop'}
                    titleWidth={30}
                    value={state.drawable}
                    onChange={(index, value) => {
                        if (value != null) {
                            update(
                                {
                                    drawable: value,
                                    texture: 0,
                                },
                                false
                            );
                        }
                    }}
                    onSelected={() =>
                        fetchNui(NuiEvent.AdminMenuClothCollectionPreview, {
                            type: ClothingFields[state.field].type,
                            index: ClothingFields[state.field].index,
                            dlc: data.dlc[state.dlc],
                            drawable: state.drawable,
                            texture: state.texture,
                        })
                    }
                >
                    {Object.keys(data.data[state.dlc][state.field]).map(value => (
                        <MenuItemSelectOption value={value} key={'drawable_' + value}>
                            {value}
                        </MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title={'Texture'}
                    titleWidth={30}
                    value={state.texture}
                    onChange={index => {
                        if (index != null) {
                            update(
                                {
                                    texture: index,
                                },
                                false
                            );
                        }
                    }}
                >
                    {Array(data.data[state.dlc][state.field][state.drawable])
                        .fill(0)
                        .map((_, index) => (
                            <MenuItemSelectOption key={'texture' + index}>{index}</MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
            </MenuContent>
        </SubMenu>
    );
};

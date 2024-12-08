import { ClothingFields, CollectionInfo } from '@public/shared/cloth';
import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import { MenuContent, MenuItemSelect, MenuItemSelectOption, MenuTitle, SubMenu } from '../Styleguide/Menu';

export type ClothCollectionSubMenuProps = {
    banner: string;
};

export type ClothCollectionSubMenuState = {
    field: number;
    dlc: number;
    drawable: number;
    texture: number;
};

export const ClothCollectionSubMenu: FunctionComponent<ClothCollectionSubMenuProps> = ({ banner }) => {
    const [data, setData] = useState<CollectionInfo>(null);
    const [state, setState] = useState<ClothCollectionSubMenuState>({ field: 0, dlc: 0, drawable: 0, texture: 0 });

    useEffect(() => {
        fetchNui<any, CollectionInfo>(NuiEvent.AdminMenuClothCollectionFetch).then(data => setData(data));
    }, []);

    const update = (subState: Partial<ClothCollectionSubMenuState>) => {
        if (!subState) {
            return;
        }
        const newState: ClothCollectionSubMenuState = {
            ...state,
            ...subState,
        };
        if (!data) {
            return;
        }
        if (!newState) {
            return;
        }

        if (
            newState.field != state.field ||
            newState.dlc != state.dlc ||
            newState.drawable != state.drawable ||
            newState.texture != state.texture
        ) {
            console.log('subState', JSON.stringify(subState));
            console.log(
                'type',
                newState.field,
                state.field,
                'dlc',
                newState.dlc,
                state.dlc,
                'drawable',
                newState.drawable,
                state.drawable,
                'texture',
                newState.texture,
                state.texture
            );
            setState(newState);
            fetchNui(NuiEvent.AdminMenuClothCollectionPreview, {
                type: ClothingFields[newState.field].type,
                index: ClothingFields[newState.field].index,
                dlc: data.dlc[newState.dlc],
                drawable: newState.drawable,
                texture: newState.texture,
            });
        }
    };

    if (!data || !state) {
        return null;
    }

    return (
        <SubMenu id="player_style2">
            <MenuTitle banner={banner}></MenuTitle>
            <MenuContent>
                <MenuItemSelect
                    title="Type"
                    onChange={index => {
                        if (index != null) {
                            const dlc = Object.values(data.dlc).findIndex(
                                (_, indexDlc) => Object.values(data.data[indexDlc][index]).length > 0
                            );
                            update({
                                field: index,
                                dlc: dlc,
                                drawable: parseInt(Object.keys(data.data[dlc][index])[0]),
                                texture: 0,
                            });
                        }
                    }}
                >
                    {ClothingFields.map(elem => (
                        <MenuItemSelectOption key={'field_' + elem.label}>{elem.label}</MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title="DLC"
                    value={state.dlc}
                    onChange={(index, value) => {
                        if (value != null) {
                            console.log('Update  DLC', index, value);
                            update({
                                dlc: value,
                                drawable: parseInt(Object.keys(data.data[value][state.field])[0]),
                                texture: 0,
                            });
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
                    value={state.drawable}
                    onChange={(index, value) => {
                        if (value != null) {
                            update({
                                drawable: value,
                                texture: 0,
                            });
                        }
                    }}
                >
                    {Object.keys(data.data[state.dlc][state.field]).map(value => (
                        <MenuItemSelectOption value={value} key={'drawable_' + value}>
                            {value}
                        </MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    title={'Texture'}
                    value={state.texture}
                    onChange={index => {
                        if (index != null) {
                            update({
                                texture: index,
                            });
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

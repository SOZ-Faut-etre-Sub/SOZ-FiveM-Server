import { ClothCollectionSubMenuState, ClothingFields, CollectionInfo } from '@public/shared/cloth';
import { FunctionComponent, useState } from 'react';

import { NuiEvent } from '../../../shared/event';
import { fetchNui } from '../../fetch';
import {
    MenuContent,
    MenuItemButton,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuTitle,
    SubMenu,
} from '../Styleguide/Menu';

export const ClothCollectionSubMenu: FunctionComponent = () => {
    const [data, setData] = useState<CollectionInfo>(null);
    const [state, setState] = useState<ClothCollectionSubMenuState>();
    const [selected, setSelected] = useState<number>();

    const load = () => {
        fetchNui<any, CollectionInfo>(NuiEvent.AdminMenuClothCollectionFetch).then(data => {
            setData(data);
            setState({ ...data.current[0] });
        });
    };

    const update = (subState: Partial<ClothCollectionSubMenuState>, skipRedraw: boolean) => {
        if (!subState) {
            return;
        }
        const newState: ClothCollectionSubMenuState = {
            ...state,
            ...subState,
        };

        setState(newState);

        if (!skipRedraw) {
            data.current[state.fieldIndex] = { ...state };
            fetchNui(NuiEvent.AdminMenuClothCollectionPreview, newState);
        }
    };

    if (!data || !state) {
        return (
            <SubMenu id="player_style2">
                <MenuTitle title="Vetements par DLC" />
                <MenuContent>
                    <MenuItemButton disabled={true} onSelected={load}>
                        Chargement...
                    </MenuItemButton>
                </MenuContent>
            </SubMenu>
        );
    }

    return (
        <SubMenu id="player_style2">
            <MenuTitle title="Vetements par DLC" />
            <MenuContent>
                <MenuItemSelect
                    title="Type"
                    titleWidth={20}
                    value={state.fieldIndex}
                    onSelected={() => {
                        setSelected(0);
                    }}
                    syncValue
                    onChange={index => {
                        if (index != null && selected == 0) {
                            update(
                                {
                                    ...data.current[index],
                                },
                                true
                            );
                        }
                    }}
                >
                    {ClothingFields.map((elem, index) => (
                        <MenuItemSelectOption value={index} key={'field_' + elem.label} helper={elem.label}>
                            {elem.label}
                        </MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    key={state.fieldIndex + 'dlc'}
                    title="DLC"
                    titleWidth={20}
                    value={state.dlcIndex}
                    onSelected={() => {
                        setSelected(1);
                    }}
                    syncValue
                    onChange={(index, value) => {
                        if (value != null && value != state.dlcIndex && selected == 1) {
                            update(
                                {
                                    dlcIndex: parseInt(value),
                                    drawable: 0,
                                    texture: 0,
                                },
                                Object.values(data.data[parseInt(value)][state.fieldIndex]).length <= 0
                            );
                        }
                    }}
                    description={
                        Object.keys(data.data[state.dlcIndex][state.fieldIndex]).length +
                        ' ' +
                        (ClothingFields[state.fieldIndex].type == 'comp' ? `Drawable(s)` : 'Prop(s)')
                    }
                >
                    {data.dlc
                        .map((name, index) => ({ name, index }))
                        .map(elem => (
                            <MenuItemSelectOption
                                value={elem.index}
                                key={'dlc_' + elem.index}
                                helper={elem.name || 'base'}
                            >
                                {elem.name || 'base'}
                            </MenuItemSelectOption>
                        ))}
                </MenuItemSelect>
                <MenuItemSelect
                    key={state.fieldIndex + 'dlc' + state.dlcIndex + 'drawable'}
                    title={ClothingFields[state.fieldIndex].type == 'comp' ? `Drawable` : 'Prop'}
                    titleWidth={30}
                    disabled={Object.values(data.data[state.dlcIndex][state.fieldIndex]).length <= 0}
                    value={state.drawable}
                    onSelected={() => {
                        setSelected(2);
                    }}
                    syncValue
                    onChange={index => {
                        const valueStr = Object.keys(data.data[state.dlcIndex][state.fieldIndex])[index];
                        const value = parseInt(valueStr);
                        if (value != null && value != state.drawable && selected == 2) {
                            update(
                                {
                                    drawable: value,
                                    texture: 0,
                                },
                                false
                            );
                        }
                    }}
                    description={data.data[state.dlcIndex][state.fieldIndex][state.drawable] + ' Textures'}
                >
                    {Object.keys(data.data[state.dlcIndex][state.fieldIndex]).map((value, index) => (
                        <MenuItemSelectOption value={index} key={'drawable_' + value}>
                            {value}
                        </MenuItemSelectOption>
                    ))}
                </MenuItemSelect>
                <MenuItemSelect
                    key={state.fieldIndex + 'dlc' + state.dlcIndex + 'drawable' + state.drawable}
                    title={'Texture'}
                    titleWidth={30}
                    disabled={
                        Object.values(data.data[state.dlcIndex][state.fieldIndex]).length <= 0 ||
                        !data.data[state.dlcIndex][state.fieldIndex][state.drawable]
                    }
                    onSelected={() => {
                        setSelected(3);
                    }}
                    syncValue
                    value={state.texture}
                    onChange={index => {
                        if (index != state.texture && selected == 3) {
                            update(
                                {
                                    texture: index,
                                },
                                false
                            );
                        }
                    }}
                >
                    {data.data[state.dlcIndex][state.fieldIndex][state.drawable] &&
                        Array(data.data[state.dlcIndex][state.fieldIndex][state.drawable])
                            .fill(0)
                            .map((_, index) => (
                                <MenuItemSelectOption value={index} key={'texture' + index}>
                                    {index}
                                </MenuItemSelectOption>
                            ))}
                </MenuItemSelect>
            </MenuContent>
        </SubMenu>
    );
};

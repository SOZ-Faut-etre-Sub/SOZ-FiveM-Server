import { FunctionComponent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ObjectEffects } from '../../../shared/animation';
import { NuiEvent } from '../../../shared/event/nui';
import { JobType } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { EditorMenuData } from '../../../shared/object';
import { fetchNui } from '../../fetch';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemText,
    MenuTitle,
} from '../Styleguide/Menu';

type MenuAlbumProps = {
    data: EditorMenuData;
};

export const MenuEditorObject: FunctionComponent<MenuAlbumProps> = ({ data }) => {
    const navigate = useNavigate();
    const [collision, setCollision] = useState(data.collision);

    if (!data) {
        return null;
    }

    let banner = 'https://soz.zerator.com/static/game/images/banner/soz_hammer.webp';

    if (data.context === 'admin') {
        banner = 'https://nui-img/soz/menu_mapper';
    } else if (data.context === JobType.Gouv) {
        banner = 'https://nui-img/soz/menu_job_gouv';
    }

    return (
        <Menu type={MenuType.ObjectEditor}>
            <MainMenu>
                <MenuTitle banner={banner}>Edition d'objet</MenuTitle>
                <MenuContent>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.ObjectEditorSave);
                            navigate(-1);
                        }}
                    >
                        ✔️ Valider le placement
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.ObjectEditorCancel);
                            navigate(-1);
                        }}
                    >
                        ❌ Annuler
                    </MenuItemButton>
                    {data.allowDelete && (
                        <MenuItemButton
                            onConfirm={() => {
                                fetchNui(NuiEvent.ObjectEditorDelete);
                                navigate(-1);
                            }}
                        >
                            ❌ Supprimer l'objet
                        </MenuItemButton>
                    )}
                    {data.allowToggleSnap && (
                        <MenuItemCheckbox
                            onChange={value => {
                                fetchNui(NuiEvent.ObjectEditorToggleSnap, { value });
                            }}
                            checked={data.snapToGround}
                            description="Aligne le prop sur le sol automatiquement."
                        >
                            ⬇️ Aligner au sol
                        </MenuItemCheckbox>
                    )}
                    {data.allowToggleCollision && (
                        <MenuItemCheckbox
                            onChange={value => {
                                fetchNui(NuiEvent.ObjectEditorToggleCollision, { collision: value });
                                setCollision(value);
                            }}
                            checked={collision}
                            description="Active ou désactive la collision du prop. Si la collision est désactivée, le prop peut être agrandi, réduit, et tourné dans tous les sens."
                        >
                            Activer la collision
                        </MenuItemCheckbox>
                    )}
                    {data.allowTogglePermanent && (
                        <MenuItemCheckbox
                            onChange={value => {
                                fetchNui(NuiEvent.ObjectEditorTogglePermanent, { permanent: value });
                            }}
                            checked={data.permanent}
                            description="Active ou désactive la permanence d'un objet. Si activée, l'objet sera chargé tous le temps."
                        >
                            Objet permanent
                        </MenuItemCheckbox>
                    )}
                    {data.allowAddEffect && (
                        <MenuItemSelect
                            onChange={(_, value) => {
                                fetchNui(NuiEvent.ObjectEditorSetEffect, { effect: value });
                            }}
                            description="Permet de définir un effet sur l'objet."
                            title="Définir un effet"
                            value={data.effect}
                        >
                            <MenuItemSelectOption value={null}>Aucun</MenuItemSelectOption>
                            {Object.keys(ObjectEffects).map(key => {
                                return (
                                    <MenuItemSelectOption key={key} value={key}>
                                        {ObjectEffects[key].name}
                                    </MenuItemSelectOption>
                                );
                            })}
                        </MenuItemSelect>
                    )}
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.ObjectEditorReset, { position: true });
                        }}
                    >
                        🔄 Réinitialiser la position
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.ObjectEditorReset, { rotation: true });
                        }}
                    >
                        🔄 Réinitialiser la rotation
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.ObjectEditorReset, { scale: true });
                        }}
                    >
                        🔄 Réinitialiser l'échelle
                    </MenuItemButton>
                    <MenuItemButton
                        onConfirm={() => {
                            fetchNui(NuiEvent.ObjectEditorReset, { position: true, rotation: true, scale: true });
                        }}
                    >
                        🔄 Réinitialiser tout
                    </MenuItemButton>
                    <MenuTitle>Contrôle du mode editeur</MenuTitle>
                    <MenuItemText> Mode Translation : T</MenuItemText>
                    <MenuItemText> Mode Rotation : R</MenuItemText>
                    {collision && <MenuItemText> Scale impossible si collision activé</MenuItemText>}
                    {!collision && <MenuItemText> Mode Scale : S</MenuItemText>}
                    <MenuItemText> Coordonnées locales : L</MenuItemText>
                    <MenuItemText> Rotation Camera : Clic Droit</MenuItemText>
                    <MenuItemText> Zoom Camera : Clic Droit + Molette</MenuItemText>
                </MenuContent>
            </MainMenu>
        </Menu>
    );
};

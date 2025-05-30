import { PerspectiveCamera, TransformControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { FunctionComponent, memo, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathUtils, Matrix4, Mesh } from 'three';

import { ObjectEffects } from '../../../shared/animation';
import { NuiEvent } from '../../../shared/event/nui';
import { JobLabel, JobType } from '../../../shared/job';
import { MenuType } from '../../../shared/nui/menu';
import { EditorMenuData } from '../../../shared/object';
import { fetchNui } from '../../fetch';
import { useNuiEvent } from '../../hook/nui';
import { gameToGizmoMatrix4, gizmoToGameMatrix4 } from '../../utils/gizmo';
import {
    MainMenu,
    Menu,
    MenuContent,
    MenuItemButton,
    MenuItemCheckbox,
    MenuItemSelect,
    MenuItemSelectOption,
    MenuItemText,
    MenuSubTitle,
    MenuTitle,
} from '../Styleguide/Menu';

type MenuAlbumProps = {
    data: EditorMenuData;
};

export const MenuEditorObject: FunctionComponent<MenuAlbumProps> = ({ data }) => {
    const navigate = useNavigate();
    const mesh = useRef<Mesh>(null!);
    const [collision, setCollision] = useState(data.collision);
    const [editorMode, setEditorMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
    const initialized = useRef(false);
    const [drag, setDrag] = useState<boolean>(false);

    useNuiEvent('object_editor', 'setEntityPosition', ({ matrix }) => {
        if (!mesh.current) {
            return;
        }

        const matrix4 = new Matrix4().fromArray(gameToGizmoMatrix4(matrix));
        mesh.current.position.setFromMatrixPosition(matrix4);
    });

    useEffect(() => {
        if (!drag) {
            fetchNui(NuiEvent.ObjectEditorStopDrag);
        }
    }, [drag]);

    const handleObjectDataUpdate = useCallback((): void => {
        if (!mesh.current) {
            return;
        }

        fetchNui(NuiEvent.ObjectEditorSetPosition, {
            matrix: gizmoToGameMatrix4(mesh.current.matrix.toArray()),
        });
    }, [mesh]);

    const handlePlaceObject = async (duplicate: boolean = false) => {
        await fetchNui(NuiEvent.ObjectEditorSave, {
            duplicate,
        });

        navigate(-1);
    };

    const handleDeleteObject = async () => {
        await fetchNui(NuiEvent.ObjectEditorDelete);
        navigate(-1);
    };

    const handleSnap = () => {
        fetchNui(NuiEvent.ObjectEditorSnap);
    };

    const handleSetName = () => {
        fetchNui(NuiEvent.ObjectEditorSetName);
    };

    const keyHandler = useCallback(
        async (e: KeyboardEvent) => {
            const setRotateMode = 'KeyR';
            const setTranslateMode = 'KeyT';
            const setScaleMode = 'KeyY';
            const snap = 'KeyC';
            const placeProp = 'Space';
            const duplicateProp = 'KeyN';
            const deleteProp = 'Delete';
            const setName = 'KeyB';

            if (e.code === setRotateMode && data.allowRotation) {
                setEditorMode('rotate');
            }

            if (e.code === setTranslateMode) {
                setEditorMode('translate');
            }

            if (e.code === setScaleMode && data.allowScale && !collision) {
                setEditorMode('scale');
            }

            if (e.code === snap && data.allowToggleSnap) {
                handleSnap();
            }

            if (e.code === placeProp) {
                handlePlaceObject();
            }

            if (e.code === duplicateProp && data.allowDuplicate) {
                handlePlaceObject(true);
            }

            if (e.code === deleteProp && data.allowDelete) {
                handleDeleteObject();
            }

            if (e.code === setName) {
                handleSetName();
            }
        },
        [editorMode, data, collision]
    );

    useEffect(() => {
        window.addEventListener('keydown', keyHandler);

        return () => {
            window.removeEventListener('keydown', keyHandler);
        };
    }, [keyHandler]);

    if (!data) {
        return null;
    }

    let menuTitle = 'Hammer';

    if (data.context === 'admin') {
        menuTitle = 'Maper';
    } else if (data.context === JobType.Gouv) {
        menuTitle = JobLabel.gouv;
    }

    return (
        <>
            <Menu type={MenuType.ObjectEditor}>
                <MainMenu>
                    <MenuTitle title={menuTitle} />
                    <MenuContent
                        subtitle="Edition d'objet"
                        helpPanel={<HelpPanel options={data} collision={collision} />}
                    >
                        {data.allowToggleCollision && (
                            <MenuItemCheckbox
                                onChange={value => {
                                    fetchNui(NuiEvent.ObjectEditorToggleCollision, { collision: value });
                                    setCollision(value);

                                    if (value && data.allowScale) {
                                        if (editorMode === 'scale') {
                                            setEditorMode('translate'); // Switch to translate mode if collision is enabled
                                        }

                                        if (mesh.current) {
                                            mesh.current.scale.set(1, 1, 1);
                                            mesh.current.updateMatrix();
                                            handleObjectDataUpdate();
                                        }
                                    }
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
                        {data.allowSetName && (
                            <MenuItemButton
                                onConfirm={handleSetName}
                                description="Définit un identifiant pour l'objet. Il sera utilisé pour le retrouver dans le futur."
                            >
                                🏷️ Définir un identifiant
                            </MenuItemButton>
                        )}
                        <MenuItemButton
                            onConfirm={() => {
                                if (!mesh.current) {
                                    return;
                                }

                                mesh.current.position.set(
                                    data.object.position[0],
                                    data.object.position[2],
                                    -data.object.position[1]
                                );
                                mesh.current.updateMatrix();
                                handleObjectDataUpdate();
                            }}
                            description="Réinitialise la position de l'objet à sa position d'origine."
                        >
                            🔄 Réinitialiser la position
                        </MenuItemButton>
                        {data.allowRotation && (
                            <MenuItemButton
                                onConfirm={() => {
                                    if (!mesh.current) {
                                        return;
                                    }

                                    // set rotation to 0, 0, 0
                                    mesh.current.rotation.set(0, 0, 0);
                                    mesh.current.updateMatrix();
                                    handleObjectDataUpdate();
                                }}
                                description="Réinitialise la rotation sur [0, 0, 0]."
                            >
                                🔄 Réinitialiser la rotation
                            </MenuItemButton>
                        )}
                        {data.allowScale && !collision && (
                            <MenuItemButton
                                onConfirm={() => {
                                    if (!mesh.current) {
                                        return;
                                    }

                                    // set scale to 1, 1, 1
                                    mesh.current.scale.set(1, 1, 1);
                                    mesh.current.updateMatrix();
                                    handleObjectDataUpdate();
                                }}
                                description="Réinitialise l'échelle de l'objet à [1, 1, 1]."
                            >
                                🔄 Réinitialiser l'échelle
                            </MenuItemButton>
                        )}
                    </MenuContent>
                </MainMenu>
            </Menu>
            <Canvas>
                <CameraComponent />
                <Suspense fallback={<p>Loading Gizmo</p>}>
                    <TransformControls
                        onMouseUp={() => setDrag(false)}
                        onMouseDown={() => setDrag(true)}
                        size={0.5}
                        object={mesh}
                        mode={editorMode}
                        translationSnap={0}
                        rotationSnap={0}
                        onObjectChange={handleObjectDataUpdate}
                    />
                    <mesh
                        ref={ref => {
                            if (!initialized.current && ref) {
                                const gizmoMatrix = gameToGizmoMatrix4(data.object.matrix);
                                ref.applyMatrix4(new Matrix4().fromArray(gizmoMatrix));

                                initialized.current = true;
                            }

                            mesh.current = ref;
                        }}
                    />
                </Suspense>
            </Canvas>
        </>
    );
};

const CameraComponent = memo(() => {
    const { camera } = useThree();

    const zRotationHandler = useCallback((t: number, e: number): number => {
        return t > 0 && t < 90 ? e : (t > -180 && t < -90) || t > 0 ? -e : e;
    }, []);

    useNuiEvent('object_editor', 'setCameraPosition', ({ position, rotation }) => {
        camera.position.set(position[0], position[2], -position[1]);
        camera.rotation.order = 'YZX';

        rotation &&
            camera.rotation.set(
                MathUtils.degToRad(rotation[0]),
                MathUtils.degToRad(zRotationHandler(rotation[0], rotation[2])),
                MathUtils.degToRad(rotation[1])
            );

        camera.updateProjectionMatrix();
    });

    return (
        <PerspectiveCamera
            fov={80}
            position={[0, 0, 10]}
            makeDefault
            onUpdate={(self: any) => self.updateProjectionMatrix()}
        />
    );
});

type HelpPanelProps = {
    options: EditorMenuData;
    collision: boolean;
};

const HelpPanel: FunctionComponent<HelpPanelProps> = ({ options, collision }) => {
    return (
        <>
            <MenuSubTitle>Contrôle du mode editeur</MenuSubTitle>
            <MenuItemText> Ctrl : Basculer le mode caméra ou souris</MenuItemText>
            {options.allowRotation && <MenuItemText> R : Mode rotation</MenuItemText>}
            <MenuItemText> T : Mode translation</MenuItemText>
            {options.allowScale && !collision && <MenuItemText> Y : Mode scaling</MenuItemText>}
            <MenuItemText> L : Basculer mode de reférence</MenuItemText>
            {options.allowToggleSnap && <MenuItemText> C : Aligner l'objet ⬇️</MenuItemText>}
            {options.allowSetName && <MenuItemText> B : Définir un identifiant d'objet</MenuItemText>}
            <MenuItemText> Espace : Confirmer et placer l'objet ✔️</MenuItemText>
            {options.allowDuplicate && <MenuItemText> N : Enregistre en tant que nouveau objet ✔️</MenuItemText>}
            {options.allowDelete && <MenuItemText> Suppr : Effacer l'objet sélectionné ❌</MenuItemText>}
        </>
    );
};

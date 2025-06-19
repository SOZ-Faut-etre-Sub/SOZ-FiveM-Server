import { MenuProps, MenuTypeContext } from '@public/nui/components/Styleguide/Menu';
import { fetchNui } from '@public/nui/fetch';
import { useNuiEvent } from '@public/nui/hook/nui';
import { NuiEvent } from '@public/shared/event';
import { MenuType } from '@public/shared/nui/menu';
import { HousingDebugProp } from '@public/shared/object';
import { isOk, Result } from '@public/shared/result';
import { PerspectiveCamera, TransformControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import {
    Dispatch,
    FunctionComponent,
    memo,
    PropsWithChildren,
    SetStateAction,
    Suspense,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MathUtils, Mesh } from 'three';

import { gameToGizmo, gizmoToGame, roundAt } from '../../utils/gizmo';

type GizmoProps = {
    setDebugProp: Dispatch<SetStateAction<HousingDebugProp>>;
    debugProp: HousingDebugProp;
    setPosition: Dispatch<
        SetStateAction<{
            x: string;
            y: string;
            z: string;
            rotX: string;
            rotY: string;
            rotZ: string;
        }>
    >;
    childTextFocus: boolean;
};

type MenuGizmoProps = MenuProps & GizmoProps;

export const MenuGizmo: FunctionComponent<PropsWithChildren<MenuGizmoProps>> = ({
    children,
    type,
    setDebugProp,
    debugProp,
    setPosition,
    childTextFocus,
}) => {
    return (
        <MenuTypeContext.Provider value={type}>
            <>
                <Gizmo
                    setDebugProp={setDebugProp}
                    debugProp={debugProp}
                    setPosition={setPosition}
                    childTextFocus={childTextFocus}
                />
                {children}
            </>
        </MenuTypeContext.Provider>
    );
};

export const Gizmo: FunctionComponent<GizmoProps> = ({ setDebugProp, debugProp, setPosition, childTextFocus }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const mesh = useRef<Mesh>(null!);
    const [drag, setDrag] = useState<boolean>(false);
    const [editorMode, setEditorMode] = useState<'translate' | 'rotate'>('translate');
    const [spaceMode, setSpaceMode] = useState<'local' | 'world'>('local');

    useNuiEvent('gizmo', 'setGizmoEntity', ({ debug }) => {
        setDebugProp(debug);
        if (!debug || !debug.entity || !debug.position || !debug.rotation) {
            return;
        }
        navigate(location.pathname, { replace: true, state: { ...location.state, activeIndex: 0 } });
        navigate(`/${MenuType.HousingPropPlacementMenu}/editor`, { state: { ...location.state, activeIndex: 0 } });

        setPosition({
            x: roundAt(debug.position[0]).toString(),
            y: roundAt(debug.position[1]).toString(),
            z: roundAt(debug.position[2]).toString(),
            rotX: roundAt(debug.rotation[0]).toString(),
            rotY: roundAt(debug.rotation[1]).toString(),
            rotZ: roundAt(debug.rotation[2]).toString(),
        });
        const [position, rotation] = gameToGizmo(debug.position, debug.rotation);

        mesh.current.rotation.order = 'YZX';
        mesh.current.position.set(position[0], position[1], position[2]);
        mesh.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    });

    useNuiEvent(
        'gizmo',
        'SyncDebug',
        ({ debug }) => {
            if (childTextFocus) {
                return;
            }
            setDebugProp(debug);
            setPosition({
                x: roundAt(debug.position[0]).toString(),
                y: roundAt(debug.position[1]).toString(),
                z: roundAt(debug.position[2]).toString(),
                rotX: roundAt(debug.rotation[0]).toString(),
                rotY: roundAt(debug.rotation[1]).toString(),
                rotZ: roundAt(debug.rotation[2]).toString(),
            });

            if (drag) {
                return;
            }

            const [position, rotation] = gameToGizmo(debug.position, debug.rotation);

            mesh.current.position.set(position[0], position[1], position[2]);
            mesh.current.rotation.set(rotation[0], rotation[1], rotation[2], 'YZX');
        },
        [childTextFocus, drag, setDrag]
    );

    const handleObjectDataUpdate = useCallback((): void => {
        const [position, rotation] = gizmoToGame(mesh.current);

        fetchNui(NuiEvent.HousingUpdatePosition, {
            position: position,
            rotation: rotation,
        });
    }, [mesh, debugProp?.entity]);

    const handlePlaceObject = async () => {
        const result: Result<any, never> = await fetchNui(NuiEvent.ValidateHousingPlacement);
        if (isOk(result)) {
            navigate(-1);
        }
    };

    const handleDeleteObject = async () => {
        const result: Result<any, never> = await fetchNui(NuiEvent.RequestDeleteHousingCurrentProp);
        if (isOk(result)) {
            navigate(-1);
        }
    };

    const handleSnap = () => {
        fetchNui(NuiEvent.PropPlacementHousingSnap);
    };

    const handleToggleSpaceMode = () => {
        setSpaceMode(spaceMode === 'local' ? 'world' : 'local');
    };

    const handleToggleEditorMode = () => {
        setEditorMode(editorMode === 'translate' ? 'rotate' : 'translate');
    };

    useNuiEvent('gizmo', 'handlePlaceObject', () => {
        if (!debugProp) {
            return;
        }
        handlePlaceObject();
    });

    useNuiEvent('gizmo', 'handleDeleteObject', () => {
        if (!debugProp) {
            return;
        }
        handleDeleteObject();
    });

    useNuiEvent('gizmo', 'handleSnap', () => {
        if (!debugProp) {
            return;
        }
        handleSnap();
    });

    useNuiEvent('gizmo', 'handleToggleSpaceMode', () => {
        if (!debugProp) {
            return;
        }
        handleToggleSpaceMode();
    });

    useNuiEvent('gizmo', 'handlePlaceObject', () => {
        if (!debugProp) {
            return;
        }
        handlePlaceObject();
    });

    useNuiEvent('gizmo', 'handleToggleEditorMode', () => {
        if (!debugProp) {
            return;
        }
        handleToggleEditorMode();
    });

    const keyHandler = useCallback(
        async (e: KeyboardEvent) => {
            const toogleMode = 'KeyR';
            const toggleSpaceMode = 'KeyL';
            const snap = 'KeyC';
            const placeProp = 'Space';
            const deleteProp = 'Delete';

            if (e.code === toogleMode) {
                handleToggleEditorMode();
            }

            if (e.code === toggleSpaceMode) {
                handleToggleSpaceMode();
            }

            if (e.code === snap) {
                handleSnap();
            }

            if (e.code === placeProp) {
                handlePlaceObject();
            }

            if (e.code === deleteProp) {
                handleDeleteObject();
            }
        },
        [editorMode, spaceMode]
    );

    const mouseHandler = useCallback(
        (event: React.MouseEvent): void => {
            const target = event.target as HTMLElement;
            if (target?.tagName !== 'CANVAS' || event.button !== 0 || drag) {
                return;
            }

            fetchNui(NuiEvent.HousingSelectEntityOnClick);
        },
        [drag]
    );

    const setDragging = useCallback((value: boolean): void => setDrag(value), [drag]);

    useEffect(() => {
        window.addEventListener('keydown', keyHandler);
        window.addEventListener('mousedown', mouseHandler);

        return () => {
            window.removeEventListener('keydown', keyHandler);
            window.removeEventListener('mousedown', mouseHandler);
        };
    }, [mouseHandler, editorMode, setEditorMode, spaceMode, setSpaceMode]);

    useEffect(() => {
        if (drag || !debugProp) {
            return;
        }

        const [position, rotation] = gameToGizmo(debugProp.position, debugProp.rotation);

        mesh.current.position.set(position[0], position[1], position[2]);
        mesh.current.rotation.order = 'YZX';
        mesh.current.rotation.set(rotation[0], rotation[1], rotation[2]);
    }, [drag, setDrag]);

    return (
        <Canvas>
            <CameraComponent />
            <Suspense fallback={<p>Loading Gizmo</p>}>
                {debugProp?.entity && (
                    <TransformControls
                        onMouseUp={() => setDragging(false)}
                        onMouseDown={() => setDragging(true)}
                        space={spaceMode}
                        size={0.5}
                        object={mesh}
                        mode={editorMode}
                        translationSnap={0}
                        rotationSnap={0}
                        onObjectChange={handleObjectDataUpdate}
                    />
                )}
                <mesh ref={mesh} />
            </Suspense>
        </Canvas>
    );
};

const CameraComponent = memo(() => {
    const { camera } = useThree();

    const zRotationHandler = useCallback((t: number, e: number): number => {
        return t > 0 && t < 90 ? e : (t > -180 && t < -90) || t > 0 ? -e : e;
    }, []);

    useNuiEvent('gizmo', 'setCameraPosition', ({ position, rotation }) => {
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

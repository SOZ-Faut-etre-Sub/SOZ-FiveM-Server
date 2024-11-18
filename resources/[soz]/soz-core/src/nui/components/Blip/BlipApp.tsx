import { FunctionComponent, useEffect, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { BlipAction } from '../../../shared/nui/blip';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useOutside } from '../../hook/outside';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

export const BlipApp: FunctionComponent = () => {
    const [actions, setActions] = useState<BlipAction[]>([]);
    const [isPauseMenuActive, setIsPauseMenuActive] = useState(false);
    const [isOver, setIsOver] = useState(false);

    useNuiEvent('blip', 'SetActions', setActions);
    useNuiEvent('global', 'PauseMenuActive', active => {
        if (actions.length > 0 && !active) {
            setActions([]);
        }

        setIsPauseMenuActive(active);
    });

    useNuiFocus(actions.length > 0, actions.length > 0 && isOver, false);

    useEffect(() => {
        if (actions.length > 0) {
            fetchNui(NuiEvent.SetShowCursor, { showCursor: isPauseMenuActive && !isOver });
        } else {
            fetchNui(NuiEvent.SetShowCursor, { showCursor: isPauseMenuActive });
        }
    }, [actions, isOver, isPauseMenuActive]);

    const refOutside = useOutside({
        click: () => setActions([]),
    });

    if (actions.length === 0) {
        return null;
    }

    return (
        <main
            className="absolute flex flex-col items-center inset-0 h-full w-full overflow-hidden"
            style={{ cursor: 'none' }}
        >
            <div className="mt-[52vh]">
                <GlassMorphismContainer>
                    <div ref={refOutside}>
                        {actions.map((action, i) => {
                            return (
                                <div key={i}>
                                    <div
                                        className="flex text-white cursor-pointer items-center justify-between w-full p-2"
                                        onClick={() => {
                                            fetchNui(NuiEvent.BlipAction, {
                                                blipId: action.blipId,
                                                id: action.id,
                                            });
                                        }}
                                        onMouseEnter={() => setIsOver(true)}
                                        onMouseLeave={() => setIsOver(false)}
                                    >
                                        {action.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassMorphismContainer>
            </div>
        </main>
    );
};

import { FunctionComponent, useState } from 'react';

import { NuiEvent } from '../../../shared/event/nui';
import { BlipAction } from '../../../shared/nui/blip';
import { fetchNui } from '../../fetch';
import { useNuiEvent, useNuiFocus } from '../../hook/nui';
import { useOutside } from '../../hook/outside';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

export const BlipApp: FunctionComponent = () => {
    const [actions, setActions] = useState<BlipAction[]>([]);
    const [isOver, setIsOver] = useState(false);

    useNuiEvent('blip', 'SetActions', setActions);
    useNuiEvent('global', 'PauseMenuActive', active => {
        if (!active) {
            setActions([]);
        }
    });

    useNuiFocus(
        actions.length > 0,
        actions.length > 0 && isOver,
        actions.length === 0 || !isOver,
        [],
        false,
        actions.length === 0 || !isOver
    );

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

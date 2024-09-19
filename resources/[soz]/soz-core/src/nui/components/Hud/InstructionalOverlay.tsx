import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';

import { bindKeyToName, BindName } from '../../../shared/utils/bind';
import { useMinimap } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

export function InstructionalOverlay() {
    const minimap = useMinimap();
    const [text, setText] = useState<string[]>([]);

    const styles = useSpring({
        from: {
            opacity: 0,
        },
        to: {
            opacity: 1,
            top: text.length > 0 ? `${100 - minimap.bottom * 100}vh` : '-50vh',
        },
    });

    useNuiEvent('hud', 'SetInstructional', setText);

    return (
        <animated.div className="absolute inset-x-0 -mt-12 flex justify-center" style={styles}>
            <div className="h-10 w-fit">
                <GlassMorphismContainer
                    borderClassName="rounded-full"
                    className="flex items-center gap-2 text-white px-5 py-1.5 w-full h-10"
                >
                    {text.map(t => {
                        if (BindName[t]) {
                            return (
                                <span key={t} className="bg-white/10 border border-slate-300/10 px-2 rounded-md">
                                    {bindKeyToName(BindName[t])}
                                </span>
                            );
                        }
                        return t;
                    })}
                </GlassMorphismContainer>
            </div>
        </animated.div>
    );
}

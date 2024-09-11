import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';

import { BindName } from '../../../shared/utils/bind';
import { useMinimap } from '../../hook/data';
import { useNuiEvent } from '../../hook/nui';
import { GlassMorphismContainer } from '../Styleguide/GlassMorphismContainer';

export function InstructionalOverlay() {
    const minimap = useMinimap();
    const [text, setText] = useState<string[]>([]);

    const styles = useSpring({
        from: {
            opacity: 0,
            top: '-50vh',
        },
        to: {
            opacity: 1,
            top: text.length > 0 ? `${100 - minimap.bottom * 100}vh` : '-50vh',
            left: `${minimap.left * 100}vw`,
        },
    });

    useNuiEvent('hud', 'SetInstructional', setText);

    return (
        <animated.div className="absolute -mt-12" style={styles}>
            <GlassMorphismContainer
                borderClassName="rounded-full"
                className="flex items-center gap-2 text-white px-5 py-1.5 w-full"
            >
                {text.map(t => {
                    if (BindName[t]) {
                        return <span className="bg-white/20 px-2 rounded-md">{BindName[t]}</span>;
                    }
                    return t;
                })}
            </GlassMorphismContainer>
        </animated.div>
    );
}

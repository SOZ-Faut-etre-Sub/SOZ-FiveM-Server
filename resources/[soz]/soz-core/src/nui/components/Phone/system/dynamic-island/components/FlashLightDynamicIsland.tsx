import { animated, useSpring } from '@react-spring/web';
import { useAtom } from 'jotai';
import React from 'react';
import { IoIosFlashlight } from 'react-icons/io';

import { flashLightAtomWithNui } from '../../phone.utils.atom';

export const FlashLightDynamicIsland = () => {
    const [flashLight, setFlashLight] = useAtom(flashLightAtomWithNui);

    const styles = useSpring({
        from: {
            opacity: 0,
            height: 0,
            width: 0,
            left: 60,
        },
        to: {
            opacity: flashLight ? 1 : 0,
            height: flashLight ? 220 : 0,
            width: flashLight ? 220 : 0,
            left: flashLight ? 100 : 200,
        },
    });

    return (
        <animated.div
            className="absolute top-4 flex items-end py-3 px-4 bg-black rounded-3xl cursor-pointer z-50 overflow-hidden"
            style={styles}
            onClick={() => setFlashLight(false)}
        >
            <div className="flex flex-col justify-center items-center gap-3 grow min-w-0">
                <div className="w-0 h-0 border-l-[50px] border-l-transparent border-t-[75px] border-t-white border-r-[50px] border-r-transparent blur-lg" />

                <IoIosFlashlight className="size-12 text-white" />
            </div>
        </animated.div>
    );
};

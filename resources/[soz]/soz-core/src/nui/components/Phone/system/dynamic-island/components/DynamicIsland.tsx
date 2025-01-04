import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';
import { animated, useSpring } from '@react-spring/web';
import { useEffect } from 'react';

import { useDynamicIsland } from '../hooks/useDynamicIsland';

export const DynamicIsland = () => {
    const { data, reset } = useDynamicIsland();

    const styles = useSpring({
        from: {
            width: '0%',
            marginLeft: '50%',
        },
        to: {
            marginLeft: data ? '0%' : '50%',
            width: data ? '100%' : '0%',
            height: data ? '100%' : '0%',
        },
    });

    useEffect(() => {
        const timer = setTimeout(() => reset(), 2000);

        return () => clearTimeout(timer);
    }, [reset]);

    return (
        <div className="absolute top-4 left-1/3 w-1/3 aspect-square z-50 pointer-events-none overflow-hidden">
            <animated.div style={styles} className="flex justify-center items-center bg-black rounded-3xl">
                {data && data.type === 'success' && <CheckCircleIcon className="size-20 text-green-500" />}
                {data && data.type === 'error' && <XCircleIcon className="size-20 text-red-500" />}
            </animated.div>
        </div>
    );
};

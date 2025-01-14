import { PhoneIcon } from '@heroicons/react/solid';
import { animated, useSpring } from '@react-spring/web';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCall } from '../../sim-card/hooks/useCall';

export const CallDynamicIsland = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const { currentCall } = useCall();

    const callModalOpen = pathname === '/call';

    const styles = useSpring({
        from: {
            left: 200,
            opacity: 0,
        },
        to: {
            left: !callModalOpen && currentCall ? 290 : 200,
            opacity: !callModalOpen && currentCall ? 1 : 0,
        },
    });

    return (
        <animated.div
            className="absolute top-4 flex justify-center items-center size-10 bg-black rounded-3xl cursor-pointer z-50"
            onClick={() => navigate('/call')}
            style={styles}
        >
            <PhoneIcon className="size-5 text-green-500" />
        </animated.div>
    );
};

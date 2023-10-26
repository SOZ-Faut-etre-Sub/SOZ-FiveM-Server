import { FunctionComponent, useState } from 'react';

import { useNuiEvent } from '../../hook/nui';
import ZombieIcon from '../../icons/zombie.svg';

export const ZombieOverlay: FunctionComponent = () => {
    const [zombieMode, setZombieMode] = useState(false);
    useNuiEvent('zombie', 'zombie', setZombieMode);

    if (!zombieMode) {
        return null;
    }

    return (
        <div className="fixed right-[10vw] bottom-[1.5rem] text-white/75">
            <div className="breathing-icon-container items-center justify-center flex">
                <ZombieIcon className="w-12 h-12 breathing-icon" />
                <div className="breathing-icon-shadow"></div>
            </div>
        </div>
    );
};

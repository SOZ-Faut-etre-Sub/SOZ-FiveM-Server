import { FunctionComponent } from 'react';

import { useHud } from '../../../hook/data';
import { GlassMorphismBox } from '../../Styleguide/GlassMorphismContainer';

export const Minimap: FunctionComponent = () => {
    const { minimap } = useHud();

    if (minimap.isHidden) {
        return null;
    }

    return (
        <GlassMorphismBox
            className="rounded-lg"
            style={{
                top: `${(minimap.top + 0.01) * 100}vh`,
                height: `${(minimap.height - 0.015) * 100}vh`,
                left: `${(minimap.left + 0.0045) * 100}vw`,
                width: `${minimap.width * 100}vw`,
            }}
        />
    );
};

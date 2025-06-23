import { FunctionComponent, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { GlassMorphismContext } from '../../providers/GlassMorphismProvider';
import { RootState } from '../../store';

interface GlassMorphismProps {
    globalHide: boolean;
}

export const GlassMorphism: FunctionComponent<GlassMorphismProps> = ({ globalHide }) => {
    const gameView = useContext(GlassMorphismContext);

    const glassmorphism = useSelector((state: RootState) => state.hud.useGlassmorphism);

    useEffect(() => {
        if (glassmorphism) {
            gameView.enable();
        } else {
            gameView.disable();
        }
    }, [glassmorphism]);

    useEffect(() => {
        if (globalHide) {
            gameView.hide();
        } else {
            gameView.show();
        }
    }, [globalHide]);

    return (
        <canvas
            ref={ref => gameView.setGameCanvas(ref)}
            className="absolute"
            width={window.innerWidth}
            height={window.innerHeight}
        />
    );
};

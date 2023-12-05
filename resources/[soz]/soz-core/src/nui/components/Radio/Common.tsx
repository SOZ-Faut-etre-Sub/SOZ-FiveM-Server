import { CSSProperties, FunctionComponent } from 'react';

import { Ear } from '../../../shared/voip';

export const displayEar = (ear: Ear) => {
    switch (ear) {
        case Ear.Left:
            return 'L';
        case Ear.Both:
            return 'L/R';
        case Ear.Right:
            return 'R';
    }

    return 'L/R';
};

type RadioButtonProps = {
    onClick: () => void;
    style?: CSSProperties;
};

export const RadioButton: FunctionComponent<RadioButtonProps> = ({ onClick, style }) => {
    return (
        <div
            className="absolute cursor-pointer bg-transparent hover:bg-white/50"
            style={{
                WebkitMaskImage: 'radial-gradient(black, rgba(0,0,0,.1), transparent)',
                maskImage: 'radial-gradient(black, rgba(0,0,0,.1), transparent)',
                transition: 'background-color .2s',
                ...style,
            }}
            onClick={onClick}
        />
    );
};

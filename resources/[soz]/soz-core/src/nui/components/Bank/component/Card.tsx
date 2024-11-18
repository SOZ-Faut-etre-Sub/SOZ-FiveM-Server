import classnames from 'classnames';
import React, { FunctionComponent, HTMLAttributes, PropsWithChildren } from 'react';

import { useHudColor } from '../../Hud/hooks/useHudColor';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card: FunctionComponent<PropsWithChildren<CardProps>> = ({ children, style, className }) => {
    const { card } = useHudColor();

    return (
        <div
            style={{
                ...style,
                backgroundColor: card,
            }}
            className={classnames('py-4 px-5 shadow-sm rounded-xl backdrop-blur-xl', className)}
        >
            {children}
        </div>
    );
};

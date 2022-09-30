import '../styles/index.scss';

import classNames from 'classnames';
import { FunctionComponent, useState } from 'react';

import { useNuiEvent } from '../hook/nui';
import { HealthBookApp } from './HealthBook/HealthBookApp';
import { InputApp } from './Input/InputApp';
import { MenuApp } from './Menu/MenuApp';

export const App: FunctionComponent = () => {
    const [hide, setHide] = useState(false);

    useNuiEvent('global', 'PauseMenuActive', active => {
        setHide(active);
    });

    const classes = classNames('w-full h-full', {
        hidden: hide,
    });

    return (
        <div className={classes}>
            <MenuApp />
            <HealthBookApp />
            <InputApp />
        </div>
    );
};

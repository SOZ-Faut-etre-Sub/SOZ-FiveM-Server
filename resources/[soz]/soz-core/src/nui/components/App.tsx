import '../styles/index.scss';

import classNames from 'classnames';
import { FunctionComponent, useState } from 'react';
import { Provider } from 'react-redux';

import { useNuiEvent } from '../hook/nui';
import { store } from '../store';
import { AudioApp } from './Audio/AudioApp';
import { HealthBookApp } from './HealthBook/HealthBookApp';
import { InputApp } from './Input/InputApp';
import { MenuApp } from './Menu/MenuApp';
import { PanelApp } from './Panel/PanelApp';
import { PlayerApp } from './Player/PlayerApp';
import { ProgressApp } from './Progress/ProgressApp';

export const App: FunctionComponent = () => {
    const [hide, setHide] = useState(false);

    useNuiEvent('global', 'PauseMenuActive', active => {
        setHide(active);
    });

    const classes = classNames('w-full h-full', {
        hidden: hide,
    });

    return (
        <Provider store={store}>
            <div className={classes}>
                <MenuApp />
                <HealthBookApp />
                <InputApp />
                <AudioApp />
                <PlayerApp />
                <ProgressApp />
                <PanelApp />
            </div>
        </Provider>
    );
};

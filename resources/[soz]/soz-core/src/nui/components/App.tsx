import '../styles/index.scss';

import { CraftingApp } from '@private/nui/crafting/CraftingApp';
import { HoodApp } from '@private/nui/hood/HoodApp';
import { MissiveApp } from '@private/nui/missive/MissiveApp';
import { TalentApp } from '@private/nui/Talent/TalentApp';
import classNames from 'classnames';
import { FunctionComponent, useState } from 'react';
import { Provider } from 'react-redux';

import { useNuiEvent } from '../hook/nui';
import { store } from '../store';
import { AudioApp } from './Audio/AudioApp';
import { RepairApp } from './Bennys/RepairApp';
import { HealthBookApp } from './HealthBook/HealthBookApp';
import { InputApp } from './Input/InputApp';
import { MenuApp } from './Menu/MenuApp';
import { PanelApp } from './Panel/PanelApp';
import { BreathAnalyzerApp } from './Police/BreathAnalyzer';
import { RadarApp } from './Police/RadarApp';
import { ProgressApp } from './Progress/ProgressApp';
import { StateApp } from './StateApp';

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
                <StateApp />
                <MenuApp />
                <HealthBookApp />
                <AudioApp />
                <ProgressApp />
                <PanelApp />
                <RepairApp />
                <InputApp />
                <MissiveApp />
                <TalentApp />
                <RadarApp />
                <BreathAnalyzerApp />
                <CraftingApp />
                <HoodApp />
            </div>
        </Provider>
    );
};

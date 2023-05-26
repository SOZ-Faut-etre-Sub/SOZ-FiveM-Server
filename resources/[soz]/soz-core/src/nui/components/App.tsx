import '../styles/index.scss';

import { CraftingApp } from '@private/nui/crafting/CraftingApp';
import { HoodApp } from '@private/nui/hood/HoodApp';
import { MissiveApp } from '@private/nui/missive/MissiveApp';
import { TalentApp } from '@private/nui/Talent/TalentApp';
import classNames from 'classnames';
import { FunctionComponent, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { NuiEvent } from '../../shared/event';
import { fetchNui } from '../fetch';
import { useNuiEvent } from '../hook/nui';
import { store } from '../store';
import { AudioApp } from './Audio/AudioApp';
import { RepairApp } from './Bennys/RepairApp';
import { CardApp } from './Card/CardApp';
import { HudApp } from './Hud/HudApp';
import { InputApp } from './Input/InputApp';
import { MenuApp } from './Menu/MenuApp';
import { PanelApp } from './Panel/PanelApp';
import { BreathAnalyzerApp } from './Police/BreathAnalyzer';
import { RadarApp } from './Police/RadarApp';
import { ProgressApp } from './Progress/ProgressApp';
import { RadioApp } from './Radio/RadioApp';
import { StateApp } from './StateApp';
import { TaxiHorodateurApp } from './Taxi/TaxiHorodateurApp';

export const App: FunctionComponent = () => {
    const [pauseMenuActive, setPauseMenuActive] = useState(false);
    const [hideHud, setHideHud] = useState(false);

    useNuiEvent('global', 'PauseMenuActive', setPauseMenuActive);
    useNuiEvent('global', 'HideHud', setHideHud);

    const classes = classNames('font-prompt transition-all duration-500overflow-hidden', {
        'opacity-0': pauseMenuActive || hideHud,
        'opacity-100': !pauseMenuActive && !hideHud,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            fetchNui(NuiEvent.Ping);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Provider store={store}>
            <StateApp />
            <AudioApp />
            <div className={classes}>
                <HudApp />
                <CardApp />
            </div>
            <div className="font-prompt overflow-hidden">
                <MenuApp />
            </div>
            <div className={classes}>
                <ProgressApp />
                <PanelApp />
                <RepairApp />
                <MissiveApp />
                <RadarApp />
                <RadioApp />
                <BreathAnalyzerApp />
                <HoodApp />
                <TaxiHorodateurApp />
                <TalentApp />
                <CraftingApp />
                <InputApp />
            </div>
        </Provider>
    );
};

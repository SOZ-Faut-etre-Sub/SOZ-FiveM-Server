import '../styles/index.scss';

import { CraftingApp } from '@private/nui/crafting/CraftingApp';
import { DrugContractApp } from '@private/nui/drug/DrugContractApp';
import { DrugSkillApp } from '@private/nui/drug/DrugSkillApp';
import { FishingApp } from '@private/nui/fishing/FishingApp';
import { HoodApp } from '@private/nui/hood/HoodApp';
import { MissiveApp } from '@private/nui/missive/MissiveApp';
import { StatePrivateApp } from '@private/nui/StatePrivateApp';
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
import { SozedexApp } from './Fishing/SozedexApp';
import { HudApp } from './Hud/HudApp';
import { InputApp } from './Input/InputApp';
import { MenuApp } from './Menu/MenuApp';
import { PanelApp } from './Panel/PanelApp';
import { BreathAnalyzerApp } from './Police/BreathAnalyzer';
import { RadarApp } from './Police/RadarApp';
import { ProgressApp } from './Progress/ProgressApp';
import { RadioApp } from './Radio/RadioApp';
import { RadioVehicleApp } from './Radio/RadioVehicleApp';
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

    const menuClasses = classNames('font-prompt overflow-hidden', {
        'opacity-0': pauseMenuActive,
        'opacity-100': !pauseMenuActive,
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
            <StatePrivateApp />
            <AudioApp />
            <div className={classes}>
                <HudApp />
                <CardApp />
            </div>
            <div className={menuClasses}>
                <MenuApp />
            </div>
            <div className={classes}>
                <ProgressApp />
                <PanelApp />
                <RepairApp />
                <MissiveApp />
                <DrugContractApp />
                <RadarApp />
                <RadioApp />
                <RadioVehicleApp />
                <BreathAnalyzerApp />
                <HoodApp />
                <TaxiHorodateurApp />
                <TalentApp />
                <CraftingApp />
                <FishingApp />
                <InputApp />
                <SozedexApp />
                <DrugSkillApp />
            </div>
        </Provider>
    );
};

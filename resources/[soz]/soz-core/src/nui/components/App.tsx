import '../styles/index.scss';

import { CraftingApp } from '@private/nui/crafting/CraftingApp';
import { DrugContractApp } from '@private/nui/drug/DrugContractApp';
import { DrugSkillApp } from '@private/nui/drug/DrugSkillApp';
import { DrugTransformApp } from '@private/nui/drug/DrugTransformApp';
import { FishingApp } from '@private/nui/fishing/FishingApp';
import { BusinessCyberApp } from '@private/nui/gang/BusinessCyber/BusinessCyberApp';
import { CyberReportApp } from '@private/nui/gang/BusinessCyber/ReportApp';
import { BusinessSmugglingPrintApp } from '@private/nui/gang/BusinessSmuggling/BusinessSmugglingPrintApp/BusinessSmugglingPrintApp';
import { BusinessVehicleMappingApp } from '@private/nui/gang/BusinessVehicle/BusinessVehicleMapping';
import { BusinessVehicleOrderApp } from '@private/nui/gang/BusinessVehicle/BusinessVehicleOrderApp';
import { ArchetypesPresentationsApp } from '@private/nui/group/ArchetypesPresentationsApp';
import { BusinessManagementApp } from '@private/nui/group/BusinessManagementApp';
import { HackingDeviceApp } from '@private/nui/hacking/HackingDeviceApp';
import { HoodApp } from '@private/nui/hood/HoodApp';
import { ArrowsMinigameApp } from '@private/nui/minigames/arrows/ArrowsMinigameApp';
import { GridMinigameApp } from '@private/nui/minigames/grid/GridMinigameApp';
import { PincrakerMinigameApp } from '@private/nui/minigames/pincraker/PincrakerMinigameApp';
import { MissiveApp } from '@private/nui/missive/MissiveApp';
import { DetectiveBoard } from '@private/nui/Police/DetectiveBoard';
import { ScientistCamera } from '@private/nui/Police/ScientistCamera';
import { ScientistPhoto } from '@private/nui/Police/ScientistPhoto';
import { SozedexApp } from '@private/nui/sozedex/SozedexApp';
import { StatePrivateApp } from '@private/nui/StatePrivateApp';
import { TalentApp } from '@private/nui/Talent/TalentApp';
import classNames from 'classnames';
import { FunctionComponent, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { NuiEvent } from '../../shared/event';
import { fetchNui } from '../fetch';
import { useNuiEvent } from '../hook/nui';
import { useInterval } from '../hook/useInterval';
import { GlassMorphismProvider } from '../providers/GlassMorphismProvider';
import { store } from '../store';
import { AudioApp } from './Audio/AudioApp';
import { AtmApp } from './Bank/AtmApp';
import { BankApp } from './Bank/BankApp';
import { SafeApp } from './Bank/SafeApp';
import { RepairApp } from './Bennys/RepairApp';
import { BlipApp } from './Blip/BlipApp';
import { BookApp } from './Book/BookApp';
import { CardApp } from './Card/CardApp';
import { CraftApp } from './Craft/CraftApp';
import { FieldHealthApp } from './Field/FieldHealthApp';
import { FieldZoneHealthApp } from './Field/FieldZoneHealthApp';
import { HudApp } from './Hud/HudApp';
import { InputApp } from './Input/InputApp';
import { InventoryApp } from './Inventory/InventoryApp';
import { KeychainApp } from './Inventory/KeychainApp';
import { PlayerInventoryApp } from './Inventory/PlayerInventoryApp';
import { ShopCartApp } from './Inventory/ShopCartApp';
import { WalletApp } from './Inventory/WalletApp';
import { MedicalApp } from './LSMC/DiagnosticPad/MedicalApp';
import { MenuApp } from './Menu/MenuApp';
import { PanelApp } from './Panel/PanelApp';
import { MapPickerApp } from './Picker/MapPickerApp';
import { BreathAnalyzerApp } from './Police/BreathAnalyzer';
import { DrugScreeningApp } from './Police/DrugScreeningApp';
import { RadarApp } from './Police/RadarApp';
import { ProgressApp } from './Progress/ProgressApp';
import { RaceApp } from './Race/RaceApp';
import { RadioApp } from './Radio/RadioApp';
import { RadioVehicleApp } from './Radio/RadioVehicleApp';
import { SceneSearchPropApp } from './Scene/SceneSearchPropApp';
import { StateApp } from './StateApp';
import { GlassMorphism } from './Styleguide/GlassMorphism';
import { TargetOverlay } from './Target/TargetOverlay';
import { TaxiHorodateurApp } from './Taxi/TaxiHorodateurApp';
import { Election } from './World/Election';
import { Meteor } from './World/Meteor';

export const App: FunctionComponent = () => {
    const [pauseMenuActive, setPauseMenuActive] = useState(false);
    const [hideHud, setHideHud] = useState(false);

    useNuiEvent('global', 'PauseMenuActive', setPauseMenuActive);
    useNuiEvent('global', 'HideHud', setHideHud);

    const classes = classNames('font-prompt transition-all duration-500', {
        'opacity-0': pauseMenuActive || hideHud,
        'opacity-100': !pauseMenuActive && !hideHud,
    });

    const menuClasses = classNames('font-prompt overflow-hidden', {
        'opacity-0': pauseMenuActive,
        'opacity-100': !pauseMenuActive,
    });

    useEffect(() => {
        store.dispatch.api.loadApi();
    }, []);

    useInterval(async () => {
        await fetchNui(NuiEvent.Ping);
    }, 1000);

    return (
        <GlassMorphismProvider>
            <Provider store={store}>
                <StateApp />
                <StatePrivateApp />
                <AudioApp />
                <GlassMorphism globalHide={pauseMenuActive || hideHud} />
                <div className={classes}>
                    <MapPickerApp />
                    <TargetOverlay />
                    <HudApp />
                    <CardApp />
                    <ProgressApp />
                </div>
                <div className={menuClasses}>
                    <MenuApp />
                    <PlayerInventoryApp />
                    <InventoryApp />
                    <KeychainApp />
                    <WalletApp />
                    <ShopCartApp />
                </div>
                <div className={classes}>
                    <PanelApp />
                    <SceneSearchPropApp />
                    <RepairApp />
                    <MissiveApp />
                    <DrugContractApp />
                    <RadarApp />
                    <RadioApp />
                    <RadioVehicleApp />
                    <BreathAnalyzerApp />
                    <DrugScreeningApp />
                    <DetectiveBoard />
                    <ScientistCamera />
                    <ScientistPhoto />
                    <HoodApp />
                    <TaxiHorodateurApp />
                    <TalentApp />
                    <CraftingApp />
                    <FishingApp />
                    <SozedexApp />
                    <DrugSkillApp />
                    <DrugTransformApp />
                    <RaceApp />
                    <BookApp />
                    <FieldHealthApp />
                    <FieldZoneHealthApp />
                    <CraftApp />
                    <MedicalApp />
                    <BankApp />
                    <AtmApp />
                    <SafeApp />
                    <BusinessManagementApp />
                    <BusinessVehicleOrderApp />
                    <BusinessCyberApp />
                    <BusinessSmugglingPrintApp />
                    <ArchetypesPresentationsApp />
                    <HackingDeviceApp />
                    <ArrowsMinigameApp />
                    <GridMinigameApp />
                    <BusinessVehicleMappingApp />
                    <CyberReportApp />
                    <PincrakerMinigameApp />
                    <InputApp />
                </div>
                <Meteor />
                <Election />
                <BlipApp />
            </Provider>
        </GlassMorphismProvider>
    );
};

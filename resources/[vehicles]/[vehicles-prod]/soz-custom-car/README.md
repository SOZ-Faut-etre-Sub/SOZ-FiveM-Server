# Carcols

1026 : OK
1027 : OK
1028 : OK
1029 : OK
1030 : OK
1031 : OK
1032 : NOK
09/08/2025 : next one 1033_XXX_modkit

# Sounds

Test de son pour modifier les noms des sons veh custom en lore friendly

## Elegys

En dessous, les descriptions complètes d'une méthodologie de sons et leurs configurations

### audio/elegys_game.dat151.rel

Cette partie indique la nomenclature du son appelé par GTA (Name), le nom de la propriété du moteur (Engine) et le granulaire (GranularEngine)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Dat151>
    <Version value="31554421" />
    <Items>
        <Item type="ScannerVehicleParams" ntOffset="7932">
            <Name>hash_AED15A2E</Name>
            <Flags value="0xAAAAAAA8" />
            <Params>
                <Item>
                    <Manufacturer>police_scanner_manufacturer_karin_b</Manufacturer>
                    <Model>police_scanner_model_futo_b</Model>
                    <Category>police_scanner_vehicle_category_2door_b</Category>
                    <ColorOverride>null_sound</ColorOverride>
                </Item>
            </Params>
        </Item>
        <Item type="CarAudioSettings" ntOffset="7953">
            <Name>elegys</Name>
            <Flags value="0x91004A68" />
            <Engine>elegys_engine</Engine>
            <GranularEngine>elegys_granular</GranularEngine>
            <HornSounds>horn_list_old</HornSounds>
            <DoorOpenSound>hash_D3BC6F43</DoorOpenSound>
            <DoorCloseSound>hash_692113F2</DoorCloseSound>
            <BootOpenSound>vehicles_extras_old_saloon_trunk_open</BootOpenSound>
            <BootCloseSound>vehicles_extras_old_saloon_trunk_close</BootCloseSound>
            <RollSound>null_sound</RollSound>
            <BrakeSqueekFactor value="0.5" />
            <SuspensionUp>pneumatic_suspension_up</SuspensionUp>
            <SuspensionDown>pneumatic_suspension_down</SuspensionDown>
            <MinSuspCompThresh value="0.4" />
            <MaxSuspCompThresh value="1" />
            <VehicleCollisions>vehicle_collision_car</VehicleCollisions>
            <CarMake value="0" />
            <CarModel value="0" />
            <CarCategory value="0" />
            <ScannerVehicleSettings>hash_AED15A2E</ScannerVehicleSettings>
            <JumpLandSound>jump_land_intact</JumpLandSound>
            <DamagedJumpLandSound>jump_land_loose</DamagedJumpLandSound>
            <JumpLandMinThresh value="31" />
            <JumpLandMaxThresh value="36" />
            <VolumeCategory value="1" />
            <GPSType value="0" />
            <RadioType value="1" />
            <RadioGenre value="10" />
            <IndicatorOn>null_sound</IndicatorOn>
            <IndicatorOff>null_sound</IndicatorOff>
            <Handbrake>vehicles_extras_sports_handbrake</Handbrake>
            <GPSVoice value="0" />
            <AmbientRadioVol value="0" />
            <RadioLeakage value="1" />
            <ParkingTone>parking_tones</ParkingTone>
            <RoofStuckSound>automatic_roof_broken</RoofStuckSound>
            <FreewayPassbyTyreBumpFront>highway_passby_tyre_bump</FreewayPassbyTyreBumpFront>
            <FreewayPassbyTyreBumpBack>highway_passby_tyre_bump</FreewayPassbyTyreBumpBack>
            <FireAudio>veh_fire_soundset</FireAudio>
            <StartupRevs>hash_10FE3242</StartupRevs>
            <WindNoise>null_sound</WindNoise>
            <FreewayPassbyTyreBumpFrontSide>highway_passby_tyre_bump_side</FreewayPassbyTyreBumpFrontSide>
            <FreewayPassbyTyreBumpBackSide>highway_passby_tyre_bump_side</FreewayPassbyTyreBumpBackSide>
            <MaxRollOffScalePlayer value="6" />
            <MaxRollOffScaleNPC value="3" />
            <ConvertibleRoofSoundSet />
            <OffRoadRumbleSoundVolume value="0" />
            <SirenSounds />
            <AlternativeGranularEngines />
            <AlternativeGranularEngineProbability value="0" />
            <StopStartProb value="0" />
            <NPCRoadNoise>npc_roadnoise_passes_default</NPCRoadNoise>
            <NPCRoadNoiseHighway>npc_roadnoise_passes_default_highways</NPCRoadNoiseHighway>
            <ForkliftSounds />
            <TurretSounds />
            <ClatterType value="8" />
            <DiggerSounds />
            <TowTruckSounds />
            <EngineType value="0" />
            <ElectricEngine />
            <Openness value="0" />
            <ReverseWarning>null_sound</ReverseWarning>
            <RandomDamage value="3" />
            <WindClothSound>null_sound</WindClothSound>
            <CarSpecificShutdownSound>null_sound</CarSpecificShutdownSound>
            <ClatterSensitivityScalar value="1" />
            <ClatterVolumeBoost value="0" />
            <ChassisStressSensitivityScalar value="1" />
            <ChassisStressVolumeBoost value="0" />
            <VehicleRainSound>null_sound</VehicleRainSound>
            <AdditionalRevsIncreaseSmoothing value="20" />
            <AdditionalRevsDecreaseSmoothing value="0" />
            <AdditionalGearChangeSmoothing value="0" />
            <AdditionalGearChangeSmoothingTime value="0" />
            <ConvertibleRoofInteriorSoundSet />
            <VehicleRainSoundInterior>null_sound</VehicleRainSoundInterior>
            <CabinToneLoop />
            <InteriorViewEngineOpenness value="0" />
            <JumpLandSoundInterior>null_sound</JumpLandSoundInterior>
            <DamagedJumpLandSoundInterior>null_sound</DamagedJumpLandSoundInterior>
        </Item>
        <Item type="VehicleEngineAudioSettings" ntOffset="7959">
            <Name>elegys_engine</Name>
            <MasterVolume value="-100" />
            <MaxConeAttenuation value="-200" />
            <FXCompensation value="500" />
            <NonPlayerFXComp value="600" />
            <LowEngineLoop>vehicles_engine_resident_muscle_car_3_engine_low</LowEngineLoop>
            <HighEngineLoop>vehicles_engine_resident_muscle_car_3_engine_high</HighEngineLoop>
            <LowExhaustLoop>vehicles_engine_resident_muscle_car_3_exhaust_low</LowExhaustLoop>
            <HighExhaustLoop>vehicles_engine_resident_muscle_car_3_exhaust_high</HighExhaustLoop>
            <RevsOffLoop>vehicles_engine_resident_muscle_car_3_revs_off</RevsOffLoop>
            <MinPitch value="-600" />
            <MaxPitch value="1350" />
            <IdleEngineSimpleLoop>vehicles_engine_resident_muscle_car_3_eng_idle_loop</IdleEngineSimpleLoop>
            <IdleExhaustSimpleLoop>vehicles_engine_resident_muscle_car_3_ex_idle_loop</IdleExhaustSimpleLoop>
            <IdleMinPitch value="-400" />
            <IdleMaxPitch value="1200" />
            <InductionLoop />
            <InductionMinPitch value="0" />
            <InductionMaxPitch value="0" />
            <TurboWhine>hash_D8B7CCBB</TurboWhine>
            <TurboMinPitch value="-600" />
            <TurboMaxPitch value="600" />
            <DumpValve>hash_E5994767</DumpValve>
            <DumpValveProb value="100" />
            <TurboSpinupSpeed value="70" />
            <GearTransLoop>vehicles_engine_resident_gear_transmission</GearTransLoop>
            <GearTransMinPitch value="0" />
            <GearTransMaxPitch value="2400" />
            <GTThrottleVol value="400" />
            <Ignition>ignition</Ignition>
            <EngineShutdown>hash_D2B3AF8A</EngineShutdown>
            <CoolingFan>null_sound</CoolingFan>
            <ExhaustPops>hash_D9560186</ExhaustPops>
            <StartLoop>streamed_vehicles_muscle_car_3_muscle_car_3_start_dist</StartLoop>
            <MasterTurboVolume value="0" />
            <MasterTransmissionVolume value="0" />
            <EngineStartUp>hash_DF019CF1</EngineStartUp>
            <EngineSynthDef />
            <EngineSynthPreset />
            <ExhaustSynthDef />
            <ExhaustSynthPreset />
            <EngineSubmixVoice>default_car_engine_submix_control</EngineSubmixVoice>
            <ExhaustSubmixVoice>default_car_exhaust_submix_control</ExhaustSubmixVoice>
            <UpgradedTransmissionVolumeBoost value="400" />
            <UpgradedGearChangeInt>gear_change_upgrade_int</UpgradedGearChangeInt>
            <UpgradedGearChangeExt>gear_change_upgrade_ext</UpgradedGearChangeExt>
            <UpgradedEngineVolumeBoost_PostSubmix value="0" />
            <UpgradedEngineSynthDef value="0" />
            <UpgradedEngineSynthPreset value="0" />
            <UpgradedExhaustVolumeBoost_PostSubmix value="0" />
            <UpgradedExhaustSynthDef value="0" />
            <UpgradedExhaustSynthPreset value="0" />
            <UpgradedDumpValve>hash_E5994767</UpgradedDumpValve>
            <UpgradedTurboVolumeBoost value="700" />
            <UpgradedGearTransLoop>null_sound</UpgradedGearTransLoop>
            <UpgradedTurboWhine>hash_D8B7CCBB</UpgradedTurboWhine>
            <UpgradedInductionLoop>hash_6CD32CA1</UpgradedInductionLoop>
            <UpgradedExhaustPops>hash_D9560186</UpgradedExhaustPops>
        </Item>
        <Item type="GranularEngineAudioSettings" ntOffset="7972">
            <Name>elegys_granular</Name>
            <Flags value="0xAAAAA955" />
            <MasterVolume value="425" />
            <EngineAccel>hash_B60BBF69</EngineAccel>
            <ExhaustAccel>hash_D3E61903</ExhaustAccel>
            <EngineVolume_PreSubmix value="0" />
            <ExhaustVolume_PreSubmix value="0" />
            <AccelVolume_PreSubmix value="0" />
            <DecelVolume_PreSubmix value="0" />
            <IdleVolume_PreSubmix value="0" />
            <EngineRevsVolume_PreSubmix value="0" />
            <ExhaustRevsVolume_PreSubmix value="0" />
            <EngineThrottleVolume_PreSubmix value="0" />
            <ExhaustThrottleVolume_PreSubmix value="0" />
            <EngineVolume_PostSubmix value="550" />
            <ExhaustVolume_PostSubmix value="600" />
            <EngineMaxConeAttenuation value="-250" />
            <ExhaustMaxConeAttenuation value="-250" />
            <EngineRevsVolume_PostSubmix value="550" />
            <ExhaustRevsVolume_PostSubmix value="600" />
            <EngineThrottleVolume_PostSubmix value="0" />
            <ExhaustThrottleVolume_PostSubmix value="0" />
            <GearChangeWobbleLength value="50" />
            <GearChangeWobbleLengthVariance value="0.3" />
            <GearChangeWobbleSpeed value="0.175" />
            <GearChangeWobbleSpeedVariance value="0.2" />
            <GearChangeWobblePitch value="0.1" />
            <GearChangeWobblePitchVariance value="0.3" />
            <GearChangeWobbleVolume value="0.35" />
            <GearChangeWobbleVolumeVariance value="0.2" />
            <EngineClutchAttenuation_PostSubmix value="0" />
            <ExhaustClutchAttenuation_PostSubmix value="0" />
            <EngineSynthDef>toros_engine_submix</EngineSynthDef>
            <EngineSynthPreset>toros_engine_submix_preset</EngineSynthPreset>
            <ExhaustSynthDef>imperator_exhaust_transients_and_eq</ExhaustSynthDef>
            <ExhaustSynthPreset>imperator_exhaust_transients_and_eq_preset</ExhaustSynthPreset>
            <NPCEngineAccel>hash_39A042E8</NPCEngineAccel>
            <NPCExhaustAccel>hash_D3E61903</NPCExhaustAccel>
            <RevLimiterPopSound>hash_F40FCFAA</RevLimiterPopSound>
            <MinRPMOverride value="0" />
            <MaxRPMOverride value="0" />
            <EngineSubmixVoice>default_car_engine_submix_control</EngineSubmixVoice>
            <ExhaustSubmixVoice>default_car_exhaust_submix_control</ExhaustSubmixVoice>
            <ExhaustProximityVolume_PostSubmix value="200" />
            <RevLimiterGrainsToPlay value="5" />
            <RevLimiterGrainsToSkip value="2" />
            <SynchronisedSynth>hash_4D647323</SynchronisedSynth>
            <UpgradedEngineVolumeBoost_PostSubmix value="-100" />
            <UpgradedEngineSynthDef />
            <UpgradedEngineSynthPreset />
            <UpgradedExhaustVolumeBoost_PostSubmix value="100" />
            <UpgradedExhaustSynthDef />
            <UpgradedExhaustSynthPreset />
            <DamageSynthHashList>default_granular_damage_synth_list</DamageSynthHashList>
            <UpgradedRevLimiterPop>hash_D9560186</UpgradedRevLimiterPop>
            <EngineIdleVolume_PostSubmix value="0" />
            <ExhaustIdleVolume_PostSubmix value="0" />
            <StartupRevsVolumeBoostEngine_PostSubmix value="500" />
            <StartupRevsVolumeBoostExhaust_PostSubmix value="500" />
            <RevLimiterApplyType value="1" />
            <RevLimiterVolumeCut value="0.2" />
        </Item>
    </Items>
</Dat151>
```

Attention, Engine et GranularEngine sont des propriétés présentes dans le fichier (si existant) pour les propriétés sonores.

Nom du véhicule, nom du moteur, nom du granulaire.

```xml
        <Item type="CarAudioSettings" ntOffset="7953">
            <Name>elegys</Name>
            <Flags value="0x91004A68" />
            <Engine>elegys_engine</Engine>
            <GranularEngine>elegys_granular</GranularEngine>
```

Zone de configuration du granulaire

```xml
<Item type="GranularEngineAudioSettings" ntOffset="7972">
   <Name>elegys_granular</Name>
```

Zone de configuration du moteur

```xml
  <Item type="VehicleEngineAudioSettings" ntOffset="7959">
   <Name>elegys_engine</Name>
```


### audio/elegys_sounds.dat54.rel

Cette partie indique les sons qui seront chargé en mémoire pour indiquer quels sont les fichiers .awc contenant les sons à l'intérieur.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Dat54>
    <Version value="31554421" />
    <ContainerPaths>
        <Item>0</Item>
        <Item>RESIDENT\VEHICLES</Item>
        <Item>DLC_ELEGYS\elegys</Item>
        <Item>DLC_ELEGYS\elegys_NPC</Item>
    </ContainerPaths>
    <Items>
        <Item type="GranularSound">
            <Name>hash_B60BBF69</Name>
            <Header>
                <Flags value="0x00008011" />
                <Flags2 value="0x9555AAAA" />
                <Pitch value="0" />
                <Category>vehicles_engines</Category>
            </Header>
            <WaveSlotIndex value="0" />
            <Channel0>
                <ContainerName>dlc_elegys/elegys</ContainerName>
                <FileName>engine_accel</FileName>
            </Channel0>
            <Channel1>
                <ContainerName>dlc_elegys/elegys</ContainerName>
                <FileName>exhaust_accel</FileName>
            </Channel1>
            <Channel2>
                <ContainerName>dlc_elegys/elegys</ContainerName>
                <FileName>engine_decel</FileName>
            </Channel2>
            <Channel3>
                <ContainerName>dlc_elegys/elegys</ContainerName>
                <FileName>exhaust_decel</FileName>
            </Channel3>
            <Channel4>
                <ContainerName>dlc_elegys/elegys</ContainerName>
                <FileName>engine_idle</FileName>
            </Channel4>
            <Channel5>
                <ContainerName>dlc_elegys/elegys</ContainerName>
                <FileName>exhaust_idle</FileName>
            </Channel5>
            <ChannelSettings0>
                <OutputBuffer value="0" />
                <GranularClockIndex value="0" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="0" />
                <MaxLoopProportion value="0.5" />
            </ChannelSettings0>
            <ChannelSettings1>
                <OutputBuffer value="1" />
                <GranularClockIndex value="0" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="0" />
                <MaxLoopProportion value="0.5" />
            </ChannelSettings1>
            <ChannelSettings2>
                <OutputBuffer value="0" />
                <GranularClockIndex value="0" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="1" />
                <MaxLoopProportion value="1" />
            </ChannelSettings2>
            <ChannelSettings3>
                <OutputBuffer value="1" />
                <GranularClockIndex value="0" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="1" />
                <MaxLoopProportion value="1" />
            </ChannelSettings3>
            <ChannelSettings4>
                <OutputBuffer value="0" />
                <GranularClockIndex value="1" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="0" />
                <MaxLoopProportion value="1" />
            </ChannelSettings4>
            <ChannelSettings5>
                <OutputBuffer value="1" />
                <GranularClockIndex value="1" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="0" />
                <MaxLoopProportion value="1" />
            </ChannelSettings5>
            <LoopRandomisationChangeRate value="0.01" />
            <LoopRandomisationPitchFraction value="0.05" />
            <ChannelVolume0 value="300" />
            <ChannelVolume1 value="400" />
            <ChannelVolume2 value="300" />
            <ChannelVolume3 value="400" />
            <ChannelVolume4 value="-900" />
            <ChannelVolume5 value="300" />
            <ParentSound />
            <GranularClock>
                14, 65
                12.31, 12.35
            </GranularClock>
        </Item>
        <Item type="GranularSound">
            <Name>hash_39A042E8</Name>
            <Header>
                <Flags value="0x00008011" />
                <Flags2 value="0x9555AAAA" />
                <Pitch value="0" />
                <Category>vehicles_engines</Category>
            </Header>
            <WaveSlotIndex value="0" />
            <Channel0>
                <ContainerName>dlc_elegys/elegys_npc</ContainerName>
                <FileName>engine_accel</FileName>
            </Channel0>
            <Channel1>
                <ContainerName>dlc_elegys/elegys_npc</ContainerName>
                <FileName>exhaust_accel</FileName>
            </Channel1>
            <Channel2>
                <ContainerName>0</ContainerName>
                <FileName />
            </Channel2>
            <Channel3>
                <ContainerName>0</ContainerName>
                <FileName />
            </Channel3>
            <Channel4>
                <ContainerName>dlc_elegys/elegys_npc</ContainerName>
                <FileName>engine_idle</FileName>
            </Channel4>
            <Channel5>
                <ContainerName>dlc_elegys/elegys_npc</ContainerName>
                <FileName>exhaust_idle</FileName>
            </Channel5>
            <ChannelSettings0>
                <OutputBuffer value="0" />
                <GranularClockIndex value="0" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="0" />
                <MaxLoopProportion value="0.5" />
            </ChannelSettings0>
            <ChannelSettings1>
                <OutputBuffer value="1" />
                <GranularClockIndex value="0" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="0" />
                <MaxLoopProportion value="0.5" />
            </ChannelSettings1>
            <ChannelSettings2>
                <OutputBuffer value="0" />
                <GranularClockIndex value="0" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="1" />
                <MaxLoopProportion value="1" />
            </ChannelSettings2>
            <ChannelSettings3>
                <OutputBuffer value="1" />
                <GranularClockIndex value="0" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="1" />
                <MaxLoopProportion value="1" />
            </ChannelSettings3>
            <ChannelSettings4>
                <OutputBuffer value="0" />
                <GranularClockIndex value="1" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="0" />
                <MaxLoopProportion value="1" />
            </ChannelSettings4>
            <ChannelSettings5>
                <OutputBuffer value="1" />
                <GranularClockIndex value="1" />
                <StretchToMinPitch value="0" />
                <StretchToMaxPitch value="0" />
                <MaxLoopProportion value="1" />
            </ChannelSettings5>
            <LoopRandomisationChangeRate value="0.01" />
            <LoopRandomisationPitchFraction value="0.05" />
            <ChannelVolume0 value="500" />
            <ChannelVolume1 value="600" />
            <ChannelVolume2 value="500" />
            <ChannelVolume3 value="600" />
            <ChannelVolume4 value="-800" />
            <ChannelVolume5 value="400" />
            <ParentSound>hash_B60BBF69</ParentSound>
            <GranularClock>
                14, 65
                12.31, 12.35
            </GranularClock>
        </Item>
        <Item type="EnvironmentSound">
            <Name>hash_D3E61903</Name>
            <Header>
                <Flags value="0x00008000" />
                <Category>vehicles_engines</Category>
            </Header>
            <ChannelID value="1" />
        </Item>
        <Item type="WrapperSound">
            <Name>hash_692113F2</Name>
            <Header>
                <Flags value="0x00008030" />
                <Pitch value="50" />
                <PitchVariance value="25" />
                <Category>vehicles_doors</Category>
            </Header>
            <ChildSound>hash_A9E7ABC3</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound>vehicles_extras_small_car_close</FallBackSound>
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>hash_A9E7ABC3</Item>
                <Item>vehicles_extras_small_car_close</Item>
            </ChildSounds>
        </Item>
        <Item type="WrapperSound">
            <Name>hash_D3BC6F43</Name>
            <Header>
                <Flags value="0x00008030" />
                <Pitch value="100" />
                <PitchVariance value="25" />
                <Category>vehicles_doors</Category>
            </Header>
            <ChildSound>hash_25863ACB</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound>vehicles_extras_small_car_open</FallBackSound>
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>hash_25863ACB</Item>
                <Item>vehicles_extras_small_car_open</Item>
            </ChildSounds>
        </Item>
        <Item type="SimpleSound">
            <Name>hash_FFDD549A</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicles_extras_dump_valve_10a</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_0DC3F067</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicles_extras_dump_valve_10b</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_ED65AFAB</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicles_extras_dump_valve_10c</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="MultitrackSound">
            <Name>hash_EC3DF5D0</Name>
            <Header>
                <Flags value="0x00000035" />
                <Flags2 value="0xAAA0AAAA" />
                <Volume value="1800" />
                <Pitch value="25" />
                <PitchVariance value="25" />
            </Header>
            <ChildSounds>
                <Item>hash_0060A148</Item>
                <Item>hash_285659F5</Item>
            </ChildSounds>
        </Item>
        <Item type="WrapperSound">
            <Name>hash_E5994767</Name>
            <Header>
                <Flags value="0x00008000" />
                <Category>vehicles_extras_loud</Category>
            </Header>
            <ChildSound>hash_EC3DF5D0</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound>dump_valve_mod_tuner</FallBackSound>
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>hash_EC3DF5D0</Item>
                <Item>dump_valve_mod_tuner</Item>
            </ChildSounds>
        </Item>
        <Item type="RandomizedSound">
            <Name>hash_0060A148</Name>
            <Header>
                <Flags value="0x00000004" />
                <Volume value="-600" />
            </Header>
            <HistoryIndex value="0" />
            <HistorySpace>FF</HistorySpace>
            <Variations>
                <Item name="hash_FFDD549A" value="1" />
                <Item name="hash_0DC3F067" value="1" />
                <Item name="hash_ED65AFAB" value="1" />
            </Variations>
        </Item>
        <Item type="MultitrackSound">
            <Name>hash_556FB16B</Name>
            <Header>
                <Flags value="0x00000005" />
                <Flags2 value="0xAAA0AAAA" />
                <Volume value="-100" />
            </Header>
            <ChildSounds>
                <Item>hash_A5FF1A95</Item>
                <Item>hash_C02B7B41</Item>
            </ChildSounds>
        </Item>
        <Item type="RandomizedSound">
            <Name>hash_A5FF1A95</Name>
            <Header>
                <Flags value="0x00000014" />
                <Volume value="-100" />
                <Pitch value="200" />
            </Header>
            <HistoryIndex value="0" />
            <HistorySpace>FF FF FF</HistorySpace>
            <Variations>
                <Item name="hash_C61B5AA5" value="1" />
                <Item name="hash_D7E4FE38" value="1" />
                <Item name="hash_899861A0" value="1" />
                <Item name="hash_9B6B0545" value="1" />
                <Item name="hash_DD550918" value="1" />
            </Variations>
        </Item>
        <Item type="WrapperSound">
            <Name>hash_D9560186</Name>
            <Header>
                <Flags value="0x00008000" />
                <Category>vehicles_extras_loud</Category>
            </Header>
            <ChildSound>hash_556FB16B</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound>upgrade_pops</FallBackSound>
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>hash_556FB16B</Item>
                <Item>upgrade_pops</Item>
            </ChildSounds>
        </Item>
        <Item type="SimpleSound">
            <Name>hash_D2B3AF8A</Name>
            <Header>
                <Flags value="0x00008014" />
                <Volume value="-600" />
                <Pitch value="50" />
                <Category>vehicles_engines_startup</Category>
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>shut_down</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="ModularSynthSound">
            <Name>hash_4D647323</Name>
            <Header>
                <Flags value="0x00008015" />
                <Flags2 value="0xAAA8AAAA" />
                <Volume value="-1200" />
                <Pitch value="1200" />
                <Category>vehicles_engines_loud</Category>
            </Header>
            <SynthSound>hash_7878B540</SynthSound>
            <SynthPreset />
            <PlaybackTimeLimit value="-1" />
            <VirtualisationMode value="0" />
            <TrackCount value="0" />
            <EnvironmentSounds>
                <Item />
                <Item />
                <Item />
                <Item />
            </EnvironmentSounds>
            <ExposedVariables>
                <Item>
                    <VariableName>enginefmin</VariableName>
                    <ParameterName />
                    <Value value="13" />
                </Item>
                <Item>
                    <VariableName>enginefmax</VariableName>
                    <ParameterName />
                    <Value value="57" />
                </Item>
                <Item>
                    <VariableName>hash_4E132C3B</VariableName>
                    <ParameterName />
                    <Value value="1" />
                </Item>
                <Item>
                    <VariableName>hash_18B20B91</VariableName>
                    <ParameterName />
                    <Value value="3" />
                </Item>
                <Item>
                    <VariableName>hash_E07986E5</VariableName>
                    <ParameterName />
                    <Value value="3.5" />
                </Item>
                <Item>
                    <VariableName>amp_normal</VariableName>
                    <ParameterName />
                    <Value value="1.5" />
                </Item>
                <Item>
                    <VariableName>amp_modded</VariableName>
                    <ParameterName />
                    <Value value="2" />
                </Item>
                <Item>
                    <VariableName>whine_factor</VariableName>
                    <ParameterName />
                    <Value value="12" />
                </Item>
                <Item>
                    <VariableName>whine_mod_min</VariableName>
                    <ParameterName />
                    <Value value="1" />
                </Item>
                <Item>
                    <VariableName>whine_mod_max</VariableName>
                    <ParameterName />
                    <Value value="250" />
                </Item>
                <Item>
                    <VariableName>whine_a</VariableName>
                    <ParameterName />
                    <Value value="0.4" />
                </Item>
            </ExposedVariables>
        </Item>
        <Item type="ModularSynthSound">
            <Name>hash_D8B7CCBB</Name>
            <Header>
                <Flags value="0x00008005" />
                <Flags2 value="0xAAA8AAAA" />
                <Volume value="-300" />
                <Category>vehicles_engines_loud</Category>
            </Header>
            <SynthSound>hash_463C1242</SynthSound>
            <SynthPreset />
            <PlaybackTimeLimit value="-1" />
            <VirtualisationMode value="0" />
            <TrackCount value="0" />
            <EnvironmentSounds>
                <Item />
                <Item />
                <Item />
                <Item />
            </EnvironmentSounds>
            <ExposedVariables />
        </Item>
        <Item type="RandomizedSound">
            <Name>hash_A9E7ABC3</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <HistoryIndex value="0" />
            <HistorySpace />
            <Variations>
                <Item name="hash_702A0180" value="1" />
                <Item name="hash_714B2561" value="1" />
            </Variations>
        </Item>
        <Item type="EnvelopeSound">
            <Name>hash_285659F5</Name>
            <Header>
                <Flags value="0x00000005" />
                <Flags2 value="0xAAA1AAAA" />
                <Volume value="-600" />
            </Header>
            <Attack value="0" />
            <AttackVariance value="0" />
            <Decay value="250" />
            <DecayVariance value="0" />
            <Sustain value="100" />
            <SustainVariance value="0" />
            <Hold value="600" />
            <HoldVariance value="200" />
            <Release value="600" />
            <ReleaseVariance value="300" />
            <AttackCurve>linear_rise</AttackCurve>
            <DecayCurve>linear_fall</DecayCurve>
            <ReleaseCurve>default_release_curve</ReleaseCurve>
            <AttackVariable />
            <DecayVariable />
            <SustainVariable />
            <HoldVariable />
            <ReleaseVariable />
            <ChildSound>hash_A68FB8D0</ChildSound>
            <Mode value="0" />
            <OutputVariable />
            <OutputRangeMin value="-100" />
            <OutputRangeMax value="0" />
        </Item>
        <Item type="ParameterTransformSound">
            <Name>hash_744FEABD</Name>
            <Header>
                <Flags value="0x00000004" />
                <Volume value="-700" />
            </Header>
            <ChildSound>hash_5E6F5018</ChildSound>
            <ParameterTransforms>
                <Item>
                    <InputParameter>revs</InputParameter>
                    <InputRangeMin value="0" />
                    <InputRangeMax value="1" />
                    <Transforms>
                        <Item>
                            <SmoothRate value="-1" />
                            <TransformType value="0" />
                            <TransformTypeParameter />
                            <OutputRangeMin value="1E-05" />
                            <OutputRangeMax value="1" />
                            <Vectors>
                                0.25, 0
                                0.5766667, 0.790727
                                0.75, 0.446678
                                1, 0.2818311
                            </Vectors>
                        </Item>
                    </Transforms>
                </Item>
                <Item>
                    <InputParameter>throttle</InputParameter>
                    <InputRangeMin value="0" />
                    <InputRangeMax value="1" />
                    <Transforms>
                        <Item>
                            <SmoothRate value="-1" />
                            <TransformType value="0" />
                            <TransformTypeParameter />
                            <OutputRangeMin value="1E-05" />
                            <OutputRangeMax value="1" />
                            <Vectors>
                                0, 0.3981012
                                0.6466666, 1
                            </Vectors>
                        </Item>
                    </Transforms>
                </Item>
            </ParameterTransforms>
        </Item>
        <Item type="VariableBlockSound">
            <Name>hash_6CD32CA1</Name>
            <Header>
                <Flags value="0x00008004" />
                <Volume value="-400" />
                <Category>vehicles_extras_loud</Category>
            </Header>
            <ChildSound>hash_744FEABD</ChildSound>
            <Variables>
                <Item>
                    <Name>revs</Name>
                    <Value value="0" />
                    <ValueVariance value="0" />
                    <VariableType value="1" />
                </Item>
                <Item>
                    <Name>throttle</Name>
                    <Value value="0" />
                    <ValueVariance value="0" />
                    <VariableType value="1" />
                </Item>
            </Variables>
        </Item>
        <Item type="ModularSynthSound">
            <Name>hash_5E6F5018</Name>
            <Header>
                <Flags value="0x00000001" />
                <Flags2 value="0xAAA8AAAA" />
            </Header>
            <SynthSound>hash_1D50302A</SynthSound>
            <SynthPreset />
            <PlaybackTimeLimit value="-1" />
            <VirtualisationMode value="0" />
            <TrackCount value="0" />
            <EnvironmentSounds>
                <Item />
                <Item />
                <Item />
                <Item />
            </EnvironmentSounds>
            <ExposedVariables>
                <Item>
                    <VariableName>throttle</VariableName>
                    <ParameterName>throttle</ParameterName>
                    <Value value="1" />
                </Item>
            </ExposedVariables>
        </Item>
        <Item type="SimpleSound">
            <Name>hash_A68FB8D0</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicles_extras_dump_valve_12</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_702A0180</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>classic_gen_vehicle_door_close</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_714B2561</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>classic_gen_vehicle_door_close_2</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_25863ACB</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>rally_gen_vehicle_door_open_2</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_C61B5AA5</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_hi_exhaust_pop_01</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_D7E4FE38</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_hi_exhaust_pop_02</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_899861A0</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_hi_exhaust_pop_03</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_9B6B0545</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_hi_exhaust_pop_04</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_DD550918</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_hi_exhaust_pop_05</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_BB558883</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_rally_exhaust_pop_01</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_F69DFF13</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_rally_exhaust_pop_03</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_B2A5771B</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_rally_exhaust_pop_04</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_A4625A95</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_rally_exhaust_pop_05</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="SimpleSound">
            <Name>hash_CE2F2E32</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>vehicle_extras_rally_exhaust_pop_06</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="RandomizedSound">
            <Name>hash_C02B7B41</Name>
            <Header>
                <Flags value="0x00000014" />
                <Volume value="-400" />
                <Pitch value="50" />
            </Header>
            <HistoryIndex value="0" />
            <HistorySpace>FF FF</HistorySpace>
            <Variations>
                <Item name="hash_BB558883" value="1" />
                <Item name="hash_F69DFF13" value="1" />
                <Item name="hash_A4625A95" value="1" />
                <Item name="hash_CE2F2E32" value="1" />
            </Variations>
        </Item>
        <Item type="SimpleSound">
            <Name>hash_DF019CF1</Name>
            <Header>
                <Flags value="0x00008014" />
                <Volume value="-300" />
                <Pitch value="100" />
                <Category>vehicles_extras_loud</Category>
            </Header>
            <ContainerName>hash_CBEBD406</ContainerName>
            <FileName>start_up</FileName>
            <WaveSlotIndex value="0" />
        </Item>
        <Item type="ParameterTransformSound">
            <Name>hash_10FE3242</Name>
            <Header>
                <Flags value="0x00000000" />
            </Header>
            <ChildSound>startup_sequence_dummy</ChildSound>
            <ParameterTransforms>
                <Item>
                    <InputParameter>sound.playtime</InputParameter>
                    <InputRangeMin value="0" />
                    <InputRangeMax value="5" />
                    <Transforms>
                        <Item>
                            <SmoothRate value="-1" />
                            <TransformType value="7" />
                            <TransformTypeParameter>fakethrottle</TransformTypeParameter>
                            <OutputRangeMin value="0" />
                            <OutputRangeMax value="1" />
                            <Vectors>
                                0, 0
                                0.03426933, 1
                                0.08142266, 1
                                0.1742701, 0
                                1, 0
                            </Vectors>
                        </Item>
                        <Item>
                            <SmoothRate value="-1" />
                            <TransformType value="7" />
                            <TransformTypeParameter>fakerevs</TransformTypeParameter>
                            <OutputRangeMin value="0" />
                            <OutputRangeMax value="1" />
                            <Vectors>
                                0, 0.2
                                0.05808867, 0.7766666
                                0.2309367, 0.3628
                                0.5000007, 0.1466667
                            </Vectors>
                        </Item>
                        <Item>
                            <SmoothRate value="-1" />
                            <TransformType value="7" />
                            <TransformTypeParameter>usefakeengine</TransformTypeParameter>
                            <OutputRangeMin value="0" />
                            <OutputRangeMax value="1" />
                            <Vectors>
                                0, 0
                                0.0009367257, 1
                                0.5976034, 1
                                0.6, 0
                            </Vectors>
                        </Item>
                    </Transforms>
                </Item>
            </ParameterTransforms>
        </Item>
        <Item type="WrapperSound">
            <Name>hash_F40FCFAA</Name>
            <Header>
                <Flags value="0x00008004" />
                <Volume value="-100" />
                <Category>vehicles_extras_loud</Category>
            </Header>
            <ChildSound>hash_A5FF1A95</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound>upgrade_pops</FallBackSound>
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>hash_A5FF1A95</Item>
                <Item>upgrade_pops</Item>
            </ChildSounds>
        </Item>
        <Item type="SoundSet">
            <Name>hash_CA7FD755</Name>
            <Header>
                <Flags value="0xAAAAAAAA" />
            </Header>
            <SoundSets>
                <Item>
                    <ScriptName>lightcover_popdown</ScriptName>
                    <ChildSound>hash_A69E0B7F</ChildSound>
                </Item>
                <Item>
                    <ScriptName>lightcover_popup</ScriptName>
                    <ChildSound>hash_10B76747</ChildSound>
                </Item>
            </SoundSets>
        </Item>
        <Item type="WrapperSound">
            <Name>hash_10B76747</Name>
            <Header>
                <Flags value="0x00008004" />
                <Volume value="300" />
                <Category>vehicles_doors</Category>
            </Header>
            <ChildSound>hash_DC3BCFA5</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound />
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>hash_DC3BCFA5</Item>
                <Item />
            </ChildSounds>
        </Item>
        <Item type="WrapperSound">
            <Name>hash_A69E0B7F</Name>
            <Header>
                <Flags value="0x00008004" />
                <Volume value="300" />
                <Category>vehicles_doors</Category>
            </Header>
            <ChildSound>hash_85A5466D</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound />
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>hash_85A5466D</Item>
                <Item />
            </ChildSounds>
        </Item>
        <Item type="MultitrackSound">
            <Name>hash_DC3BCFA5</Name>
            <Header>
                <Flags value="0x00000001" />
                <Flags2 value="0xAAA0AAAA" />
            </Header>
            <ChildSounds>
                <Item>hash_2B3D8906</Item>
                <Item>hash_5D289050</Item>
                <Item>hash_818E96AD</Item>
            </ChildSounds>
        </Item>
        <Item type="WrapperSound">
            <Name>hash_2B3D8906</Name>
            <Header>
                <Flags value="0x00040014" />
                <Volume value="-500" />
                <Pitch value="300" />
                <HPFCutoff value="800" />
            </Header>
            <ChildSound>hash_F5DE2EA4</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound />
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>hash_F5DE2EA4</Item>
                <Item />
            </ChildSounds>
        </Item>
        <Item type="MultitrackSound">
            <Name>hash_85A5466D</Name>
            <Header>
                <Flags value="0x00000001" />
                <Flags2 value="0xAAA0AAAA" />
            </Header>
            <ChildSounds>
                <Item>hash_E5C2B631</Item>
                <Item>hash_D5489C7A</Item>
                <Item>hash_2B3D8906</Item>
            </ChildSounds>
        </Item>
        <Item type="EnvelopeSound">
            <Name>hash_D5489C7A</Name>
            <Header>
                <Flags value="0x00000115" />
                <Flags2 value="0xAAA1AAAA" />
                <Volume value="-2000" />
                <Pitch value="2000" />
                <PreDelay value="50" />
            </Header>
            <Attack value="0" />
            <AttackVariance value="0" />
            <Decay value="0" />
            <DecayVariance value="0" />
            <Sustain value="100" />
            <SustainVariance value="0" />
            <Hold value="1100" />
            <HoldVariance value="0" />
            <Release value="150" />
            <ReleaseVariance value="0" />
            <AttackCurve>linear_rise</AttackCurve>
            <DecayCurve>linear_fall</DecayCurve>
            <ReleaseCurve>default_release_curve</ReleaseCurve>
            <AttackVariable />
            <DecayVariable />
            <SustainVariable />
            <HoldVariable />
            <ReleaseVariable />
            <ChildSound>hash_C005441D</ChildSound>
            <Mode value="0" />
            <OutputVariable />
            <OutputRangeMin value="-100" />
            <OutputRangeMax value="0" />
        </Item>
        <Item type="WrapperSound">
            <Name>hash_E5C2B631</Name>
            <Header>
                <Flags value="0x00000114" />
                <Volume value="-1800" />
                <Pitch value="400" />
                <PreDelay value="1100" />
            </Header>
            <ChildSound>boot_shut</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound />
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>boot_shut</Item>
                <Item />
            </ChildSounds>
        </Item>
        <Item type="EnvelopeSound">
            <Name>hash_5D289050</Name>
            <Header>
                <Flags value="0x00000115" />
                <Flags2 value="0xAAA1AAAA" />
                <Volume value="-2000" />
                <Pitch value="2050" />
                <PreDelay value="50" />
            </Header>
            <Attack value="0" />
            <AttackVariance value="0" />
            <Decay value="0" />
            <DecayVariance value="0" />
            <Sustain value="100" />
            <SustainVariance value="0" />
            <Hold value="1100" />
            <HoldVariance value="0" />
            <Release value="150" />
            <ReleaseVariance value="0" />
            <AttackCurve>linear_rise</AttackCurve>
            <DecayCurve>linear_fall</DecayCurve>
            <ReleaseCurve>default_release_curve</ReleaseCurve>
            <AttackVariable />
            <DecayVariable />
            <SustainVariable />
            <HoldVariable />
            <ReleaseVariable />
            <ChildSound>hash_C005441D</ChildSound>
            <Mode value="0" />
            <OutputVariable />
            <OutputRangeMin value="-100" />
            <OutputRangeMax value="0" />
        </Item>
        <Item type="WrapperSound">
            <Name>hash_818E96AD</Name>
            <Header>
                <Flags value="0x00000114" />
                <Volume value="-1800" />
                <Pitch value="600" />
                <PreDelay value="1100" />
            </Header>
            <ChildSound>boot_shut</ChildSound>
            <LastPlayTime value="0" />
            <FallBackSound />
            <MinRepeatTime value="0" />
            <Variables />
            <ChildSounds>
                <Item>boot_shut</Item>
                <Item />
            </ChildSounds>
        </Item>
    </Items>
</Dat54>
```

La partie ici indique les fichiers .awc qui sont appelé sur le fichier pour être chargé.

```xml
<Item>DLC_ELEGYS\elegys</Item>
<Item>DLC_ELEGYS\elegys_NPC</Item>
```

La partie suivante indique les noms des sons présents dans le fichier .awc attribué pour donner les effets accélerations, décelerations etc...

```xml
<Channel0>
    <ContainerName>dlc_elegys/elegys</ContainerName>
    <FileName>engine_accel</FileName>
   </Channel0>
   <Channel1>
    <ContainerName>dlc_elegys/elegys</ContainerName>
    <FileName>exhaust_accel</FileName>
   </Channel1>
   <Channel2>
    <ContainerName>dlc_elegys/elegys</ContainerName>
    <FileName>engine_decel</FileName>
   </Channel2>
   <Channel3>
    <ContainerName>dlc_elegys/elegys</ContainerName>
    <FileName>exhaust_decel</FileName>
   </Channel3>
   <Channel4>
    <ContainerName>dlc_elegys/elegys</ContainerName>
    <FileName>engine_idle</FileName>
   </Channel4>
   <Channel5>
    <ContainerName>dlc_elegys/elegys</ContainerName>
    <FileName>exhaust_idle</FileName>
   </Channel5>
```

Une partie identique est donné pour les _npc, qui est utilisé pour les joueurs extérieurs (sons d'ambiance lors du passage du véhicule par
un joueur un ou PNJ).

```xml
<Channel0>
    <ContainerName>dlc_elegys/elegys_npc</ContainerName>
    <FileName>engine_accel</FileName>
   </Channel0>
   <Channel1>
    <ContainerName>dlc_elegys/elegys_npc</ContainerName>
    <FileName>exhaust_accel</FileName>
   </Channel1>
   <Channel2>
    <ContainerName>0</ContainerName>
    <FileName />
   </Channel2>
   <Channel3>
    <ContainerName>0</ContainerName>
    <FileName />
   </Channel3>
   <Channel4>
    <ContainerName>dlc_elegys/elegys_npc</ContainerName>
    <FileName>engine_idle</FileName>
   </Channel4>
   <Channel5>
    <ContainerName>dlc_elegys/elegys_npc</ContainerName>
    <FileName>exhaust_idle</FileName>
   </Channel5>
```

Note son :

```markdown
PreSubmix : Avant traitement (rapport avec les fréquences graves) par les filtres et les settings mis en place dans les _game.dat151.rel
PostSubmix : Après traitement (Augmentation du volume par exemple)
```

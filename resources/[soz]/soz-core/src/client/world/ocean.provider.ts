import { Command } from '@public/core/decorators/command';
import { Once, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { NumberValidator } from '@public/shared/nui/input';

import { Provider } from '../../core/decorators/provider';
import { InputService } from '../nui/input.service';

const increaseRate = 0.005;
@Provider()
export class OceanProvider {
    @Inject(InputService)
    private inputService: InputService;

    private targetLevel = 0;
    private currentLevel = 0;
    private debug = false;
    private highWave = false;
    private configLoaded: number = null;

    @Once()
    public init() {
        WaterOverrideSetShorewaveamplitude(1.8);
        WaterOverrideSetShorewaveminamplitude(2.0);
        WaterOverrideSetShorewavemaxamplitude(1.5);

        WaterOverrideSetOceannoiseminamplitude(20.55);
        WaterOverrideSetOceanwaveamplitude(2.03);
        WaterOverrideSetOceanwaveminamplitude(3.76);
        WaterOverrideSetOceanwavemaxamplitude(14.5);

        WaterOverrideSetRipplebumpiness(0.42);
        WaterOverrideSetRippleminbumpiness(0.25);
        WaterOverrideSetRipplemaxbumpiness(0.5);
        WaterOverrideSetRippledisturb(0.05);
    }

    @OnEvent(ClientEvent.OCEAN_WATER_LEVEL)
    public async flood(targetLevel: number) {
        this.targetLevel = targetLevel;
    }

    @Tick(100)
    public waterLevelLoop() {
        if (this.debug) {
            return;
        }

        if (this.currentLevel == this.targetLevel) {
            return;
        }

        const waterQuadCount = GetWaterQuadCount();

        if (this.currentLevel > this.targetLevel) {
            this.currentLevel = Math.max(this.targetLevel, this.currentLevel - increaseRate);
        } else if (this.currentLevel < this.targetLevel) {
            this.currentLevel = Math.min(this.targetLevel, this.currentLevel + increaseRate);
        }

        const currentLevelRouned = Math.round(this.currentLevel);
        if (this.currentLevel > 0 && this.configLoaded != currentLevelRouned) {
            LoadWaterFromPath('soz-mapdata', 'water/water' + currentLevelRouned + '.xml');
            this.configLoaded = currentLevelRouned;
        } else if (currentLevelRouned > 300 && this.configLoaded != 300) {
            LoadWaterFromPath('soz-mapdata', 'water/water300.xml');
            this.configLoaded = 300;
        } else if (currentLevelRouned < 0 && this.configLoaded != -100) {
            LoadWaterFromPath('soz-mapdata', 'water/water-100.xml');
            this.configLoaded = -100;
        } else if (this.currentLevel == 0 && this.configLoaded != null) {
            ResetWater();
            this.configLoaded = null;
            return;
        }

        for (let i = 0; i < waterQuadCount; i++) {
            const [, z] = GetWaterQuadLevel(i);
            if (Math.abs(z - 30) > 0.1 && Math.abs(z - 160.339) > 0.1 && Math.abs(z - 196.41) > 0.1) {
                SetWaterQuadLevel(i, this.currentLevel);
            }
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuOceanSetHighWave)
    public async onHighWave(value: boolean): Promise<void> {
        TriggerServerEvent(ServerEvent.ADMIN_OCEAN_WATER_HIGH_WAVE, value);
    }

    @OnNuiEvent(NuiEvent.AdminMenuOceanSetWaterLevel)
    public async setWaterLevel(): Promise<void> {
        const level = await this.inputService.askInput(
            {
                title: "Hauteur de l'eau",
                defaultValue: this.targetLevel.toString(),
            },
            NumberValidator
        );

        if (level == null) {
            return;
        }

        TriggerServerEvent(ServerEvent.ADMIN_OCEAN_WATER_LEVEL, level);
    }

    @OnNuiEvent(NuiEvent.AdminMenuOceanSetWaterDebugLevel)
    public async setWaterLevelDebug(): Promise<void> {
        let level = await this.inputService.askInput(
            {
                title: "Hauteur de l'eau (Debug)",
                defaultValue: this.targetLevel.toString(),
            },
            NumberValidator
        );

        this.debug = true;
        if (!level) {
            this.debug = false;
            level = this.targetLevel;
            return;
        }

        const waterQuadCount = GetWaterQuadCount();

        for (let i = 1; i <= waterQuadCount; i++) {
            SetWaterQuadLevel(i, level);
        }
    }

    @OnNuiEvent(NuiEvent.AdminMenuOceanGetWaterLevel)
    public async getWaterLevel(): Promise<[number, number]> {
        return [this.currentLevel, this.targetLevel];
    }

    @OnEvent(ClientEvent.OCEAN_WATER_HIGH_WAVE)
    public setHighWave(value: boolean) {
        console.log('ADMIN_OCEAN_WATER_HIGH_WAVE', value);
        if (this.highWave == value) {
            return;
        }

        if (value) {
            WaterOverrideFadeIn(10);
        } else {
            WaterOverrideFadeOut(10);
        }
        this.highWave = value;
    }

    @Command('deep')
    deep(source, valueStr: string) {
        console.log(GetWaterQuadBounds(0));
        console.log(GetWaterQuadBounds(GetWaterQuadCount()));
        const value = parseFloat(valueStr);
        console.log(valueStr);
        SetDeepOceanScaler(value);
    }

    public isHighWaves() {
        return this.highWave;
    }
}

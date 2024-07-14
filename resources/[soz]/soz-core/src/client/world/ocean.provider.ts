import { Once, OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { NumberValidator } from '@public/shared/nui/input';
import { RpcServerEvent } from '@public/shared/rpc';

import { Provider } from '../../core/decorators/provider';
import { InputService } from '../nui/input.service';

const increaseRate = 0.005;
@Provider()
export class OceanProvider {
    @Inject(InputService)
    private inputService: InputService;

    private targetLevel = 0;
    private currentLevel = 0;
    private playerUpdatingServer = 0;
    private highWave = false;
    private configLoaded: number = null;

    @Once()
    public async init() {
        WaterOverrideSetShorewaveamplitude(3 * 1.8);
        WaterOverrideSetShorewaveminamplitude(3 * 2.0);
        WaterOverrideSetShorewavemaxamplitude(3 * 1.5);

        WaterOverrideSetOceannoiseminamplitude(20.55);
        WaterOverrideSetOceanwaveamplitude(2.03);
        WaterOverrideSetOceanwaveminamplitude(3.76);
        WaterOverrideSetOceanwavemaxamplitude(14.5);

        WaterOverrideSetRipplebumpiness(0.42);
        WaterOverrideSetRippleminbumpiness(0.25);
        WaterOverrideSetRipplemaxbumpiness(0.5);
        WaterOverrideSetRippledisturb(0.05);

        const data = await emitRpc<[number, number, boolean]>(RpcServerEvent.ADMIN_OCEAN);
        this.currentLevel = data[0];
        this.flood(data[1], 0);
        this.setWaterQuadsLevel();
        this.setHighWave(data[2]);
    }

    @OnEvent(ClientEvent.OCEAN_WATER_LEVEL)
    public async flood(targetLevel: number, playerUpdatingServer: number) {
        this.targetLevel = targetLevel;
        this.playerUpdatingServer = playerUpdatingServer;
    }

    @Tick(100)
    public waterLevelLoop() {
        if (this.currentLevel == this.targetLevel) {
            return;
        }

        if (this.currentLevel > this.targetLevel) {
            this.currentLevel = Math.max(this.targetLevel, this.currentLevel - increaseRate);
        } else if (this.currentLevel < this.targetLevel) {
            this.currentLevel = Math.min(this.targetLevel, this.currentLevel + increaseRate);
        }

        if (GetPlayerServerId(PlayerId()) == this.playerUpdatingServer) {
            TriggerServerEvent(ServerEvent.ADMIN_OCEAN_WATER_CURRENT_LEVEL, this.currentLevel);
        }

        this.setWaterQuadsLevel();
    }

    private setWaterQuadsLevel() {
        const waterQuadCount = GetWaterQuadCount();
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
            //Do not update Quad levels in altitude
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

    @OnNuiEvent(NuiEvent.AdminMenuOceanGetWaterLevel)
    public async getWaterLevel(): Promise<[number, number]> {
        return [this.currentLevel, this.targetLevel];
    }

    @OnEvent(ClientEvent.OCEAN_WATER_HIGH_WAVE)
    public setHighWave(value: boolean) {
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

    public isHighWaves() {
        return this.highWave;
    }
}

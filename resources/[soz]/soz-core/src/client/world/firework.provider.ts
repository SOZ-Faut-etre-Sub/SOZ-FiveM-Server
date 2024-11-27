import { Inject } from '@public/core/decorators/injectable';

import { OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event/client';
import { FireworkType } from '../../shared/firework';
import { add2Vector3, Vector3 } from '../../shared/polyzone/vector';
import { ResourceLoader } from '../repository/resource.loader';

@Provider()
export class FireworkProvider {
    @Inject(ResourceLoader)
    public readonly resourceLoader: ResourceLoader;

    private assetFirework = 'proj_indep_firework';
    private assetFireworkV2 = 'proj_indep_firework_v2';
    private assetFireworks = 'scr_indep_fireworks';
    private assetXmasFirework = 'proj_xmas_firework';

    async burstAt(source: Vector3, height: number, scale?: number, color?: Vector3) {
        return this.launchFireworkAt(this.assetFirework, 'scr_indep_firework_air_burst', source, height, scale, color);
    }

    async spiralBurstAt(source: Vector3, height: number, scale?: number, color?: Vector3) {
        return this.launchFireworkAt(
            this.assetFireworkV2,
            'scr_firework_indep_spiral_burst_rwb',
            source,
            height,
            scale,
            color
        );
    }

    async spiralBurst2At(source: Vector3, height: number, scale?: number, color?: Vector3) {
        return this.launchFireworkAt(
            this.assetFireworkV2,
            'scr_firework_indep_repeat_burst_rwb',
            source,
            height,
            scale,
            color
        );
    }

    async ringBurstAt(source: Vector3, height: number, scale?: number, color?: Vector3) {
        return this.launchFireworkAt(
            this.assetXmasFirework,
            'scr_firework_xmas_repeat_burst_rgw',
            source,
            height,
            scale,
            color
        );
    }

    async ringBurstAndSparkleAt(source: Vector3, height: number, scale?: number, color?: Vector3) {
        return this.launchFireworkAt(
            this.assetFireworkV2,
            'scr_firework_indep_ring_burst_rwb',
            source,
            height,
            scale,
            color
        );
    }

    async fizzleAt(source: Vector3, height: number, scale?: number, color?: Vector3) {
        return this.launchFireworkAt(
            this.assetFireworkV2,
            'scr_xmas_firework_burst_fizzle',
            source,
            height,
            scale,
            color
        );
    }

    async fountainAt(source: Vector3, scale?: number, color?: Vector3) {
        return this.createFireworkAt(this.assetFireworks, 'scr_indep_firework_fountain', source, scale, color);
    }

    async shotburstAt(source: Vector3, scale?: number, color?: Vector3) {
        return this.createFireworkAt(this.assetFireworks, 'scr_indep_firework_shotburst', source, scale, color);
    }

    async starburstAt(source: Vector3, height: number, scale?: number, color?: Vector3) {
        return this.launchFireworkAt(this.assetFireworks, 'scr_indep_firework_starburst', source, height, scale, color);
    }

    @OnEvent(ClientEvent.CREATE_FIREWORK)
    async onCreateFirework(type: FireworkType, source: Vector3, height: number, scale?: number, color?: Vector3) {
        switch (type) {
            case FireworkType.Burst:
                return this.burstAt(source, height, scale, color);
            case FireworkType.SpiralBurst:
                return this.spiralBurstAt(source, height, scale, color);
            case FireworkType.SpiralBurst2:
                return this.spiralBurst2At(source, height, scale, color);
            case FireworkType.RingBurst:
                return this.ringBurstAt(source, height, scale, color);
            case FireworkType.RingBurstAndSparkle:
                return this.ringBurstAndSparkleAt(source, height, scale, color);
            case FireworkType.Fizzle:
                return this.fizzleAt(source, height, scale, color);
            case FireworkType.Fountain:
                return this.fountainAt(source, scale, color);
            case FireworkType.Shotburst:
                return this.shotburstAt(source, scale, color);
            case FireworkType.Starburst:
                return this.starburstAt(source, height, scale, color);
        }
    }

    private launchFireworkAt(
        asset: string,
        effect: string,
        source: Vector3,
        height: number,
        scale: number = 1.0,
        color?: Vector3
    ) {
        this.createFireworkAt(asset, effect, add2Vector3(source, [0, 0, height]), scale, color);
    }

    private async createFireworkAt(
        asset: string,
        effect: string,
        position: Vector3,
        scale: number = 1.0,
        color?: Vector3
    ) {
        await this.resourceLoader.loadPtfxAsset(asset);

        UseParticleFxAsset(asset);

        if (color) {
            SetParticleFxNonLoopedColour(color[0], color[1], color[2]);
        }

        StartParticleFxNonLoopedAtCoord(
            effect,
            position[0],
            position[1],
            position[2],
            0.0,
            0.0,
            0.0,
            scale,
            false,
            false,
            false
        );
    }
}

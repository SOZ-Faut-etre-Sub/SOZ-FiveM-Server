import { Inject } from '@public/core/decorators/injectable';
import { type } from 'node:os';

import { Once, OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { wait } from '../../core/utils';
import { ClientEvent } from '../../shared/event/client';
import { FireworkType } from '../../shared/firework';
import { Vector3 } from '../../shared/polyzone/vector';
import { ResourceLoader } from '../repository/resource.loader';

@Provider()
export class FireworkProvider {
    @Inject(ResourceLoader)
    public resourceLoader: ResourceLoader;

    private assetFirework = 'proj_indep_firework';
    private assetFireworkV2 = 'proj_indep_firework_v2';
    private assetFireworks = 'scr_indep_fireworks';
    private assetXmasFirework = 'proj_xmas_firework';

    @Once()
    async init() {
        await this.resourceLoader.loadPtfxAsset(this.assetFirework);
        await this.resourceLoader.loadPtfxAsset(this.assetFireworkV2);
        await this.resourceLoader.loadPtfxAsset(this.assetFireworks);
        await this.resourceLoader.loadPtfxAsset(this.assetXmasFirework);
    }

    async burstAt(source: Vector3, position: Vector3, scale?: number) {
        return this.launchFireworkAt(this.assetFirework, 'scr_indep_firework_air_burst', source, position, scale);
    }

    async spiralBurstAt(source: Vector3, position: Vector3, scale?: number) {
        return this.launchFireworkAt(
            this.assetFireworkV2,
            'scr_firework_indep_spiral_burst_rwb',
            source,
            position,
            scale
        );
    }

    async spiralBurst2At(source: Vector3, position: Vector3, scale?: number) {
        return this.launchFireworkAt(
            this.assetFireworkV2,
            'scr_firework_indep_repeat_burst_rwb',
            source,
            position,
            scale
        );
    }

    async ringBurstAt(source: Vector3, position: Vector3, scale?: number) {
        return this.launchFireworkAt(
            this.assetXmasFirework,
            'scr_firework_xmas_repeat_burst_rgw',
            source,
            position,
            scale
        );
    }

    async ringBurstAndSparkleAt(source: Vector3, position: Vector3, scale?: number) {
        return this.launchFireworkAt(
            this.assetFireworkV2,
            'scr_firework_indep_ring_burst_rwb',
            source,
            position,
            scale
        );
    }

    async fizzleAt(source: Vector3, position: Vector3, scale?: number) {
        return this.launchFireworkAt(this.assetFireworkV2, 'scr_xmas_firework_burst_fizzle', source, position, scale);
    }

    async fountainAt(source: Vector3, position: Vector3, scale?: number) {
        return this.launchFireworkAt(this.assetFireworks, 'scr_indep_firework_fountain', source, position, scale);
    }

    async shotburstAt(source: Vector3, position: Vector3, scale?: number) {
        return this.launchFireworkAt(this.assetFireworks, 'scr_indep_firework_shotburst', source, position, scale);
    }

    async starburstAt(source: Vector3, position: Vector3, scale?: number) {
        return this.launchFireworkAt(this.assetFireworks, 'scr_indep_firework_starburst', source, position, scale);
    }

    @OnEvent(ClientEvent.CREATE_FIREWORK)
    async onCreateFirework(type: FireworkType, source: Vector3, position: Vector3, scale?: number) {
        switch (type) {
            case FireworkType.Burst:
                return this.burstAt(source, position, scale);
            case FireworkType.SpiralBurst:
                return this.spiralBurstAt(source, position, scale);
            case FireworkType.SpiralBurst2:
                return this.spiralBurst2At(source, position, scale);
            case FireworkType.RingBurst:
                return this.ringBurstAt(source, position, scale);
            case FireworkType.RingBurstAndSparkle:
                return this.ringBurstAndSparkleAt(source, position, scale);
            case FireworkType.Fizzle:
                return this.fizzleAt(source, position, scale);
            case FireworkType.Fountain:
                return this.fountainAt(source, position, scale);
            case FireworkType.Shotburst:
                return this.shotburstAt(source, position, scale);
            case FireworkType.Starburst:
                return this.starburstAt(source, position, scale);
        }
    }

    private async launchFireworkAt(
        asset: string,
        effect: string,
        source: Vector3,
        position: Vector3,
        scale: number = 1.0
    ) {
        UseParticleFxAssetNextCall(this.assetFireworks);
        StartNetworkedParticleFxNonLoopedAtCoord(
            'scr_indep_firework_trailburst',
            source[0],
            source[1],
            source[2],
            0.0,
            0.0,
            0.0,
            1.0,
            false,
            false,
            false
        );

        await wait(200);

        UseParticleFxAssetNextCall(asset);
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

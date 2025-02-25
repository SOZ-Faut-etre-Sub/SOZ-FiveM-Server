import { Inject } from '@public/core/decorators/injectable';
import { ClientEvent } from '@public/shared/event/client';
import { RpcServerEvent } from '@public/shared/rpc';

import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class PlayerDamageProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    private damageZones: Record<number, boolean> = {
        31086: false, // Head
        10706: false, // Right shoulder
        64729: false, // Left shoulder
        40269: false, // Right arm
        45509: false, // Left arm
        57005: false, // Right hand
        18905: false, // Left hand
        36864: false, // Right leg
        63931: false, // Left leg
        52301: false, // Right foot
        14201: false, // Left foot
        24818: false, // Torse
        24817: false, // Back
        24816: false, // Belly
    };

    @Once(OnceStep.NuiLoaded, true)
    @OnEvent(ClientEvent.LSMC_DAMAGE_REFRESH)
    async setupPlayerDisease() {
        const damages = await emitRpc<{ bone: number }[]>(RpcServerEvent.LSMC_GET_DAMAGE);
        this.updatePlayerDamage(damages);
    }

    public addDamageZone(bone: number) {
        this.setDamageZone(bone, true);
        this.syncDamageUi();
    }

    private syncDamageUi() {
        const bones = Object.entries(this.damageZones)
            .filter(([, damaged]) => damaged)
            .map(([bone]) => bone);
        this.nuiDispatch.dispatch('hud', 'SetDamagedBones', bones);
    }

    private setDamageZone(bone: number, value: boolean) {
        if (this.damageZones[bone] === undefined) return;
        this.damageZones[bone] = value;
    }

    private updatePlayerDamage(damage: { bone: number }[]) {
        Object.keys(this.damageZones).forEach(key => (this.damageZones[key] = false));
        damage.forEach(d => this.setDamageZone(d.bone, true));
        this.syncDamageUi();
    }
}

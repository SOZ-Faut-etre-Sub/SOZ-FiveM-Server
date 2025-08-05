import { On } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { Once, OnceStep } from '../../core/decorators/event';
import { Rpc } from '../../core/decorators/rpc';
import { ClientEvent } from '../../shared/event/client';
import { Feature } from '../../shared/features';
import { RpcServerEvent } from '../../shared/rpc';
import { DefaultPedDensity, PedDensityType } from '../../shared/utils/npc';
import { FeatureProvider } from '../feature/feature.provider';

const BlacklistedPeds = [
    GetHashKey('s_m_y_ranger_01'),
    GetHashKey('s_m_y_sheriff_01'),
    GetHashKey('s_m_y_cop_01'),
    GetHashKey('s_f_y_sheriff_01'),
    GetHashKey('s_f_y_cop_01'),
    GetHashKey('s_m_y_hwaycop_01'),
];

@Provider()
export class NpcProvider {
    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

    private disabled = false;

    @Once(OnceStep.Start)
    async onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        this.disableNPC(true);
    }

    @On('entityCreating', false)
    public onEntityCreating(handle: number) {
        const entityModel = GetEntityModel(handle);

        if (GetEntityType(handle) == 1 && BlacklistedPeds.includes(entityModel)) {
            CancelEvent();
        }
    }

    public isDisabled() {
        return this.disabled;
    }

    public disableNPC(value: boolean) {
        this.disabled = value;
        const density = { ...DefaultPedDensity };

        if (value) {
            density[PedDensityType.multiplier] = 0.0;
            density[PedDensityType.peds] = 0.0;
            density[PedDensityType.scenario] = 0.0;
            density[PedDensityType.vehicle] = 0.0;
            density[PedDensityType.parked] = 0.0;
        }

        TriggerLatentClientEvent(ClientEvent.NPC_DENSITY_UPDATE, -1, 1024, density);
    }

    @Rpc(RpcServerEvent.GET_DISABLE_NPC)
    public getDisableNPC() {
        const density = { ...DefaultPedDensity };
        if (this.disabled) {
            density[PedDensityType.multiplier] = 0.0;
            density[PedDensityType.peds] = 0.0;
            density[PedDensityType.scenario] = 0.0;
            density[PedDensityType.vehicle] = 0.0;
            density[PedDensityType.parked] = 0.0;
        }

        return density;
    }
}

import { On, Once, OnceStep } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { Feature } from '../../shared/features';
import { GlobalState } from '../../shared/global';
import { JobType } from '../../shared/job';
import { FeatureProvider } from '../feature/feature.provider';
import { StateSelector, Store } from './store';

@Provider()
export class StateGlobalProvider {
    @Inject('Store')
    private store: Store;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Once(OnceStep.Start)
    async onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        this.store.dispatch.global.update({
            blackoutLevel: 1,
        });
    }

    @StateSelector(state => state.global)
    public onGlobalStateChange(global: GlobalState) {
        TriggerClientEvent(ClientEvent.STATE_UPDATE_GLOBAL, -1, global);
    }

    @Exportable('GetGlobalState')
    getGlobalState(): GlobalState {
        return this.store.getState().global;
    }

    @Exportable('SetGlobalState')
    updateGlobalState(state: Partial<GlobalState>) {
        this.store.dispatch.global.update(state);
    }

    @Exportable('SetJobEnergies')
    setJobEnergies(energies: Partial<Record<JobType, number>>) {
        this.store.dispatch.global.setJobEnergies(energies);
    }

    @On('QBCore:Server:PlayerLoaded', false)
    onPlayerLoaded(player: any) {
        const global = this.store.getState().global;
        TriggerClientEvent(ClientEvent.STATE_UPDATE_GLOBAL, player.PlayerData.source, global);
    }
}

import { On } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { GlobalState } from '../../shared/global';
import { JobType } from '../../shared/job';
import { StateSelector, Store } from './store';

@Provider()
export class StateGlobalProvider {
    @Inject('Store')
    private store: Store;

    @StateSelector(state => state.global)
    public onGlobalStateChange(global: GlobalState) {
        TriggerClientEvent(ClientEvent.STATE_UPDATE_GLOBAL, -1, global);
    }

    @StateSelector(state => state.global.blackoutLevel)
    public stopPhoneCallOnLevel(level: number) {
        if (level > 2) {
            exports['soz-voip'].StopAllPhoneCall();
        }
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

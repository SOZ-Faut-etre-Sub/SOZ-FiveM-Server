import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { GlobalState } from '../../shared/global';
import { Store } from './store';

@Provider()
export class StateGlobalProvider {
    @Inject('Store')
    private store: Store;

    @OnEvent(ClientEvent.STATE_UPDATE_GLOBAL)
    public onGlobalStateChange(global: GlobalState) {
        this.store.dispatch.global.set(global);
    }

    @Exportable('GetGlobalState')
    getGlobalState(): GlobalState {
        return this.store.getState().global;
    }
}

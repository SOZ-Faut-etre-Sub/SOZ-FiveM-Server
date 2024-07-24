import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event/client';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class BankUIProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @OnEvent(ClientEvent.BANK_OPEN_UI)
    bankUiEvent(data) {
        console.log(data);
        this.nuiDispatch.dispatch('bank', 'ShowAccount', data);
    }
}

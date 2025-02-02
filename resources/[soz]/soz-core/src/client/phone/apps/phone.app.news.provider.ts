import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { emitRpc } from '../../../core/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { NewsMessage } from '../../../shared/phone/apps/news';
import { RpcServerEvent } from '../../../shared/rpc';
import { NuiDispatch } from '../../nui/nui.dispatch';

@Provider()
export class PhoneAppNewsProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Once(OnceStep.NuiLoaded)
    @OnEvent(ClientEvent.ADMIN_SWITCH_CHARACTER)
    async onNuiLoaded() {
        const news = await emitRpc<NewsMessage[]>(RpcServerEvent.PHONE_APP_NEWS_GET);
        this.nuiDispatch.dispatch('phone', 'AppNewsSetData', news);
    }

    @OnEvent(ClientEvent.PHONE_APP_NEWS_BROADCAST)
    async onBroadcastNews(news: NewsMessage) {
        this.nuiDispatch.dispatch('phone', 'AppNewsAddData', news);
    }
}

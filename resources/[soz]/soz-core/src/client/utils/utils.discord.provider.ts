import { Tick, TickInterval } from '@public/core/decorators/tick';
import { emitRpc } from '@public/core/rpc';
import { RpcServerEvent } from '@public/shared/rpc';

import { Provider } from '../../core/decorators/provider';

@Provider()
export class DiscordProvider {
    @Tick(TickInterval.EVERY_MINUTE)
    public async updateDiscordRichPresenceTick() {
        //To Set This Up visit https://forum.cfx.re/t/how-to-updated-discord-rich-presence-custom-image/157686

        // This is the Application ID (Replace this with you own)
        SetDiscordAppId('958495562645270608');

        // Here you will have to put the image name for the "large" icon.
        SetDiscordRichPresenceAsset('soz');

        // Here you can add hover text for the "large" icon.
        SetDiscordRichPresenceAssetText('SOZ RP');

        // Here you will have to put the image name for the "small" icon.
        SetDiscordRichPresenceAssetSmall('discord');

        // Here you can add hover text for the "small" icon.
        SetDiscordRichPresenceAssetSmallText('discord.gg/soz-pas-soz');

        const [connectedPLayer, maxPlayer] = await emitRpc<[number, number]>(RpcServerEvent.CURRENT_PLAYERS);

        SetRichPresence(connectedPLayer + '/' + maxPlayer);

        /*
            Here you can add buttons that will display in your Discord Status,
            First paramater is the button index (0 or 1), second is the title and
            last is the url (this has to start with "fivem://connect/" or "https://")
        */

        SetDiscordRichPresenceAction(0, 'Rejoindre SOZ', 'https://discord.gg/soz-pas-soz');
    }
}

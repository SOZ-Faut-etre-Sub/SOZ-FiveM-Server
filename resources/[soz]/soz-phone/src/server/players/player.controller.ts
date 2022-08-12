import { PhoneEvents } from '../../../typings/phone';
import { SocietyEvents } from '../../../typings/society';
import { getSource } from '../utils/miscUtils';
import PlayerService from './player.service';
import { playerLogger } from './player.utils';

onNet(PhoneEvents.FETCH_CREDENTIALS, () => {
    const src = getSource();
    const player = PlayerService.getPlayer(src);
    const phoneNumber = player.getPhoneNumber();
    const societyPhoneNumber = player.getSocietyPhoneNumber();

    emitNet(PhoneEvents.SEND_CREDENTIALS, src, phoneNumber, societyPhoneNumber);
});

/**
 * Essentially this whole file acts as a controller layer
 * for player related actions. Everything here is registered,
 * within the global scope like routes in a web server.
 */
on('QBCore:Server:PlayerLoaded', async (playerData: any) => {
    await PlayerService.handleNewPlayerJoined(playerData);
});

on('QBCore:Server:OnJobUpdate', async (source: number, playerData: any) => {
    await PlayerService.handlePlayerJobUpdate(source, playerData);

    emitNet(SocietyEvents.RESET_SOCIETY_MESSAGES, source);
});

// Handle removing from player maps when player disconnects
on('QBCore:Server:PlayerUnload', async () => {
    const src = getSource();
    // Get identifier for player to remove
    try {
        await PlayerService.handleUnloadPlayerEvent(src);
    } catch (e) {
        playerLogger.debug(`${src} failed to unload, likely was never loaded in the first place.`);
    }
});

on('onServerResourceStart', async (resource: string) => {
    if (resource === GetCurrentResourceName()) {
        const QBCore = global.exports['qb-core'].GetCoreObject();

        let players = QBCore.Functions.GetQBPlayers();

        if (!Array.isArray(players)) {
            players = Object.values(players);
        }

        for (const player of players) {
            await PlayerService.handleNewPlayerJoined(player);
        }
    }
});

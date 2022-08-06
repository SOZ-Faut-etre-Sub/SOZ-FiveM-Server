import Collection from '@discordjs/collection';

import { PhoneEvents } from '../../../typings/phone';
import { QBJob } from '../../../typings/qb';
import { SocietyNumberList } from '../../../typings/society';
import { Delay } from '../../utils/fivem';
import { Player } from './player.class';
import playerDB, { PlayerRepo } from './player.db';
import { PlayerAddData } from './player.interfaces';
import { playerLogger } from './player.utils';

class _PlayerService {
    private readonly playersBySource: Collection<number, Player>;
    private readonly playersByIdentifier: Collection<string, Player>;
    private readonly playerDB: PlayerRepo;

    constructor() {
        this.playersBySource = new Collection<number, Player>();
        this.playersByIdentifier = new Collection<string, Player>();
        this.playerDB = playerDB;
        playerLogger.debug('Player Service started');
    }

    /**
     * Adds a Player instance to the source & identifier maps
     * @param source - The player's source
     * @param player - The player instance to use as a value
     */

    addPlayerToMaps(source: number, player: Player) {
        this.playersBySource.set(source, player);
        this.playersByIdentifier.set(player.getIdentifier(), player);
    }

    /**
     * Deletes a player from both map by source & identifier
     * @param source - The player's source
     */
    deletePlayerFromMaps(source: number) {
        const identifier = this.playersBySource.get(source).getIdentifier();
        this.playersByIdentifier.delete(identifier);
        this.playersBySource.delete(source);
    }
    /**
     * Returns the player instance for a given source
     * Will return null if no player is found online with that source
     **/
    getPlayer(source: number): Player | null {
        const player = this.playersBySource.get(source);
        if (!player) return null;
        return player;
    }

    /**
     * Returns the player identifier for a given source
     * Will return null if no player is found online with that source
     **/
    getIdentifier(source: number): string {
        return this.getPlayer(source).getIdentifier();
    }

    /**
     * Returns the player phoneNumber for a passed identifier
     * @param identifier The players phone number
     */
    getPlayerFromIdentifier(identifier: string): Player | null {
        const player = this.playersByIdentifier.get(identifier);
        if (!player) {
            return null;
        }
        return player;
    }

    /**
     * Will return the given identifier from a phone number
     * @param phoneNumber - The phone number of the player
     * @param fetch - Whether to fetch for the identifier if they are offline
     **/
    async getIdentifierFromPhoneNumber(phoneNumber: string, fetch?: boolean): Promise<string | null> {
        const onlinePlayer = this.playersBySource.find((player: Player) => player.getPhoneNumber() === phoneNumber);
        // Return the player if they are online
        if (onlinePlayer) return onlinePlayer.getIdentifier();
        if (fetch) {
            const fetchResult: string | null = await this.playerDB
                .fetchIdentifierFromPhoneNumber(phoneNumber)
                .catch(e => {
                    playerLogger.error(
                        `Failed to fetch identifier from phone number for ${phoneNumber}, error: ${e.message}`
                    );
                    return null;
                });

            return fetchResult;
        }
        // Return null if all else doesn't return
        return null;
    }

    /**
     * We call this function on the event `playerJoined`,
     * only if the multicharacter option is set to false in the config.
     * @param player - The source of the player to handle
     */
    async handleNewPlayerJoined(player: any) {
        const username = `${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}`;
        playerLogger.info(`Started loading for ${username} (${player.PlayerData.source})`);
        // Ensure phone number exists or generate

        const newPlayer = new Player({
            identifier: player.PlayerData.citizenid,
            source: player.PlayerData.source,
            username,
            phoneNumber: player.PlayerData.charinfo.phone,
        });

        this.addPlayerToMaps(player.PlayerData.source, newPlayer);
        await this.handlePlayerJobUpdate(player.PlayerData.source, player.PlayerData.job);

        playerLogger.info('NPWD Player Loaded!');
        playerLogger.debug(newPlayer);

        // This is a stupid hack for development reloading
        // Client handlers are experiencing a race condition where the event
        // is sent out before the client handlers can load.
        if (process.env.NODE_ENV === 'development') {
            await Delay(100);
        }

        emitNet(PhoneEvents.SET_PLAYER_LOADED, player.PlayerData.source, true);
    }

    /**
     * We call this function on the event `playerJoined`,
     * only if the multicharacter option is set to false in the config.
     * @param source - The source of the player to handle
     * @param job - The source of the player to handle
     */
    async handlePlayerJobUpdate(source: number, job: QBJob) {
        const player = PlayerService.getPlayer(source);
        const jobId = job.id;

        if (SocietyNumberList[jobId] !== undefined) {
            player.setSocietyPhoneNumber(SocietyNumberList[jobId]);
        } else {
            player.setSocietyPhoneNumber(null);
        }

        // emitNet(PhoneEvents.SET_PLAYER_LOADED, player.PlayerData.source, true);
    }

    /**
     * Instantiate a basic Player instance from the constructor
     * @param src - The player source
     * @param identifier - The primary identifier
     *
     */

    async createNewPlayer({
        src,
        identifier,
        phoneNumber,
    }: {
        src: number;
        identifier: string;
        phoneNumber: string;
    }): Promise<Player | null> {
        const username = GetPlayerName(src.toString());

        return new Player({
            source: src,
            identifier,
            phoneNumber,
            username,
        });
    }

    /**
     * We call this function whenever we receive a `npwd:newPlayer`
     * event while multichar is enabled.
     * @param NewPlayerDTO - A DTO with all the new info required to instantiate a new player
     *
     */
    async handleNewPlayerEvent({ source: src, identifier, phoneNumber, firstname, lastname }: PlayerAddData) {
        const player = await this.createNewPlayer({
            src,
            identifier: identifier.toString(),
            phoneNumber,
        });

        if (firstname) player.setFirstName(firstname);
        if (lastname) player.setLastName(lastname);

        this.addPlayerToMaps(src, player);

        playerLogger.info(`New NPWD Player added through event (${src}) (${identifier})`);
        playerLogger.debug(player);

        emitNet(PhoneEvents.SET_PLAYER_LOADED, src, true);
    }

    /**
     * Return the attached identifier for a given phone number
     * @param phoneNumber The phone number to return identifier for
     * @param fetch Whether or not to query the database if a given player is offline
     **/
    async getIdentifierByPhoneNumber(phoneNumber: string, fetch?: boolean): Promise<string | null> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, player] of this.playersBySource) {
            if (player.getPhoneNumber() === phoneNumber) return player.getIdentifier();
        }
        // Whether we fetch from database if not found in online players
        if (fetch) {
            return await this.playerDB.fetchIdentifierFromPhoneNumber(phoneNumber);
        }
    }

    /**
     * Return all player with the given society number
     * @param phoneNumber The phone number to return identifier for
     **/
    async getPlayersFromSocietyNumber(phoneNumber: string): Promise<Player[]> {
        const players = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, player] of this.playersBySource) {
            if (player.getSocietyPhoneNumber() === phoneNumber) players.push(player);
        }
        return players;
    }

    /**
     * Return all player with the given society number
     * @param phoneNumber The phone number to return identifier for
     **/
    async getPlayersFromNumber(phoneNumber: string): Promise<Player | null> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, player] of this.playersBySource) {
            if (player.getPhoneNumber() === phoneNumber) return player;
        }
        return null;
    }

    /**
     * Unload event handler
     * @param src - Source of player being unloaded
     **/
    async handleUnloadPlayerEvent(src: number) {
        this.deletePlayerFromMaps(src);
        emitNet(PhoneEvents.SET_PLAYER_LOADED, src, false);
        playerLogger.info(`Unloaded NPWD Player, source: (${src})`);
    }
}

const PlayerService = new _PlayerService();

export default PlayerService;

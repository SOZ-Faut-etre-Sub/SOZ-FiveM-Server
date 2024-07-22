import { PlayerSyringeProvider } from '@private/server/player/player.syringe.provider';
import { Talent } from '@private/shared/talent';
import { BankMoneyType } from '@public/shared/bank';
import axios from 'axios';

import { On, Once, OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { CommandLoader } from '../../core/loader/command.loader';
import { Permissions } from '../../core/permissions';
import { ServerEvent } from '../../shared/event';
import {
    PlayerClientState,
    PlayerData,
    PlayerLicenceType,
    PlayerListStateKey,
    PlayerServerState,
} from '../../shared/player';
import { RpcServerEvent } from '../../shared/rpc';
import { InventoryFactory } from '../inventory/inventory.factory';
import { QBCore } from '../qbcore';
import { ServerStateService } from '../server.state.service';
import { PlayerListStateService } from './player.list.state.service';
import { PlayerMoneyService } from './player.money.service';
import { PlayerService } from './player.service';
import { PlayerStateService } from './player.state.service';

@Provider()
export class PlayerProvider {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(Permissions)
    private permissions: Permissions;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    @Inject(PlayerListStateService)
    private playerListStateService: PlayerListStateService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(CommandLoader)
    private commandLoader: CommandLoader;

    @Inject(PlayerSyringeProvider)
    private playerSyringeProvider: PlayerSyringeProvider;

    private jwtTokenCache: Record<string, string> = {};

    @On('QBCore:Server:PlayerLoaded', false)
    onPlayerLoaded(data: any) {
        const player = data.PlayerData as PlayerData;

        // This is an event from qb when player is fully loaded but screen is not faded out so we dont' trigger client event
        this.permissions.addPlayerRole(player.source, player.role);
        this.serverStateService.addPlayer(player);
        this.playerStateService.setClientState(player.source, {
            isWearingPatientOutfit: false,
            isInventoryBusy: false,
            isDead: player.metadata.isdead,
        });
        this.playerListStateService.handlePlayer(player, this.playerStateService.getClientState(player.source));
        this.sendSuggestions(player);

        TriggerEvent(ServerEvent.PLAYER_LOADED, player.source, player);
    }

    @On('QBCore:Server:PlayerUpdate', false)
    async onPlayerUpdate(player: PlayerData) {
        this.serverStateService.updatePlayer(player);
        this.playerListStateService.handlePlayer(player, this.playerStateService.getClientState(player.source));

        const playerInventory = await this.inventoryFactory.getPlayerInventory(player.source);

        if (!playerInventory) {
            return;
        }

        const strengthMultiplier = player.metadata.strength / 100;
        let weight = 20000 * strengthMultiplier;

        if (player.metadata.criminal_talents.includes(Talent.UpgradeWeight)) {
            weight += 10000;
        }

        if (this.playerSyringeProvider.hasTemporaryCrimiWeight(player.source)) {
            weight += 40000;
        }

        const baseBag = player.cloth_config.BaseClothSet?.Components?.['5']?.Drawable || 0;
        const jobBag = player.cloth_config.JobClothSet?.Components?.['5']?.Drawable || 0;

        if ((baseBag !== 0 || jobBag !== 0) && !player.cloth_config.Config.HideBag) {
            weight += 40000;
        }

        if (playerInventory.maxWeight() !== weight) {
            console.log(
                'set weight to',
                weight,
                'for',
                player.source,
                'from',
                playerInventory.maxWeight(),
                'to',
                weight
            );

            playerInventory.updateConfiguration({
                maxWeight: weight,
            });

            await playerInventory.observe();
        }
    }

    @On('QBCore:Server:PlayerUnload', false)
    onPlayerUnload(source: number) {
        this.serverStateService.removePlayer(source);
        this.playerListStateService.removePlayer(source);
    }

    @Once()
    onStart() {
        const connectedSources = this.QBCore.getPlayersSources();

        for (const source of connectedSources) {
            const player = this.QBCore.getPlayer(source);

            this.serverStateService.addPlayer(player.PlayerData);
            this.permissions.addPlayerRole(source, player.PlayerData.role);
            this.playerListStateService.handlePlayer(
                player.PlayerData,
                this.playerStateService.getClientState(player.PlayerData.source)
            );

            // Trigger client event to existing clieant (only useful for dev)
            TriggerClientEvent('QBCore:Client:OnPlayerLoaded', player.PlayerData.source);
            this.sendSuggestions(player.PlayerData);
        }
    }

    @Rpc(RpcServerEvent.PLAYER_GET_SERVER_STATE)
    public getServerState(source: number): PlayerServerState {
        return this.playerStateService.getServerState(source);
    }

    @Rpc(RpcServerEvent.PLAYER_GET_CLIENT_STATE)
    public getClientState(source: number, target: number | null): PlayerClientState {
        return this.playerStateService.getClientState(target ?? source);
    }

    @Rpc(RpcServerEvent.PLAYER_GET_LIST_STATE)
    public getListState(): Record<PlayerListStateKey, number[]> {
        return this.playerListStateService.getStates();
    }

    @Exportable('GetPlayerState')
    public getState(source: number): PlayerClientState {
        return this.playerStateService.getClientState(source);
    }

    @Exportable('SetPlayerState')
    @OnEvent(ServerEvent.PLAYER_UPDATE_STATE)
    public setPlayerClientState(source: number, stateUpdate: Partial<PlayerClientState>): PlayerClientState {
        return this.playerStateService.setClientState(source, stateUpdate);
    }

    @Rpc(RpcServerEvent.PLAYER_GET_JWT_TOKEN)
    public async getJwtToken(source: number): Promise<string | null> {
        const steam = this.playerStateService.getIdentifier(source.toString());

        if (this.jwtTokenCache[steam]) {
            return this.jwtTokenCache[steam];
        }

        const url = GetConvar('soz_api_endpoint', 'https://api.soz.zerator.com') + '/accounts/create-token/' + steam;

        const response = await axios.get(url, {
            auth: {
                username: GetConvar('soz_api_username', 'admin'),
                password: GetConvar('soz_api_password', 'admin'),
            },
            validateStatus: () => true,
        });

        if (response.status === 200) {
            this.jwtTokenCache[steam] = response.data.token;
            return response.data.toString();
        }

        return null;
    }

    @Rpc(RpcServerEvent.PLAYER_GET_LICENCES)
    public async getLicences(source: number, target: number): Promise<Partial<Record<PlayerLicenceType, number>>> {
        return this.serverStateService.getPlayer(target).metadata.licences;
    }

    @Exportable('RemovePlayerMoney')
    @OnEvent(ServerEvent.PLAYER_UPDATE_STATE)
    public removePlayerMoney(source: number, money: number, type: BankMoneyType = 'money'): boolean {
        return this.playerMoneyService.remove(source, money, type);
    }

    @Exportable('IsOnDuty')
    public isOnDuty(source: number): boolean {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return false;
        }
        return player.job.onduty;
    }

    private sendSuggestions(player: PlayerData) {
        const commands = this.commandLoader.getCommands();
        const suggestions = commands
            .filter(command => {
                if (!command.role) {
                    return true;
                }

                if (Array.isArray(command.role)) {
                    return command.role.includes(player.role);
                }

                return command.role === player.role;
            })
            .map(command => {
                return {
                    name: '/' + command.name,
                    help: command.description,
                    params: command.arguments,
                };
            });

        TriggerClientEvent('chat:addSuggestions', player.source, suggestions);
    }
}

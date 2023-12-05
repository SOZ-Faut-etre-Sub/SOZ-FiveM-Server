import { Get, Post } from '../../core/decorators/http';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Request } from '../../core/http/request';
import { Response } from '../../core/http/response';
import { BillboardService } from '../billboard/billboard.service';
import { ItemService } from '../item/item.service';
import { PlayerService } from '../player/player.service';
import { PlayerStateService } from '../player/player.state.service';

@Provider()
export class ApiProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BillboardService)
    private billboardService: BillboardService;

    @Get('/active-players')
    public async getActivePlayers(): Promise<Response> {
        const playerCount = GetNumPlayerIndices();
        const players: Record<string, string> = {};

        for (let i = 0; i < playerCount; i++) {
            const source = GetPlayerFromIndex(i);
            const identifier = this.playerStateService.getIdentifier(source);

            players[identifier] = source;
        }

        return Response.json(players);
    }

    @Get('/items')
    public async getItems(): Promise<Response> {
        const items = this.itemService.getItems();

        return Response.json(items);
    }

    @Post('/kick-player')
    public async kickPlayer(request: Request): Promise<Response> {
        const data = JSON.parse(await request.body);
        DropPlayer(data.player, data.reason);

        return Response.ok('Player kicked');
    }

    @Post('/set-rpDeath')
    public async rpDeath(request: Request): Promise<Response> {
        const data = JSON.parse(await request.body);
        const player = this.playerService.getPlayerByCitizenId(data.player);
        if (player && player.source) {
            this.playerService.setPlayerMetadata(player.source, 'rp_death', data.value);
        }
        return Response.ok();
    }

    @Post('/twitch-news/update-billboard')
    public async updateBillboard(request: Request): Promise<Response> {
        const data = JSON.parse(await request.body);
        const billboardId = data.billboardId;

        try {
            this.billboardService.updateBillboard(source, billboardId);
        } catch (error) {
            return Response.internalServerError("La mise à jour du panneau d'affichage à échouée");
        }
        return Response.ok();
    }

    @Post('/twitch-news/delete-billboard')
    public async deleteBillboard(request: Request): Promise<Response> {
        const data = JSON.parse(await request.body);
        const billboardId = data.billboardId;
        try {
            this.billboardService.deleteBillboard(source, billboardId);
        } catch (error) {
            return Response.internalServerError("La supression du panneau d'affichage à échouée");
        }
        return Response.ok();
    }
}

import { Get, Post } from '../../core/decorators/http';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Request } from '../../core/http/request';
import { Response } from '../../core/http/response';
import { ItemService } from '../item/item.service';
import { PlayerStateService } from '../player/player.state.service';

@Provider()
export class ApiProvider {
    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerStateService)
    private playerStateService: PlayerStateService;

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
}

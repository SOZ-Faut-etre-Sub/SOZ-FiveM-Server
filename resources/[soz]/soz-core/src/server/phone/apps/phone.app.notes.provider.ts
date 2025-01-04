import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../../core/decorators/injectable';
import { Rpc } from '../../../core/decorators/rpc';
import { RpcServerEvent } from '../../../shared/rpc';
import { PrismaService } from '../../database/prisma.service';
import { PlayerService } from '../../player/player.service';

@Provider()
export class PhoneAppNotesProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Rpc(RpcServerEvent.PHONE_APP_NOTES_GET)
    async getNotes(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.phone_notes.findMany({
            select: {
                id: true,
                title: true,
                content: true,
            },
            where: {
                identifier: player.citizenid,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_NOTES_ADD)
    async addNote(source: number, title: string, content: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.phone_notes.create({
            data: {
                title,
                content,
                identifier: player.citizenid,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_NOTES_UPDATE)
    async updateNote(source: number, id: number, title: string, content: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.phone_notes.update({
            where: { id, identifier: player.citizenid },
            data: {
                title,
                content,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_APP_NOTES_DELETE)
    async deleteNote(source: number, id: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.phone_notes.delete({
            where: { id, identifier: player.citizenid },
        });
    }
}

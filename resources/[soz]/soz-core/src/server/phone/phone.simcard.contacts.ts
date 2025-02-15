import { Prisma } from '@prisma/client';
import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../core/decorators/injectable';
import { Rpc } from '../../core/decorators/rpc';
import { Contact, ContactDTO } from '../../shared/phone/simcard';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { PlayerService } from '../player/player.service';

@Provider()
export class PhoneSimCardContacts {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CONTACTS_GET)
    async getContacts(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.$queryRaw(
            Prisma.sql`
                SELECT phone_contacts.*, phone_profile.avatar as avatar
                FROM phone_contacts
                         LEFT JOIN phone_profile ON phone_contacts.number = phone_profile.number
                WHERE identifier = ${player.citizenid}
            `
        );
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CONTACTS_ADD)
    async addContact(source: number, contact: ContactDTO): Promise<Contact> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.phone_contacts.create({
            data: {
                identifier: player.citizenid,
                display: contact.display,
                number: contact.number,
            },
        });
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CONTACTS_UPDATE)
    async updateContact(source: number, id: number, contact: ContactDTO): Promise<Contact> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.phone_contacts.update({
            where: {
                id,
                identifier: player.citizenid,
            },
            data: contact,
        });
    }

    @Rpc(RpcServerEvent.PHONE_SIMCARD_CONTACTS_REMOVE)
    async deleteContact(source: number, id: number): Promise<Contact> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        return this.prismaService.phone_contacts.delete({
            where: {
                id,
                identifier: player.citizenid,
            },
        });
    }
}

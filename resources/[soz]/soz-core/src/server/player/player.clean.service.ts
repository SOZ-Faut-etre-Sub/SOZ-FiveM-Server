import { Inject, Injectable } from '../../core/decorators/injectable';
import { PrismaService } from '../database/prisma.service';
import { Monitor } from '../monitor/monitor';

@Injectable()
export class PlayerCleanService {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Monitor)
    private monitor: Monitor;

    async getPlayerToCleans(): Promise<string[]> {
        const playersToClean = (await this.prismaService.$queryRawUnsafe(
            `SELECT p.citizenId
             FROM soz_fivem.player p
                      INNER JOIN soz_fivem.housing_apartment h ON h.owner = p.citizenId
             WHERE p.last_updated < DATE_SUB(CURDATE(),INTERVAL 30 DAY) AND p.is_default = 0`
        )) as { citizenId: string }[];

        const ids = [];

        for (const data of playersToClean) {
            ids.push(data.citizenId);
        }

        const deletedPlayersToClean = (await this.prismaService.$queryRawUnsafe(
            `SELECT p.citizenId
             FROM soz_fivem.player p
                LEFT JOIN soz_api.account_identities ai ON p.license = ai.identityId AND ai.identityType = 'STEAM'
                INNER JOIN soz_fivem.housing_apartment h ON h.owner = p.citizenId
             WHERE ai.identityType IS NULL AND p.is_default = 0`
        )) as { citizenId: string }[];

        for (const data of deletedPlayersToClean) {
            ids.push(data.citizenId);
        }

        // return unique value
        return [...new Set(ids)];
    }

    async cleanPlayerHouses(disabledCitizenIds: string[]): Promise<[number, number]> {
        const housingOwnerIdentifiers = await this.prismaService.housing_apartment.findMany({
            select: {
                identifier: true,
            },
            where: {
                owner: {
                    in: disabledCitizenIds,
                },
            },
        });

        const housingOwnerUpdated = await this.prismaService.housing_apartment.updateMany({
            where: {
                identifier: {
                    in: housingOwnerIdentifiers.map(h => h.identifier),
                },
            },
            data: {
                owner: null,
                roommate: null,
                tier: null,
                has_parking_place: null,
            },
        });

        await this.prismaService.storages.updateMany({
            where: {
                owner: {
                    in: housingOwnerIdentifiers.map(h => h.identifier),
                },
            },
            data: {
                inventory: null,
            },
        });

        await this.prismaService.playerVehicle.updateMany({
            where: {
                garage: {
                    in: housingOwnerIdentifiers.map(h => 'apartment_' + h.identifier),
                },
            },
            data: {
                garage: 'airport_public',
            },
        });

        await this.prismaService.bank_accounts.updateMany({
            where: {
                houseid: {
                    in: housingOwnerIdentifiers.map(h => 'property_' + h.identifier),
                },
            },
            data: {
                money: 0,
                marked_money: 0,
            },
        });

        const housingRoommateUpdated = await this.prismaService.housing_apartment.updateMany({
            data: {
                roommate: null,
            },
            where: {
                roommate: {
                    in: disabledCitizenIds,
                },
            },
        });

        this.monitor.publish(
            'house_owner_cleanup',
            {},
            {
                cititzenIds: JSON.stringify(disabledCitizenIds),
                house: JSON.stringify(housingOwnerIdentifiers.map(h => h.identifier)),
            }
        );

        return [housingOwnerUpdated.count, housingRoommateUpdated.count];
    }
}

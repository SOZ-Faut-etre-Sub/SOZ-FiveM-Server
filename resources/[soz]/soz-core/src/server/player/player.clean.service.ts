import { Inject, Injectable } from '../../core/decorators/injectable';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PlayerCleanService {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    async getPlayerToCleans(): Promise<string[]> {
        const playersToClean = (await this.prismaService.$queryRawUnsafe(
            `SELECT p.citizenId
             FROM soz_api.accounts a
                      INNER JOIN soz_api.account_identities ai ON a.id = ai.accountId AND ai.identityType = 'STEAM'
                      INNER JOIN soz_fivem.player p ON ai.identityId = p.license
             WHERE a.updatedAt < DATE_SUB(CURDATE(),INTERVAL 30 DAY) AND a.whitelistStatus IN ('DENIED', 'INACTIVE') AND p.is_default = 1`
        )) as { citizenId: string }[];

        const ids = [];

        for (const data of playersToClean) {
            ids.push(data.citizenId);
        }

        const deletedPlayersToClean = (await this.prismaService.$queryRawUnsafe(
            `SELECT p.citizenId FROM soz_fivem.player p LEFT JOIN soz_api.account_identities ai ON p.license = ai.identityId AND ai.identityType = 'STEAM' WHERE ai.identityType IS NULL AND p.is_default = 1`
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

        return [housingOwnerUpdated.count, housingRoommateUpdated.count];
    }
}

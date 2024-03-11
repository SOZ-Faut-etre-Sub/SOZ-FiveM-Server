import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Door } from '@public/shared/door';
import { ServerEvent } from '@public/shared/event';

import { PrismaService } from '../database/prisma.service';
import { DoorRepository } from '../repository/door.repository';

@Provider()
export class DoorProvider {
    @Inject(DoorRepository)
    public doorRepository: DoorRepository;

    @Inject(PrismaService)
    public prismaService: PrismaService;

    @OnEvent(ServerEvent.DOOR_ADD_UPDATE)
    public async doorAddUpdate(source: number, door: Door) {
        console.log(door);
        door.subdoors.forEach(sub => delete sub['entity']);

        await this.prismaService.door.upsert({
            create: {
                id: door.id,
                data: JSON.stringify(door),
            },
            update: {
                data: JSON.stringify(door),
            },
            where: {
                id: door.id,
            },
        });

        await this.doorRepository.set(door.id, door);
    }

    @OnEvent(ServerEvent.DOOR_DELETE)
    public async doorDelete(source: number, doorId: string) {
        this.doorRepository.delete(doorId);
        await this.prismaService.door.delete({
            where: {
                id: doorId,
            },
        });
    }
}

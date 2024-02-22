import { Module } from '../../../core/decorators/module';
import { FightForStyleHarvestProvider } from './ffs.harvest.provider';
import { FightForStyleRestockProvider } from './ffs.restock.provider';
import { FightForStylShowRoomProvider } from './ffs.showroom.provider';

@Module({
    providers: [FightForStyleHarvestProvider, FightForStyleRestockProvider, FightForStylShowRoomProvider],
})
export class FightForStyleModule {}

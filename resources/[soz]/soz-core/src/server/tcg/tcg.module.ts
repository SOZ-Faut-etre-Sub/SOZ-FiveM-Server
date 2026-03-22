import { Module } from '../../core/decorators/module';

import { TcgProvider } from './tcg.provider';

@Module({
    providers: [TcgProvider],
})
export class TcgModule {}

import { Module } from '@core/decorators/module';

import { GouvProvider } from './gouv.provider';

@Module({
    providers: [GouvProvider],
})
export class GouvModule {}

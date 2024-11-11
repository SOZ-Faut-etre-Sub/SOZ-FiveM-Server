import { Module } from '@core/decorators/module';

import { ViewModeProvider } from './view.mode.provider';

@Module({
    providers: [ViewModeProvider],
})
export class AimModule {}

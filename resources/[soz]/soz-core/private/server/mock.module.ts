import { Module } from '@core/decorators/module';

import { MockProvider } from './mock.provider';

@Module({
    providers: [MockProvider],
})
export class MockModule {}

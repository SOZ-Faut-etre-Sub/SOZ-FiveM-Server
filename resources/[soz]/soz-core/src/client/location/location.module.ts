import { Module } from '@public/core/decorators/module';

import { LocationProvider } from './location.provider';

@Module({
    providers: [LocationProvider],
})
export class LocationModule {}

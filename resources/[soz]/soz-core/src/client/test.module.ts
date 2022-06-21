import { Module } from '../core/decorators/module';
import { TestProvider } from './test.provider';

@Module({
    providers: [TestProvider],
})
export class TestClientModule {}

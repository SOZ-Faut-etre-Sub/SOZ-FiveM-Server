import { Module } from '../../../core/decorators/module';
import { NewsFarmProvider } from './news.farm.provider';

@Module({
    providers: [NewsFarmProvider],
})
export class NewsModule {}

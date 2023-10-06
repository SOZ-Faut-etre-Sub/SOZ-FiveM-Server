import { Module } from '../../../core/decorators/module';
import { NewsFarmProvider } from './news.farm.provider';
import { NewsProvider } from './news.provider';

@Module({
    providers: [NewsFarmProvider, NewsProvider],
})
export class NewsModule {}

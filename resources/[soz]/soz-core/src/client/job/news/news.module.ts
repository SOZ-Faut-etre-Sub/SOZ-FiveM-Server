import { Module } from '@core/decorators/module';

import { NewsMenuProvider } from './news.menu.provider';
import { NewsProvider } from './news.provider';

@Module({
    providers: [NewsMenuProvider, NewsProvider],
})
export class NewsModule {}

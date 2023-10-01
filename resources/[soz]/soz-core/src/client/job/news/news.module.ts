import { Module } from '@core/decorators/module';

import { NewsMenuProvider } from './news.menu.provider';
import { NewsTwitchProvider } from './news.twitch.provider';

@Module({
    providers: [NewsMenuProvider, NewsTwitchProvider],
})
export class NewsModule {}

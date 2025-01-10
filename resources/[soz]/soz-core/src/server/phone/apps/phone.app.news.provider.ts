import { Provider } from '@public/core/decorators/provider';

import { Inject } from '../../../core/decorators/injectable';
import { Rpc } from '../../../core/decorators/rpc';
import { ClientEvent } from '../../../shared/event/client';
import { NewsMessage } from '../../../shared/phone/apps/news';
import { RpcServerEvent } from '../../../shared/rpc';
import { ApiNewsProvider } from '../../api/api.news.provider';
import { PrismaService } from '../../database/prisma.service';

@Provider()
export class PhoneAppNewsProvider {
    @Inject(PrismaService)
    private readonly prismaService: PrismaService;

    @Inject(ApiNewsProvider)
    private readonly apiNewsProvider: ApiNewsProvider;

    @Rpc(RpcServerEvent.PHONE_APP_NEWS_GET)
    async getNews() {
        const news = await this.prismaService.phone_twitch_news.findMany({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return news.map(n => ({ ...n, createdAt: n.createdAt.getTime() }));
    }

    @Rpc(RpcServerEvent.PHONE_APP_NEWS_CREATE)
    async createNews(_source: number, message: NewsMessage) {
        const news = await this.prismaService.phone_twitch_news.create({
            data: {
                type: message.type,
                image: message.image,
                message: message.message,
                reporter: message.reporter,
                reporterId: message.reporterId,
                job: message.job || 'news',
            },
        });

        const newsData = { ...news, createdAt: news.createdAt.getTime() };

        await this.apiNewsProvider.sendFlashNews(newsData);
        TriggerClientEvent(ClientEvent.PHONE_APP_NEWS_BROADCAST, -1, newsData);
        TriggerClientEvent(ClientEvent.NEWS_DRAW, -1, message.type, message.message, message.reporter, message.job);
    }
}

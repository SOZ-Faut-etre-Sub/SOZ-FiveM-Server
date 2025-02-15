import { atom, useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';

import { NewsMessage } from '../../../../../shared/phone/apps/news';
import { useNuiEvent } from '../../../../hook/nui';
import { useInjectDebugData } from '../../system/debug/hooks/useInjectDebugData';

export const newsAtom = atom<NewsMessage[]>([]);

export const useNews = () => useAtomValue(newsAtom);

export const useAppNewsStateHandlers = () => {
    const setNews = useSetAtom(newsAtom);

    useNuiEvent('phone', 'AppNewsSetData', setNews);
    useNuiEvent('phone', 'AppNewsAddData', (data: NewsMessage) => setNews(prev => [data, ...prev]));

    useInjectDebugData(() => {
        setNews([
            {
                id: 1,
                type: 'annonce',
                message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
                createdAt: new Date().getTime(),
                job: 'news',
            },
            {
                id: 2,
                type: 'breaking-news',
                image: 'https://soz.zerator.com/static/game/images/default/cat.webp',
                message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
                createdAt: new Date().getTime() + 1000,
                job: 'you-news',
            },
            {
                id: 3,
                type: 'publicité',
                message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
                createdAt: new Date().getTime() + 2000,
                job: 'news',
            },
            {
                id: 4,
                type: 'fait-divers',
                image: 'https://soz.zerator.com/static/game/images/default/cat.webp',
                message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
                createdAt: new Date().getTime() + 3000,
                job: 'news',
            },
            {
                id: 5,
                type: 'info-trafic',
                image: 'https://soz.zerator.com/static/game/images/default/cat.webp',
                message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
                createdAt: new Date().getTime() + 4000,
                job: 'news',
            },
            {
                id: 6,
                type: 'lspd',
                message: 'Jean test',
                createdAt: new Date().getTime() + 5000,
                job: 'lspd',
            },
            {
                id: 7,
                type: 'bcso',
                message: 'Jean test',
                createdAt: new Date().getTime() + 6000,
                job: 'bcso',
            },
            {
                id: 8,
                type: 'lspd:end',
                message: 'Jean test',
                createdAt: new Date().getTime() + 7000,
                job: 'lspd',
            },
            {
                id: 9,
                type: 'bcso:end',
                message: 'Jean test',
                createdAt: new Date().getTime() + 8000,
                job: 'bcso',
            },
        ]);
    });
};

import { FunctionComponent, useCallback, useEffect, useState } from 'react';

import { uuidv4 } from '../../../core/utils';
import { JobType } from '../../../shared/job';
import { News } from '../../../shared/news';
import { useNuiEvent } from '../../hook/nui';

type BannerProps = {
    index: number;
    news: News;
    onDelete: () => void;
};

const Banner: FunctionComponent<BannerProps> = ({ index, news, onDelete }) => {
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isClosing) {
            const timeoutId = setTimeout(onDelete, 300);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [isClosing, onDelete]);

    useEffect(() => {
        const timeoutId = setTimeout(() => setIsClosing(true), 15000);

        return () => clearTimeout(timeoutId);
    }, []);

    const newsTitle = (type: string) => {
        if (type.includes('reboot')) {
            return '';
        }

        if (['lspd', 'bcso', 'sasp'].includes(news.type)) {
            return 'Avis de recherche';
        } else if (
            type === 'fbi_annoncement' ||
            type === 'sasp_annoncement' ||
            type === 'gouv' ||
            type === 'presidence'
        ) {
            return 'Annonce';
        } else {
            return type;
        }
    };

    let backgroundImage;
    let authorType = 'Reporter:';

    switch (news.type) {
        case 'lspd':
            backgroundImage = '/public/images/twitch-news/lspd.webp';
            authorType = 'Agent:';
            break;
        case 'bcso':
            backgroundImage = '/public/images/twitch-news/bcso.webp';
            authorType = 'Agent:';
            break;
        case 'fbi':
        case 'fbi_annoncement':
            backgroundImage = '/public/images/twitch-news/fbi.webp';
            authorType = 'Agent:';
            break;
        case 'sasp':
        case 'sasp_annoncement':
            backgroundImage = '/public/images/twitch-news/sasp.webp';
            authorType = 'Agent:';
            break;
        case 'gouv':
            backgroundImage = '/public/images/twitch-news/gouv.webp';
            authorType = 'Agent:';
            break;
        case 'presidence':
            backgroundImage = '/public/images/twitch-news/presidence.webp';
            authorType = '';
            break;
        case 'reboot_5':
            backgroundImage = 'https://soz.zerator.com/static/images/reboot_5.png';
            break;
        case 'reboot_15':
            backgroundImage = 'https://soz.zerator.com/static/images/reboot_15.png';
            break;
        default:
            if (news.job === JobType.YouNews) {
                backgroundImage = '/public/images/twitch-news/younews.webp';
            } else {
                backgroundImage = '/public/images/twitch-news/default.webp';
            }
            break;
    }

    return (
        <div
            className="absolute w-full bottom-0 overflow-hidden mb-[.3rem] transition-all text-white bg-no-repeat bg-contain"
            style={{
                transform: `translateX(${index * 0.5}rem) translateY(-${index * 0.5}rem)`,
                opacity: `calc(1.0 - ${index * 0.3})`,
                backgroundImage: `url(${backgroundImage})`,
                aspectRatio: '2.5',
            }}
        >
            <h3 className="flex h-[25%] justify-end text-4xl items-center pr-4 uppercase">{newsTitle(news.type)}</h3>
            <div className="pl-[28%] h-[62%] text-[0.91rem] lg:text-lg">
                {['lspd', 'bcso', 'sasp'].includes(news.type) ? (
                    <p className="flex flex-col justify-between p-2 h-full overflow-hidden break-words">
                        <p>
                            Les forces de l'ordre sont à la recherche de <strong>{news.message}</strong>.
                        </p>
                        <p>
                            Si vous avez des informations sur cette personne, veuillez les communiquer au{' '}
                            <strong style={{ textTransform: 'uppercase' }}>555-{news.type}</strong>.
                        </p>
                    </p>
                ) : (
                    <>
                        {!news.type.includes('reboot') && (
                            <div className="flex flex-col justify-between p-1 h-full">
                                <p className="max-h-40 overflow-hidden break-words">{news.message}</p>
                                <p className="text-right pr-4 text-lg">
                                    {authorType} <strong>{news.reporter}</strong>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export const NewsBanner: FunctionComponent = () => {
    const [news, setNews] = useState<News[]>([]);

    useNuiEvent('hud', 'AddNews', news => {
        setNews(n => [
            {
                id: uuidv4(),
                ...news,
            },
            ...n,
        ]);
    });

    const deleteNews = useCallback(
        (id: string) => {
            setNews(s => s.filter(n => n.id !== id));
        },
        [setNews]
    );

    return (
        <div className="absolute bottom-[1vh] left-[35vw] right-0 w-[30vw] z-20">
            {news.map((n, i) => (
                <Banner key={n.id} index={news.length - 1 - i} news={n} onDelete={() => deleteNews(n.id)} />
            ))}
        </div>
    );
};

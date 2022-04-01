import {TwitchNewsMessage} from "@typings/twitch-news";

export const MockTwitchNewsMessages: TwitchNewsMessage[] = [
    {
        id: 1,
        type: 'annonce',
        message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
        createdAt: '2022-01-14T09:58:18.000Z'
    },
    {
        id: 2,
        type: 'breaking-news',
        image: 'https://placekitten.com/1920/1080',
        message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
        createdAt: '2022-01-14T09:58:18.000Z'
    },
    {
        id: 3,
        type: 'publicité',
        message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
        createdAt: '2022-01-14T09:58:18.000Z'
    },
    {
        id: 4,
        type: 'fait-divers',
        image: 'https://placekitten.com/1920/1080',
        message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
        createdAt: '2022-01-14T09:58:18.000Z'
    },
    {
        id: 5,
        type: 'info-traffic',
        image: 'https://placekitten.com/1920/1080',
        message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
        createdAt: '2022-01-14T09:58:18.000Z'
    },
];

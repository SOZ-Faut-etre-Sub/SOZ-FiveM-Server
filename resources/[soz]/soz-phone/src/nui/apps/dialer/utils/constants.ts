import { CallHistoryItem } from '@typings/call';

export const MockHistoryData: CallHistoryItem[] = [
    {
        id: 1,
        identifier: 'ca839e8c-ef9d-40bd-b6a3-d531ee58149f',
        transmitter: '215-8139',
        receiver: '704-1549',
        is_accepted: true,
        start: '2022-05-11 20:04:21.0',
        end: null,
    },
    {
        id: 2,
        identifier: 'b8080a50-ad30-4ee9-84cb-00688e2bf167',
        transmitter: '704-1549',
        receiver: '704-1549',
        is_accepted: false,
        start: '2022-05-15 21:04:21.0',
        end: null,
    },
    {
        id: 3,
        identifier: 'b8080a50-ad30-4ee9-84cb-00688e2bf167',
        transmitter: '215-8139',
        receiver: '704-1549',
        is_accepted: false,
        start: '2022-05-15 21:10:21.0',
        end: null,
    },
    {
        id: 4,
        identifier: 'b8080a50-ad30-4ee9-84cb-00688e2bf167',
        transmitter: '215-8139',
        receiver: '704-1549',
        is_accepted: false,
        start: '2022-04-01 21:10:21.0',
        end: null,
    },
];

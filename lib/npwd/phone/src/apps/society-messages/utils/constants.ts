import {SocietyMessage} from "@typings/society";

export const MockSocietyMessages: SocietyMessage[] = [
    {
        id: 1,
        conversation_id: '555-LSPD',
        source_phone: '603-275-8373',
        message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
        position: '{"x":205.12088012695312,"y":1160.4395751953125,"z":226.99560546875}',
        isTaken: false,
        takenBy: null,
        takenByUsername: null,
        isDone: false,
        createdAt: '2022-01-14T09:58:18.000Z',
        updatedAt: '2022-01-14T09:58:18.000Z'
    },
    {
        id: 2,
        conversation_id: '555-LSPD',
        source_phone: '555-1234',
        message: 'Lorem ipsum dolor sit amet, cons ectetur adipis cing elit.',
        position: null,
        isTaken: true,
        takenBy: 'XXX',
        takenByUsername: 'John Doe',
        isDone: false,
        createdAt: '2022-01-14T09:58:18.000Z',
        updatedAt: '2022-01-14T09:58:18.000Z'
    },
    {
        id: 3,
        conversation_id: '555-LSPD',
        source_phone: '555-1234',
        message: 'Lorem ipsum dolor sit amet, cons ctetur adipi scing elit.',
        position: null,
        isTaken: true,
        takenBy: 'XXX',
        takenByUsername: 'John Doe',
        isDone: true,
        createdAt: '2022-01-14T09:58:18.000Z',
        updatedAt: '2022-01-14T09:58:18.000Z'
    },
    {
        id: 4,
        conversation_id: '555-LSPD',
        source_phone: '',
        message: 'Lorem ipsum dolor sit amet, cons ctetur adipi scing elit.',
        position: '{"x":205.12088012695312,"y":1160.4395751953125,"z":226.99560546875}',
        isTaken: true,
        takenBy: 'XXX',
        takenByUsername: 'John Doe',
        isDone: true,
        createdAt: '2022-01-14T09:58:18.000Z',
        updatedAt: '2022-01-14T09:58:18.000Z'
    },
];

for (let i = 5; i < 20; i++) {
    MockSocietyMessages.push({
        id: i,
        conversation_id: '555-LSPD',
        source_phone: '',
        message: 'Lorem ipsum dolor sit amet, cons ctetur adipi scing elit.',
        position: '{"x":205.12088012695312,"y":1160.4395751953125,"z":226.99560546875}',
        isTaken: true,
        takenBy: 'XXX',
        takenByUsername: 'John Doe',
        isDone: true,
        createdAt: '2022-01-14T09:58:18.000Z',
        updatedAt: '2022-01-14T09:58:18.000Z'
    },)
}

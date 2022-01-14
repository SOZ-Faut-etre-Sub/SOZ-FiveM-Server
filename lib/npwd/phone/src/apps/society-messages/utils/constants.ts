import {SocietyMessage} from "@typings/society";

export const MockSocietyMessages: SocietyMessage[] = [
  {
    id: 1,
    conversation_id: '555-LSPD',
    source_phone: '555-1234',
    message: 'Lorem ipsum dolor sit amet, conse ctetur adip iscing elit.',
    position: '{"x":205.12088012695312,"y":1160.4395751953125,"z":226.99560546875}',
    isTaken: false,
    isDone: false,
    createdAt: new Date().getTime()/1000,
    updatedAt: new Date().getTime()/1000
  },
  {
    id: 2,
    conversation_id: '555-LSPD',
    source_phone: '555-1234',
    message: 'Lorem ipsum dolor sit amet, cons ectetur adipis cing elit.',
    position: null,
    isTaken: true,
    isDone: false,
    createdAt: new Date().getTime()/1000,
    updatedAt: new Date().getTime()/1000
  },
  {
    id: 2,
    conversation_id: '555-LSPD',
    source_phone: '555-1234',
    message: 'Lorem ipsum dolor sit amet, cons ctetur adipi scing elit.',
    position: null,
    isTaken: true,
    isDone: true,
    createdAt: new Date().getTime()/1000,
    updatedAt: new Date().getTime()/1000
  },
  {
    id: 2,
    conversation_id: '555-LSPD',
    source_phone: '',
    message: 'Lorem ipsum dolor sit amet, cons ctetur adipi scing elit.',
    position: '{"x":205.12088012695312,"y":1160.4395751953125,"z":226.99560546875}',
    isTaken: true,
    isDone: true,
    createdAt: new Date().getTime()/1000,
    updatedAt: new Date().getTime()/1000
  },
];

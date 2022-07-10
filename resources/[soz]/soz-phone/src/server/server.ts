// Setup controllers
import './db/pool';
import './players/player.controller';
import './calls/calls.controller';
import './notes/notes.controller';
import './contacts/contacts.controller';
import './photo/photo.controller';
import './messages/messages.controller';
import './marketplace/marketplace.controller';
import './societies/societies.controller';
import './twitch-news/twitch-news.controller';
import './settings/settings.controller';

import { mainLogger } from './sv_logger';

on('onServerResourceStart', (resource: string) => {
    if (resource === GetCurrentResourceName()) {
        mainLogger.info('Sucessfully started');
    }
});

import { ResourceConfig } from '../../typings/config';
// Setup and export config loaded at runtime
export const config: ResourceConfig = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);

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
import './settings/settings.controller';

import { mainLogger } from './sv_logger';

on('onServerResourceStart', (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    mainLogger.info('Sucessfully started');
  }
});

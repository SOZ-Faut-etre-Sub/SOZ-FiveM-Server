import { ResourceConfig } from '../../typings/config';
import { RewriteFrames } from '@sentry/integrations';
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
import * as Sentry from '@sentry/node';

// Setup sentry tracing
if (config.debug.sentryEnabled && process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://1bb64a7c88794547834d7ed7643e9575@o1133416.ingest.sentry.io/6185350',
    integrations: [new RewriteFrames()],
    release: process.env.SENTRY_RELEASE || '0.0.0',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

on('onServerResourceStart', (resource: string) => {
  if (resource === GetCurrentResourceName()) {
    mainLogger.info('Sucessfully started');
  }
});

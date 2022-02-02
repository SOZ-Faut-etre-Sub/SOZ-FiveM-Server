import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import './main.css';
import PhoneConfig from './config/default.json';
import { PhoneProviders } from './PhoneProviders';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { RewriteFrames } from '@sentry/integrations';
import attachWindowDebug from './os/debug/AttachWindowDebug';
import { createBrowserHistory } from 'history';
import { NuiProvider } from 'fivem-nui-react-lib';
import { RecoilRootManager } from './lib/RecoilRootManager';
import { RecoilDebugObserver } from './lib/RecoilDebugObserver';
import './i18n';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

const history = createBrowserHistory();

const rootDir = __dirname ?? process.cwd();
// Enable Sentry when config setting is true and when in prod
if (
  PhoneConfig.SentryErrorMetrics &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_VERSION
) {
  Sentry.init({
    dsn: 'https://2fd07f10ac9b4868902998b8a147e47b@o1133416.ingest.sentry.io/6179935',
    autoSessionTracking: true,
    release: process.env.REACT_APP_VERSION,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
      }),
      // @ts-ignore
      new RewriteFrames({
        root: rootDir,
        iteratee: (frame) => {
          if (!frame.filename || frame.filename === '') return frame;

          frame.filename = frame.filename.replace('https://cfx-nui-npwd', '');
          return frame;
        },
      }),
    ],
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 0.5,
  });
}

// window.mockNuiEvent is restricted to development env only
if (process.env.NODE_ENV === 'development') {
  attachWindowDebug();
}

ReactDOM.render(
  <HashRouter>
    <NuiProvider resource="npwd">
      <React.Suspense fallback={null}>
        <RecoilRootManager>
          <RecoilDebugObserver>
            <PhoneProviders />
          </RecoilDebugObserver>
        </RecoilRootManager>
      </React.Suspense>
    </NuiProvider>
  </HashRouter>,
  document.getElementById('root'),
);

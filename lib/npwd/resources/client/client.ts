import ClientUtils from './cl_utils';
import { ResourceConfig } from '../../typings/config';

// Setup and export the config for the resource
export const config: ResourceConfig = JSON.parse(
  LoadResourceFile(GetCurrentResourceName(), 'config.json'),
);

import './cl_main';
import './cl_bank';
import './cl_contacts';
import './cl_marketplace';
import './cl_notes';
import './cl_photo';
import './cl_messages';
import './cl_societies';
import './calls/cl_calls.controller';
import './functions';
import './cl_exports';

export const ClUtils = new ClientUtils();

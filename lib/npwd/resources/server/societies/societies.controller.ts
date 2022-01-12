import { SocietyEvents, PreDBSociety } from '../../../typings/society';
import SocietyService from './societies.service';
import { societiesLogger } from './societies.utils';
import { onNetPromise } from '../lib/PromiseNetEvents/onNetPromise';

onNetPromise<PreDBSociety, number>(SocietyEvents.SEND_SOCIETY_MESSAGE, (reqObj, resp) => {
  SocietyService.handleSendSocietyMessage(reqObj, resp).catch((e) => {
    societiesLogger.error(
      `Error occured in fetch contacts event (${reqObj.source}), Error:  ${e.message}`,
    );
    resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
  });
});

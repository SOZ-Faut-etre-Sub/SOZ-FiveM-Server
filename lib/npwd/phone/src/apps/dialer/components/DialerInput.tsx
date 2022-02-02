import React, { useContext } from 'react';
import { DialInputCtx, IDialInputCtx } from '../context/InputContext';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InputBase } from '@ui/components/Input';
import { useCall } from '@os/call/hooks/useCall';

export const DialerInput: React.FC = () => {
  const history = useHistory();
  const [t] = useTranslation();
  const { initializeCall } = useCall();

  const { inputVal, set } = useContext<IDialInputCtx>(DialInputCtx);

  const handleCall = (number: string) => {
    initializeCall(number);
  };

  const handleNewContact = (number: string) => {
    history.push(`/contacts/-1/?addNumber=${number}&referal=/phone/contacts`);
  };

  return (
    <div>
      <InputBase
        placeholder={t('DIALER.INPUT_PLACEHOLDER')}

        value={inputVal}
        onChange={(e) => set(e.target.value)}
      />
      {/*<IconButton*/}
      {/*  color="primary"*/}
      {/*  */}
      {/*  disabled={inputVal <= ''}*/}
      {/*  onClick={() => handleCall(inputVal)}*/}
      {/*  size="large"*/}
      {/*>*/}
      {/*  /!*<PhoneIcon fontSize="large" />*!/*/}
      {/*</IconButton>*/}
      {/*<IconButton*/}
      {/*  */}
      {/*  onClick={() => handleNewContact(inputVal)}*/}
      {/*  size="large"*/}
      {/*>*/}
      {/*  /!*<PersonAddIcon fontSize="large" />*!/*/}
      {/*</IconButton>*/}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import { TextField } from '@ui/components/Input';
import { useContactsValue } from '../../../contacts/hooks/state';
import { useMessageAPI } from '../../hooks/useMessageAPI';

const NewMessageGroupForm = ({ phoneNumber }: { phoneNumber?: string }) => {
  const history = useHistory();
  const [t] = useTranslation();
  const [participant, setParticipant] = useState<any>('');
  const [participantValue, setParticipantValue] = useState('');
  const { getContactByNumber } = useContactActions();
  const contacts = useContactsValue();
  const { addConversation } = useMessageAPI();

  useEffect(() => {
    if (phoneNumber) {
      const find = getContactByNumber(phoneNumber);
      if (find) {
        setParticipant(find);
        addConversation(phoneNumber);
      } else {
        setParticipantValue(phoneNumber);
      }
    }
  }, [phoneNumber, getContactByNumber, addConversation]);

  const handleSubmit = () => {
    if (participantValue || participant) {
      const targetNumber = participant.number ?? participantValue;
      addConversation(targetNumber);
    }
  };

  const handleCancel = () => {
    history.push('/messages');
  };

  const renderAutocompleteInput = (params) => (
    <TextField
      {...params}
      fullWidth
      label={t('MESSAGES.INPUT_NAME_OR_NUMBER')}
      onChange={(e) => setParticipant(e.currentTarget.value)}
    />
  );

  const submitDisabled = !participantValue && !participant;

  return (
    <div>
      <div>
        {/*<Autocomplete*/}
        {/*  value={participant}*/}
        {/*  inputValue={participantValue}*/}
        {/*  freeSolo*/}
        {/*  disablePortal*/}
        {/*  PopperComponent={(props) => <Popper placement="bottom-start" {...props} />}*/}
        {/*  autoHighlight*/}
        {/*  options={contacts}*/}
        {/*  // I am so sorry*/}
        {/*  ListboxProps={{ style: { marginLeft: 10 } }}*/}
        {/*  getOptionLabel={(contact) => contact.display || contact.number || participant}*/}
        {/*  onChange={(e, value: any) => setParticipant(value)}*/}
        {/*  onInputChange={(e, value: any) => setParticipantValue(value)}*/}
        {/*  renderInput={renderAutocompleteInput}*/}
        {/*/>*/}
      </div>
      <div>
        <button
          onClick={() => handleSubmit()}
          disabled={submitDisabled}
          color="primary"
          type="submit"
        >
          {t('MESSAGES.NEW_MESSAGE_GROUP_SUBMIT')}
        </button>
        <button onClick={handleCancel} color="error">
          {t('GENERIC_CANCEL')}
        </button>
      </div>
    </div>
  );
};

export default NewMessageGroupForm;

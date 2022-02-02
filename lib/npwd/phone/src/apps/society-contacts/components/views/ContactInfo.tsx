import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { SocietiesDatabaseLimits } from '@typings/society';
import { TextField } from '@ui/components/Input';
import { useContactsAPI } from '../../hooks/useContactsAPI';
import { Button } from '@ui/components/Button';

interface ContactInfoRouteParams {
  mode: string;
  id: string;
}

interface ContactInfoRouteQuery {
  addNumber?: string;
  referal?: string;
  name?: string;
  avatar?: string;
}

const ContactsInfoPage: React.FC = () => {
  const { id } = useParams<ContactInfoRouteParams>();
  const { referal: referral } = useQueryParams<ContactInfoRouteQuery>({
    referal: '/society-contacts',
  });

  const { getContact } = useContactActions();
  const { sendSocietyMessage } = useContactsAPI();
  const contact = getContact(parseInt(id));

  const [t] = useTranslation();
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === SocietiesDatabaseLimits.message) return;
    setMessage(e.target.value);
  };

  const handleAnonymousChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setAnonymous(e.target.value === 'false');
  };

  const handleSend = () => {
    sendSocietyMessage({ number: contact.number, message, anonymous, position: false }, referral)
  };

  const handleSendWithLocation = () => {
    sendSocietyMessage({ number: contact.number, message, anonymous, position: true }, referral)
  };

  return (
    <div>
      <div >
        <TextField

          error={message.length >= SocietiesDatabaseLimits.message}
          value={message}
          multiline
          fullWidth
          rows={20}
          variant="outlined"
          onChange={handleNumberChange}
          label={t('SOCIETY_CONTACTS.FORM_MESSAGE')}
        />
        <div >{message.length}/{SocietiesDatabaseLimits.message}</div>
        <div>
          <div onChange={handleAnonymousChange} />
          {t('SOCIETY_CONTACTS.SET_ANONYMOUS')}
        </div>
        <div >
          <Button color="primary" variant="contained" onClick={handleSend}>
            {t('SOCIETY_CONTACTS.SEND')}
          </Button>
          <Button color="secondary" variant="contained" onClick={handleSendWithLocation}>
            {t('SOCIETY_CONTACTS.SEND_POSITION')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactsInfoPage;

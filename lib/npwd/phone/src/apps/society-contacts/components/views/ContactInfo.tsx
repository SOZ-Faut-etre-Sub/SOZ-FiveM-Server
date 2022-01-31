import React, { useState } from 'react';
import {Box, Button, Checkbox, Paper, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { SocietiesDatabaseLimits } from '@typings/society';
import { TextField } from '@ui/components/Input';
import { useContactsAPI } from '../../hooks/useContactsAPI';

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

const useStyles = makeStyles({
  root: {
    height: '100%',
    width: '100%',
    backgroundImage: 'none'
  },
  listContainer: {
    marginTop: 30,
    width: '95%',
    margin: '0 auto',
    textAlign: 'center',
  },
  avatar: {
    margin: 'auto',
    height: '125px',
    width: '124px',
    marginBottom: 29,
  },
  input: {
    marginBottom: 20,
    margin: 'auto',
    textAlign: 'center',
  },
  inputProps: {
    fontSize: 22,
  },
});

const ContactsInfoPage: React.FC = () => {
  const classes = useStyles();
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
    <Paper className={classes.root} square>
      <div className={classes.listContainer}>
        <TextField
          className={classes.input}
          error={message.length >= SocietiesDatabaseLimits.message}
          value={message}
          multiline
          fullWidth
          rows={20}
          variant="outlined"
          onChange={handleNumberChange}
          label={t('SOCIETY_CONTACTS.FORM_MESSAGE')}
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <Typography paragraph>{message.length}/{SocietiesDatabaseLimits.message}</Typography>
        <Box p={1} textAlign="left" display="block">
          <Checkbox value={anonymous} onChange={handleAnonymousChange} />
          {t('SOCIETY_CONTACTS.SET_ANONYMOUS')}
        </Box>
        <Box p={1} display="flex" justifyContent="space-between">
          <Button color="primary" variant="contained" onClick={handleSend}>
            {t('SOCIETY_CONTACTS.SEND')}
          </Button>
          <Button color="secondary" variant="contained" onClick={handleSendWithLocation}>
            {t('SOCIETY_CONTACTS.SEND_POSITION')}
          </Button>
        </Box>
      </div>
    </Paper>
  );
};

export default ContactsInfoPage;

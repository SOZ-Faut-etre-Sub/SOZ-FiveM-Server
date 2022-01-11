import React, { useEffect, useState } from 'react';
import { Box, Button, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { ContactsDatabaseLimits } from '@typings/contact';
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
  },
  listContainer: {
    marginTop: 30,
    width: '75%',
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
  const history = useHistory();
  const { id } = useParams<ContactInfoRouteParams>();
  const {
    addNumber,
    // Because this is mispelled absolutely everywhere
    referal: referral,
    avatar: avatarParam,
    name: nameParam,
  } = useQueryParams<ContactInfoRouteQuery>({
    referal: '/society-contacts',
  });

  const { getContact } = useContactActions();
  const { updateContact, deleteContact } = useContactsAPI();

  const contact = getContact(parseInt(id));

  const [name, setName] = useState(() => contact?.display || '');
  const [number, setNumber] = useState(() => contact?.number || '');
  const [avatar, setAvatar] = useState(() => contact?.avatar || '');
  // Set state after checking if null

  const [t] = useTranslation();

  const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const inputVal = e.currentTarget.value;
    if (inputVal.length === ContactsDatabaseLimits.number) return;
    setNumber(e.target.value);
  };

  const handleSend = () => {
  };

  const handleSendWithLocation = () => {
  };

  useEffect(() => {
    if (addNumber) setNumber(addNumber);
    if (avatarParam) setAvatar(avatarParam);
    if (nameParam) setName(nameParam);
  }, [addNumber, avatar, avatarParam, nameParam]);

  return (
    <Paper className={classes.root} square>
      <Button style={{ margin: 10 }} onClick={() => history.goBack()}>
        <ArrowBackIcon fontSize="large" />
      </Button>
      <div className={classes.listContainer}>
        <TextField
          className={classes.input}
          error={number.length >= ContactsDatabaseLimits.number}
          value={number}
          multiline
          fullWidth
          rows={10}
          onChange={handleNumberChange}
          label={t('SOCIETY_CONTACTS.FORM_MESSAGE')}
          inputProps={{
            className: classes.inputProps,
          }}
        />
        <Box p={1} display="inline">
          <Button color="primary" variant="contained" onClick={handleSend}>
            {t('SOCIETY_CONTACTS.SEND')}
          </Button>
        </Box>
        <Box p={1} display="inline">
          <Button color="secondary" variant="contained" onClick={handleSendWithLocation}>
            {t('SOCIETY_CONTACTS.SEND_POSITION')}
          </Button>
        </Box>
      </div>
    </Paper>
  );
};

export default ContactsInfoPage;

import React, {useEffect, useState} from 'react';
import {Avatar as MuiAvatar, Box} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useContactActions} from '../../hooks/useContactActions';
import {useQueryParams} from '@common/hooks/useQueryParams';
import {ContactsDatabaseLimits} from '@typings/contact';
import {TextField} from '@ui/components/Input';
import {useContactsAPI} from '../../hooks/useContactsAPI';
import {Theme} from "@mui/material/styles";
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: '100%',
        width: '100%',
    },
    action: {
        position: 'absolute',
        right: theme.spacing(3),
        top: theme.spacing(5),
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
}));

const ContactsInfoPage: React.FC = () => {
    const classes = useStyles();
    const {id} = useParams<ContactInfoRouteParams>();
    const {
        addNumber,
        // Because this is mispelled absolutely everywhere
        referal: referral,
        avatar: avatarParam,
        name: nameParam,
    } = useQueryParams<ContactInfoRouteQuery>({
        referal: '/contacts',
    });

    const {getContact} = useContactActions();
    const {updateContact, addNewContact, deleteContact} = useContactsAPI();

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

    const handleDisplayChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === ContactsDatabaseLimits.display) return;
        setName(e.target.value);
    };

    const handleContactAdd = () => {
        addNewContact({display: name, number, avatar}, referral);
    };

    const handleContactDelete = () => {
        deleteContact({id: contact.id});
    };

    const handleContactUpdate = () => {
        updateContact({id: contact.id, number, avatar, display: name});
    };

    useEffect(() => {
        if (addNumber) setNumber(addNumber);
        if (avatarParam) setAvatar(avatarParam);
        if (nameParam) setName(nameParam);
    }, [addNumber, avatar, avatarParam, nameParam]);

    return (
        <div className={classes.root}>
            <div className={classes.action}>
                {contact && (
                    <Box display="flex">
                        <EditIcon style={{ cursor: 'pointer', marginRight: 10 }} color="info" onClick={handleContactUpdate}/>
                        <DeleteIcon style={{ cursor: 'pointer' }} color="error" onClick={handleContactDelete}/>
                    </Box>
                )}
                {!contact && (
                    <AddBoxIcon color="primary" onClick={handleContactAdd} />
                )}
            </div>
            <div className={classes.listContainer}>
                <MuiAvatar className={classes.avatar} src={avatar}/>
                <TextField
                    autoFocus
                    error={name.length >= ContactsDatabaseLimits.display}
                    className={classes.input}
                    value={name}
                    onChange={handleDisplayChange}
                    label={t('CONTACTS.FORM_NAME')}
                    fullWidth
                    inputProps={{
                        className: classes.inputProps,
                    }}
                />
                <TextField
                    className={classes.input}
                    error={number.length >= ContactsDatabaseLimits.number}
                    value={number}
                    onChange={handleNumberChange}
                    label={t('CONTACTS.FORM_NUMBER')}
                    fullWidth
                    inputProps={{
                        className: classes.inputProps,
                    }}
                />
            </div>
        </div>
    );
};

export default ContactsInfoPage;

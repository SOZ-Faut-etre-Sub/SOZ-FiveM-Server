import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useContactActions} from '../../hooks/useContactActions';
import {useQueryParams} from '@common/hooks/useQueryParams';
import {ContactsDatabaseLimits} from '@typings/contact';
import {TextField} from '@ui/components/Input';
import {useContactsAPI} from '../../hooks/useContactsAPI';

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
        <div >
            <div >
                {contact && (
                    <div>
                        {/*<EditIcon style={{ cursor: 'pointer', marginRight: 10 }} color="info" onClick={handleContactUpdate}/>*/}
                        {/*<DeleteIcon style={{ cursor: 'pointer' }} color="error" onClick={handleContactDelete}/>*/}
                    </div>
                )}
                {/*{!contact && (*/}
                {/*    <AddBoxIcon color="primary" onClick={handleContactAdd} />*/}
                {/*)}*/}
            </div>
            <div >
                {/*<MuiAvatar  src={avatar}/>*/}
                <TextField
                    autoFocus
                    error={name.length >= ContactsDatabaseLimits.display}

                    value={name}
                    onChange={handleDisplayChange}
                    label={t('CONTACTS.FORM_NAME')}
                    fullWidth
                />
                <TextField

                    error={number.length >= ContactsDatabaseLimits.number}
                    value={number}
                    onChange={handleNumberChange}
                    label={t('CONTACTS.FORM_NUMBER')}
                    fullWidth
                />
            </div>
        </div>
    );
};

export default ContactsInfoPage;

import { Transition } from '@headlessui/react';
import { ChevronLeftIcon, EmojiHappyIcon } from '@heroicons/react/outline';
import { ChatIcon } from '@heroicons/react/solid';
import { SocietiesDatabaseLimits } from '@typings/society';
import { AppContent } from '@ui/components/AppContent';
import { AppTitle } from '@ui/components/AppTitle';
import { ActionButton } from '@ui/old_components/ActionButton';
import { Button } from '@ui/old_components/Button';
import { TextareaField } from '@ui/old_components/Input';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useSociety } from '../../../hooks/app/useSociety';
import { Checkbox } from '../../../ui/components/Checkbox';
import { ContactPicture } from '../../../ui/components/ContactPicture';
import { useContactsAPI } from '../hooks/useContactsAPI';
import { CustomEmoji } from "../../../config/CustomEmoji";
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data/sets/14/apple.json';
import { useConfig } from "../../../hooks/usePhone";
import cn from "classnames";

const AnonymousAllowedSociety = ['555-LSMC', '555-POLICE', '555-LSPD', '555-BCSO', '555-SASP'];

const ContactsInfoPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getContact } = useSociety();
    const config = useConfig();
    const { sendSocietyMessage } = useContactsAPI();
    const contact = getContact(parseInt(id));

    const [t] = useTranslation();
    const [message, setMessage] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [position, setPosition] = useState(true);
    const [emojiKeyboard, setEmojiKeyboard] = useState(false);


    const handleEmojiAppend = async (emojiData: { shortcodes: string }) => {
        setMessage(prev => prev + emojiData.shortcodes + ' ');
    };

    const handleNumberChange: React.ChangeEventHandler<HTMLInputElement> = e => {
        const inputVal = e.currentTarget.value;
        if (inputVal.length === SocietiesDatabaseLimits.message) return;
        setMessage(e.target.value);
    };

    const handleSend = () => {
        if (message.length >= 5) {
            setEmojiKeyboard(false);
            sendSocietyMessage({ number: contact.number, message, anonymous, position });
            navigate('/society-contacts', { replace: true });
        }
    };

    return (
        <Transition
            appear={true}
            show={true}
            className="absolute inset-x-0 z-40"
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
        >
            <AppTitle title={contact.display}>
                <Button className="flex items-center text-base" onClick={() => navigate(-1)}>
                    <ChevronLeftIcon className="h-5 w-5" />
                    Fermer
                </Button>
            </AppTitle>
            <AppContent className="text-white mt-10 mb-4">
                <div className="flex justify-center">
                    <ContactPicture picture={contact.avatar} useOffset={false} size="large" />
                </div>
                <div>
                    {emojiKeyboard && (
                      <div className="absolute w-full z-10 top-[100px] left-[25px] right-0 opacity-90">
                          <Picker
                            data={data}
                            set="apple"
                            custom={CustomEmoji}
                            onEmojiSelect={handleEmojiAppend}
                            navPosition="bottom"
                            previewPosition="none"
                            searchPosition="none"
                            className="w-full"
                          />
                      </div>
                    )}
                    <TextareaField
                        value={message}
                        rows={14}
                        variant="outlined"
                        onChange={handleNumberChange}
                        placeholder={t('SOCIETY_CONTACTS.FORM_MESSAGE')}
                    />
                </div>
                <div className="mx-10">
                    <div
                      className="flex items-center py-2 cursor-pointer"
                      onClick={() => setEmojiKeyboard(s => !s)}
                    >
                        <EmojiHappyIcon
                          className={cn(
                            'pointer-events-none inline-block self-center h-5 w-5 mx-2',
                          )}
                        />
                        <span
                          className={cn('text-sm font-medium ', {
                              'text-gray-100': config.theme.value === 'dark',
                              'text-gray-900': config.theme.value === 'light',
                          })}
                        >
                            Ajouter un emoji
                        </span>

                    </div>
                    <Checkbox
                        title="Envoyer avec ma position"
                        enabled={position}
                        onClick={() => setPosition(s => !s)}
                    />
                    {AnonymousAllowedSociety.includes(contact.number) && (
                        <Checkbox title="Envoi anonyme" enabled={anonymous} onClick={() => setAnonymous(s => !s)} />
                    )}
                </div>
                <div className="mt-2 mx-10">
                    <ActionButton onClick={handleSend} disabled={message.length < 5}>
                        <ChatIcon className="h-6 w-6" />
                        {message.length < 5 ? (
                            <p className="text-sm text-center text-gray-500">Votre message est trop court</p>
                        ) : (
                            <p className="text-sm text-center">{t('SOCIETY_CONTACTS.SEND')}</p>
                        )}
                    </ActionButton>
                </div>
            </AppContent>
        </Transition>
    );
};

export default ContactsInfoPage;

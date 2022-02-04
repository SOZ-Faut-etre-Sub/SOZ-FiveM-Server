import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {useHistory, useParams} from 'react-router-dom';
import { useContactActions } from '../../hooks/useContactActions';
import { useQueryParams } from '@common/hooks/useQueryParams';
import { SocietiesDatabaseLimits } from '@typings/society';
import {TextareaField, TextField} from '@ui/components/Input';
import { useContactsAPI } from '../../hooks/useContactsAPI';
import { Button } from '@ui/components/Button';
import { Transition } from '@headlessui/react';
import { AppWrapper } from '@ui/components';
import {AppTitle} from "@ui/components/AppTitle";
import {ChevronLeftIcon, PlusIcon} from "@heroicons/react/outline";
import {useApp} from "@os/apps/hooks/useApps";
import {ChatIcon, LocationMarkerIcon, PencilAltIcon, PhoneIcon, PhoneIncomingIcon, PhoneMissedCallIcon, TrashIcon} from "@heroicons/react/solid";
import {ContactsDatabaseLimits} from "@typings/contact";
import {AppContent} from "@ui/components/AppContent";

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

    const history = useHistory();

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

  const handleAnonymousChange: React.MouseEventHandler<HTMLInputElement> = (e) => {
    setAnonymous((s) => !s);
  };

  const handleSend = () => {
    sendSocietyMessage({ number: contact.number, message, anonymous, position: false }, referral)
  };

  const handleSendWithLocation = () => {
    sendSocietyMessage({ number: contact.number, message, anonymous, position: true }, referral)
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
      <AppWrapper>
          <AppTitle title={contact.display}>
              <Button className="flex items-center text-base" onClick={() => history.goBack()}>
                  <ChevronLeftIcon className="h-5 w-5" />
                  Fermer
              </Button>
          </AppTitle>
          <AppContent className="text-white mt-10 mx-4 mb-4">
              <div className="flex justify-center">
                  <div className="bg-gray-700 bg-cover bg-center h-20 w-20 my-1 rounded-full" style={{backgroundImage: `url(${contact.avatar})`}} />
              </div>
              <div>
                  <TextareaField
                      error={message.length >= SocietiesDatabaseLimits.message}
                      value={message}
                      rows={14}
                      variant="outlined"
                      onChange={handleNumberChange}
                      placeholder={t('SOCIETY_CONTACTS.FORM_MESSAGE')}
                  />
              </div>
              <div className="mt-4 grid gap-3 grid-cols-3">
                  <div className="flex flex-col justify-center items-center bg-[#1C1C1E] text-[#347DD9] rounded-xl p-3 cursor-pointer">
                      <ChatIcon className="h-6 w-6"/>
                      <p className="text-sm text-center">{t('SOCIETY_CONTACTS.SEND')}</p>
                  </div>

                  <div className="flex flex-col justify-center items-center bg-[#1C1C1E] text-[#347DD9] rounded-xl p-3 cursor-pointer" onClick={handleAnonymousChange}>
                      {anonymous ? (
                          <PhoneMissedCallIcon className="h-6 w-6"/>
                      ) : (
                          <PhoneIncomingIcon className="h-6 w-6"/>
                      )}
                      <p className="text-sm text-center">Rappel {anonymous ? 'interdit' : 'autorisé'}</p>
                  </div>

                  <div className="flex flex-col justify-center items-center bg-[#1C1C1E] text-[#347DD9] rounded-xl p-3 cursor-pointer">
                      <LocationMarkerIcon className="h-6 w-6"/>
                      <p className="text-sm text-center">{t('SOCIETY_CONTACTS.SEND_POSITION')}</p>
                  </div>
              </div>
          </AppContent>
      </AppWrapper>
    </Transition>
  );
};

export default ContactsInfoPage;

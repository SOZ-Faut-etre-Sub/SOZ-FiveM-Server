import { ChatIcon } from '@heroicons/react/solid';
import React, { FunctionComponent, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useAssetPath } from '../../../../../hook/assets';
import { ActionButton } from '../../../components/ActionButton';
import { Checkbox } from '../../../components/Checkbox';
import { ContactPicture } from '../../../components/ContactPicture';
import { TextareaField } from '../../../components/Input';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useAppTitleUpdater } from '../../../system/apps/hooks/useAppTitleUpdater';
import { useDynamicIsland } from '../../../system/dynamic-island/hooks/useDynamicIsland';
import { useSocietyContact } from '../hooks/useContact';
import { useContactsAPI } from '../hooks/useContactsAPI';

type MessageInputs = {
    message: string;
    anonymous: boolean;
    position: boolean;
};

export const ContactShow: FunctionComponent = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { number } = useParams();
    const { getPath } = useAssetPath();
    const contact = useSocietyContact(number);
    const { sendSocietyMessage } = useContactsAPI();
    const { sendIsland } = useDynamicIsland();

    const {
        register,
        watch,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isValid },
    } = useForm<MessageInputs>({ mode: 'onChange', defaultValues: { position: true } });

    const submitForm: SubmitHandler<MessageInputs> = async data => {
        if (!contact) return;

        reset();
        navigate('/society-contacts', { replace: true });

        sendSocietyMessage({
            number: contact.number,
            message: data.message,
            anonymous: data.anonymous,
            position: data.position,
        });
        sendIsland('success');
    };

    useAppTitleGetBackUpdater(() => navigate(-1));
    useAppTitleUpdater(true, contact?.display);

    useEffect(() => {
        if (contact) return;

        navigate('/society-contacts');
    }, []);

    if (!contact) {
        return null;
    }

    return (
        <AppWrapper className="flex flex-col">
            <AppContent>
                <form onSubmit={handleSubmit(submitForm)} className="grow flex flex-col gap-4 py-4">
                    <div className="flex justify-center">
                        <ContactPicture
                            picture={getPath('images/society/' + contact.avatar)}
                            useOffset={false}
                            size="large"
                        />
                    </div>

                    <TextareaField
                        className="grow"
                        {...register('message', {
                            minLength: { value: 5, message: 'Votre message est trop court' },
                            maxLength: { value: 255, message: 'Votre message est trop long' },
                            required: 'Votre message est vide',
                        })}
                        variant="outlined"
                        placeholder={t('SOCIETY_CONTACTS.FORM_MESSAGE')}
                    />

                    <div>
                        <Checkbox
                            title="Envoyer avec ma position"
                            enabled={watch('position')}
                            onClick={value => setValue('position', value)}
                        />
                        {contact.anonymousCallAllowed && (
                            <Checkbox
                                title="Envoi anonyme"
                                enabled={watch('anonymous')}
                                onClick={value => setValue('anonymous', value)}
                            />
                        )}
                    </div>

                    <ActionButton type="submit" disabled={!isValid}>
                        <ChatIcon className="size-6" />
                        {!isValid ? (
                            <p className="text-sm text-center text-gray-500">
                                {errors.message?.message ?? 'Vous devez remplir le formulaire'}
                            </p>
                        ) : (
                            <p className="text-sm text-center">{t('SOCIETY_CONTACTS.SEND')}</p>
                        )}
                    </ActionButton>
                </form>
            </AppContent>
        </AppWrapper>
    );
};

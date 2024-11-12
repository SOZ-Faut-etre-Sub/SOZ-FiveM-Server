import classnames from 'classnames';
import React, { FunctionComponent } from 'react';

import { BankContact } from '../../../../shared/bank';
import { useHudColor } from '../../Hud/hooks/useHudColor';
import TrashIcon from '../assets/trash.svg';
import { TextWithCopy } from './TextWithCopy';
import { Title } from './Title';

type ContactCardProps = {
    contact: BankContact;
    onDelete: () => void;
};

export const ContactCard: FunctionComponent<ContactCardProps> = ({ contact, onDelete }) => {
    const { glassmorphismColors } = useHudColor();

    return (
        <div
            className="flex shadow-sm rounded-xl backdrop-blur-xl"
            style={{
                backgroundColor: glassmorphismColors.background,
            }}
        >
            <div
                className={classnames(
                    'flex w-16 flex-shrink-0 items-center justify-center rounded-l-xl bg-cover bg-center',
                    {
                        'bg-black/15': !contact?.avatar,
                    }
                )}
                style={{
                    backgroundImage: `url(${contact?.avatar})`,
                }}
            />
            <div className="flex flex-1 items-center justify-between truncate rounded-r-xl">
                <div className="flex-1 truncate pl-4 py-2 text-sm">
                    <Title size="xsmall" uppercase={false}>
                        {contact.label}
                    </Title>

                    <TextWithCopy text={contact.accountid}>
                        <Title size="xsmall">{contact.accountid}</Title>
                    </TextWithCopy>
                </div>
                <div className="flex-shrink-0">
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onDelete}
                    >
                        <TrashIcon className="size-5 text-red-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

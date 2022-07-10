import { ClockIcon, UserCircleIcon, ViewGridIcon } from '@heroicons/react/solid';
import { Button } from '@ui/components/Button';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { ThemeContext } from '../../../styles/themeProvider';

const DialerNavBar: React.FC = () => {
    const { pathname } = useLocation();
    const history = useHistory();
    const { theme } = useContext(ThemeContext);
    const [page, setPage] = useState(pathname);
    const [t] = useTranslation();

    return (
        <div
            className={`relative grid grid-cols-3 content-start ${
                theme === 'dark' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-black'
            } h-20`}
        >
            <Button
                className={`flex flex-col items-center py-2 text-sm ${page === '/phone' && 'text-[#347DD9]'}`}
                onClick={() => {
                    setPage('/phone');
                    history.push('/phone');
                }}
            >
                <ClockIcon className="w-5 h-5" /> {t('DIALER.NAVBAR_HISTORY')}
            </Button>
            <Button
                className={`flex flex-col items-center py-2 text-sm ${page === '/phone/contacts' && 'text-[#347DD9]'}`}
                onClick={() => {
                    setPage('/phone/contacts');
                    history.push('/phone/contacts');
                }}
            >
                <UserCircleIcon className="w-5 h-5" /> {t('DIALER.NAVBAR_CONTACTS')}
            </Button>
            <Button
                className={`flex flex-col items-center py-2 text-sm ${page === '/phone/dial' && 'text-[#347DD9]'}`}
                onClick={() => {
                    setPage('/phone/dial');
                    history.push('/phone/dial');
                }}
            >
                <ViewGridIcon className="w-5 h-5" /> {t('DIALER.NAVBAR_DIAL')}
            </Button>
        </div>
    );
};

export default DialerNavBar;

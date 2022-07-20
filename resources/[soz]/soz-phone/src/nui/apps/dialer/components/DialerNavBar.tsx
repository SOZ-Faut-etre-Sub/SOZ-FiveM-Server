import { ClockIcon, UserCircleIcon, ViewGridIcon } from '@heroicons/react/solid';
import { Button } from '@ui/old_components/Button';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import { ThemeContext } from '../../../styles/themeProvider';

const DialerNavBar: React.FC = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);
    const [page, setPage] = useState(pathname);
    const [t] = useTranslation();

    return (
        <div
            className={`absolute bottom-0 inset-x-0 grid grid-cols-3 content-start ${
                theme === 'dark' ? 'bg-[#1C1C1E] text-white' : 'bg-white text-black'
            } h-20`}
        >
            <Button
                className={`flex flex-col items-center py-2 text-sm ${page === '/phone' && 'text-[#347DD9]'}`}
                onClick={() => {
                    setPage('/phone');
                    navigate('/phone');
                }}
            >
                <ClockIcon className="w-5 h-5" /> {t('DIALER.NAVBAR_HISTORY')}
            </Button>
            <Button
                className={`flex flex-col items-center py-2 text-sm ${page === '/phone/contacts' && 'text-[#347DD9]'}`}
                onClick={() => {
                    setPage('/phone/contacts');
                    navigate('/phone/contacts');
                }}
            >
                <UserCircleIcon className="w-5 h-5" /> {t('DIALER.NAVBAR_CONTACTS')}
            </Button>
            <Button
                className={`flex flex-col items-center py-2 text-sm ${page === '/phone/dial' && 'text-[#347DD9]'}`}
                onClick={() => {
                    setPage('/phone/dial');
                    navigate('/phone/dial');
                }}
            >
                <ViewGridIcon className="w-5 h-5" /> {t('DIALER.NAVBAR_DIAL')}
            </Button>
        </div>
    );
};

export default DialerNavBar;

import React, {useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {Button} from "@ui/components/Button";
import {ClockIcon, UserCircleIcon, ViewGridIcon} from "@heroicons/react/solid";

const DialerNavBar: React.FC = () => {
    const {pathname} = useLocation();
    const history = useHistory();
    const [page, setPage] = useState(pathname);
    const [t] = useTranslation();

    return (
        <div className="grid grid-cols-3 content-start text-white bg-[#1C1C1E] h-20">
            <Button
                className={`flex flex-col items-center py-2 text-sm ${page === '/phone' && 'text-[#347DD9]'}`}
                onClick={() => {
                    setPage('/phone')
                    history.push('/phone')
                }}
            >
                <ClockIcon className="w-5 h-5"/> {t('DIALER.NAVBAR_HISTORY')}
            </Button>
            <Button
                className={`flex flex-col items-center py-2 text-sm ${page === '/phone/contacts' && 'text-[#347DD9]'}`}
                onClick={() => {
                    setPage('/phone/contacts')
                    history.push('/phone/contacts')
                }}
            >
                <UserCircleIcon className="w-5 h-5"/> {t('DIALER.NAVBAR_CONTACTS')}
            </Button>
            <Button
                className={`flex flex-col items-center py-2 text-sm ${page === '/phone/dial' && 'text-[#347DD9]'}`}
                onClick={() => {
                    setPage('/phone/dial')
                    history.push('/phone/dial')
                }}
            >
                <ViewGridIcon className="w-5 h-5"/> {t('DIALER.NAVBAR_DIAL')}
            </Button>
        </div>
    );
};

export default DialerNavBar;

import { useDebounce } from '@os/phone/hooks/useDebounce';
import { SearchField } from '@ui/components/SearchField';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSetContactFilterInput } from '../../hooks/state';

export const SearchContacts: React.FC = () => {
    const [t] = useTranslation();
    const setFilterVal = useSetContactFilterInput();
    const [inputVal, setInputVal] = useState('');

    const debouncedVal = useDebounce<string>(inputVal, 500);

    useEffect(() => {
        setFilterVal(debouncedVal);
    }, [debouncedVal, setFilterVal]);

    return (
        <div>
            <SearchField
                onChange={e => setInputVal(e.target.value)}
                placeholder={t('SOCIETY_CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
                value={inputVal}
            />
        </div>
    );
};

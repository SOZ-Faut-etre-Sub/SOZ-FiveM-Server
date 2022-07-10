import { useDebounce } from '@os/phone/hooks/useDebounce';
import { SearchField } from '@ui/old_components/SearchField';
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
                placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
                onChange={e => setInputVal(e.target.value)}
                value={inputVal}
            />
        </div>
    );
};

import { useSelector } from 'react-redux';

import { RootState } from '../store';

const usePhoneConfig = () => {
    return useSelector((state: RootState) => state.phone);
};

export { usePhoneConfig };

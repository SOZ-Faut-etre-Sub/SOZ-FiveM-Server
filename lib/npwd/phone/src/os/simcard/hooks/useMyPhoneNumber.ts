import { useRecoilValue } from 'recoil';
import { simcardState } from './state';

export const useMyPhoneNumber = () => useRecoilValue(simcardState.number);
export const useMySocietyPhoneNumber = () => useRecoilValue(simcardState.societyNumber);
export const useMyPictureProfile = () => useRecoilValue(simcardState.avatar);

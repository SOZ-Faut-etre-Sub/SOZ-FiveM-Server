import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';
import { GameView } from '../../../../../hook/createGameView';
import { RootState } from '../../../../../store';
import { useDynamicIsland } from '../../../system/dynamic-island/hooks/useDynamicIsland';

const OPERATION = `{"operationName": "createScreenshot", "variables": {"file":null}, "query":"mutation createScreenshot($file: Upload!) { createScreenshot(file: $file) {url} }"}`;
const MAP = `{"0": ["variables.file"]}`;

export const usePhoto = () => {
    const { sendIsland } = useDynamicIsland();

    const apiEndpoint = useSelector((state: RootState) => state.api.apiEndpoint);
    const publicEndpoint = useSelector((state: RootState) => state.api.publicEndpoint);

    const takePhoto = async (gameView: GameView) => {
        const formData = new FormData();
        formData.append('operations', OPERATION);
        formData.append('map', MAP);

        try {
            const blob = await gameView.takeScreenshot();
            const file = new File([blob], 'screenshot.webp', { type: 'image/webp' });

            formData.append('0', file);
        } catch (e) {
            console.error(e);
            return sendIsland('error');
        }

        try {
            const token = await fetchNui<void, string>(NuiEvent.GetJWTToken);
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            const responseJson = await response.json();
            const url = responseJson?.data?.createScreenshot?.url;

            if (!url) {
                return sendIsland('error');
            }

            await fetchNui(NuiEvent.PhoneAppCameraTakePhoto, `${publicEndpoint}${url}`);
        } catch (e) {
            console.error(e);
            return sendIsland('error');
        }
    };

    return {
        takePhoto,
    };
};

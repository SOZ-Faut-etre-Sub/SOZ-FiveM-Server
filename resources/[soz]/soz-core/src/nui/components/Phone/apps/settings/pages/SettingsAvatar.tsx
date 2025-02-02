import { PhotographIcon } from '@heroicons/react/solid';
import React, { useRef, useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { NuiEvent } from '../../../../../../shared/event/nui';
import { fetchNui } from '../../../../../fetch';
import { RootState } from '../../../../../store';
import { List } from '../../../components/List';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useQueryParams } from '../../../hooks/useQueryParams';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useDynamicIsland } from '../../../system/dynamic-island/hooks/useDynamicIsland';
import { SettingItem } from '../components/SettingItem';
import { SettingItemSlider } from '../components/SettingItemSlider';

const OPERATION = `{"operationName": "createAvatar", "variables": {"file":null}, "query":"mutation createAvatar($file: Upload!) { createAvatar(file: $file) {url} }"}`;
const MAP = `{"0": ["variables.file"]}`;

export const SettingsAvatar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const query = useQueryParams();

    const apiEndpoint = useSelector((state: RootState) => state.api.apiEndpoint);
    const publicEndpoint = useSelector((state: RootState) => state.api.publicEndpoint);

    const avatarRef = useRef<AvatarEditor>(null);
    const [scale, setScale] = useState(10);
    const [rotate, setRotate] = useState(0);

    const { sendIsland } = useDynamicIsland();

    const handleAvatarSubmit = async () => {
        const formData = new FormData();
        formData.append('operations', OPERATION);
        formData.append('map', MAP);

        try {
            const blob = avatarRef.current.getImage().toDataURL('image/webp');
            const file = new File([blob], 'avatar.webp', { type: 'image/webp' });

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
            const url = responseJson?.data?.createAvatar?.url;

            if (!url) {
                return sendIsland('error');
            }

            await fetchNui(NuiEvent.PhoneSimCardUpdateAvatar, { avatar: `${publicEndpoint}${url}` });
            navigate('/settings');
        } catch (e) {
            console.error(e);
            return sendIsland('error');
        }
    };

    useAppTitleGetBackUpdater(() => navigate('/settings'));

    return (
        <AppWrapper scrollable>
            <AppTitle title="Avatar" isBigHeader={false} />
            <AppContent>
                <List className="flex justify-center">
                    <AvatarEditor
                        ref={avatarRef}
                        image={query.image}
                        width={300}
                        height={300}
                        borderRadius={300}
                        color={[0, 0, 0, 0.6]}
                        scale={scale}
                        rotate={rotate}
                    />
                </List>

                <List>
                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE')}
                        value={scale / 10}
                        iconStart={<PhotographIcon className="size-4" />}
                        iconEnd={<PhotographIcon />}
                        onCommit={e => setScale(parseInt(e.target.value) / 10)}
                    />

                    <SettingItemSlider
                        label={t('SETTINGS.OPTIONS.CUSTOM_WALLPAPER.DIALOG_TITLE')}
                        value={rotate}
                        max={360}
                        iconStart={<PhotographIcon className="-rotate-2" />}
                        iconEnd={<PhotographIcon className="rotate-2" />}
                        onCommit={e => setRotate(parseInt(e.target.value))}
                    />
                </List>

                <List>
                    <SettingItem
                        label="Valider"
                        icon={<PhotographIcon />}
                        color="bg-[#5756CE]"
                        onClick={handleAvatarSubmit}
                    />
                </List>
            </AppContent>
        </AppWrapper>
    );
};

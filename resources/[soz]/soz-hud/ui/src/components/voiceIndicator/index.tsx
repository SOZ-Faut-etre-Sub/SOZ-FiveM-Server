import style from "./style.module.css"
import {lazy, Suspense} from "react";
import FallbackIcon from "../../assets/fallback";
import {useCallback, useContext, useEffect} from "react";
import {VoiceModeContext} from "../../context/voice";


function VoiceIndicator() {
    const {voiceMode, updateVoiceMode} = useContext(VoiceModeContext)

    const MuteIcon = lazy(() => import(`../../assets/voice/mute`).catch(() => import('../../assets/fallback')))
    const WhisperIcon = lazy(() => import(`../../assets/voice/whisper`).catch(() => import('../../assets/fallback')))
    const NormalIcon = lazy(() => import(`../../assets/voice/normal`).catch(() => import('../../assets/fallback')))
    const ShoutingIcon = lazy(() => import(`../../assets/voice/shouting`).catch(() => import('../../assets/fallback')))
    const MegaphoneIcon = lazy(() => import(`../../assets/voice/megaphone`).catch(() => import('../../assets/fallback')))
    const MicrophoneIcon = lazy(() => import(`../../assets/voice/microphone`).catch(() => import('../../assets/fallback')))

    const onMessageReceived = useCallback((event: MessageEvent) => {
        if (event.data.action === 'voiceMode') {
            updateVoiceMode(event.data.voiceMode)
        }
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived)

        return () => window.removeEventListener('message', onMessageReceived)
    }, []);

    return (
        <div className={style.voiceInfo}>
            <Suspense fallback={<FallbackIcon className={style.icon}/>}>
                {voiceMode === -1 && <MuteIcon className={style.iconPersist} />}
                {voiceMode === 0 && <WhisperIcon className={style.icon} />}
                {voiceMode === 1 && <NormalIcon className={style.icon} />}
                {voiceMode === 2 && <ShoutingIcon className={style.icon} />}
                {voiceMode === 9 && <MicrophoneIcon className={style.icon} />}
                {voiceMode === 10 && <MegaphoneIcon className={style.icon} />}
            </Suspense>
        </div>
    )
}

export default VoiceIndicator

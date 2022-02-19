import style from "./style.module.css"
import {lazy, Suspense} from "preact/compat";
import FallbackIcon from "../../assets/fallback";
import {useCallback, useContext, useEffect} from "preact/hooks";
import {VoiceModeContext} from "../../context/voice";


function VoiceIndicator() {
    const {voiceMode, updateVoiceMode} = useContext(VoiceModeContext)

    const MuteIcon = lazy(() => import(`../../assets/voice/mute`).catch(() => import('../../assets/fallback')))
    const WhisperIcon = lazy(() => import(`../../assets/voice/whisper`).catch(() => import('../../assets/fallback')))
    const NormalIcon = lazy(() => import(`../../assets/voice/normal`).catch(() => import('../../assets/fallback')))
    const ShoutingIcon = lazy(() => import(`../../assets/voice/shouting`).catch(() => import('../../assets/fallback')))

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
        <div class={style.voiceInfo}>
            <Suspense fallback={<FallbackIcon class={style.icon}/>}>
                {voiceMode === -1 && <MuteIcon class={style.icon} />}
                {voiceMode === 0 && <WhisperIcon class={style.icon} />}
                {voiceMode === 1 && <NormalIcon class={style.icon} />}
                {voiceMode === 2 && <ShoutingIcon class={style.icon} />}
            </Suspense>
        </div>
    )
}

export default VoiceIndicator

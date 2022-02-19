import {createContext, FunctionalComponent} from "preact";
import {useCallback, useMemo, useState} from "preact/hooks";

export const VoiceModeContext = createContext({
    voiceMode: 0,
    updateVoiceMode: (m: number) => {}
})

const VoiceModeProvider: FunctionalComponent = ({children}) => {
    const [mode, setMode] = useState<number>(0)
    const updateVoiceMode = useCallback((m: number) => setMode(m), [setMode])

    const value = useMemo(function () {
        return { voiceMode: mode, updateVoiceMode }
    }, [mode, updateVoiceMode])

    return (
        <VoiceModeContext.Provider value={value} >
            { children }
        </VoiceModeContext.Provider>
    )
}

export default VoiceModeProvider;

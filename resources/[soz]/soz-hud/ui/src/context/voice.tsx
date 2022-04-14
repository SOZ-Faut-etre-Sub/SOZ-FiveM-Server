import {createContext, useCallback, useMemo, useState, FunctionComponent, PropsWithChildren} from "react";

export const VoiceModeContext = createContext({
    voiceMode: 0,
    updateVoiceMode: (m: number) => {}
})

const VoiceModeProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
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

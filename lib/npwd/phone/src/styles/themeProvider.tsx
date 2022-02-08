import React, {useCallback, useMemo, useState} from "react";
import {useSettings} from "../apps/settings/hooks/useSettings";

export const ThemeContext = React.createContext({
    theme: 'light',
    updateTheme: (t) => {}
});

const ThemeProvider: React.FC = ({children}) => {
    const [settings] = useSettings();
    const [theme, setTheme] = useState(settings.theme.value)
    const updateTheme = useCallback(function (t) {
        setTheme(t)
    }, [])

    const value = useMemo(function () {
        return { theme, updateTheme }
    }, [theme, updateTheme])

    return (
        <ThemeContext.Provider value={value} >
            { children }
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;

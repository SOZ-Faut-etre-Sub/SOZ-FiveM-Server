import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';

import { useSettings } from '../apps/settings/hooks/useSettings';

type Theme = {
    theme: string;
    updateTheme: (theme: string) => void;
};

export const ThemeContext = React.createContext<Theme>({
    theme: 'light',
    updateTheme: () => {},
});

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [settings] = useSettings();
    const [theme, setTheme] = useState(settings.theme.value);
    const updateTheme = useCallback(function (t) {
        setTheme(t);
    }, []);

    const value = useMemo(
        function () {
            return { theme, updateTheme };
        },
        [theme, updateTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;

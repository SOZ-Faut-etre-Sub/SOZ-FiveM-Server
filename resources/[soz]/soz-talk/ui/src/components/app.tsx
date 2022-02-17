import { Router } from 'preact-router';

import {useCallback, useEffect} from "preact/hooks";
import Radio from "@routes/radio";
import Profile from '@routes/profile';

const App = () => {
    const onMessageReceived = useCallback((event: MessageEvent) => {
        console.log(event.data)
    }, [])

    useEffect(() => {
        window.addEventListener('message', onMessageReceived);
        return () => window.removeEventListener('message', onMessageReceived);
    }, []);

    return (
        <Router>
            <Radio path="/radio"/>
            <Profile path="/profile/" user="me"/>
            <Profile path="/profile/:user"/>
        </Router>
    )
}

export default App;

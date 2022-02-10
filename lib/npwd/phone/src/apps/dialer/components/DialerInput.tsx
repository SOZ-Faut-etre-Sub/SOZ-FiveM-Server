import React, {useContext} from 'react';
import {DialInputCtx, IDialInputCtx} from '../context/InputContext';
import {useHistory} from 'react-router-dom';
import {InputBase} from '@ui/components/Input';
import {ThemeContext} from "../../../styles/themeProvider";

export const DialerInput: React.FC = () => {
    const history = useHistory();
    const {theme} = useContext(ThemeContext);
    const {inputVal, set} = useContext<IDialInputCtx>(DialInputCtx);

    if (inputVal === '') {
        set('555-')
    }

    const handleNewContact = (number: string) => {
        history.push(`/contacts/-1/?addNumber=${number}&referal=/phone/contacts`);
    };

    return (
        <div className="h-20 mb-20">
            <div className="pt-10 h-full flex justify-center">
                <InputBase
                    className={`bg-transparent w-2/4 ${theme === 'dark' ? 'text-white' : 'text-black'} text-center text-3xl`}
                    value={inputVal}
                    onChange={(e) => set(e.target.value)}
                />
            </div>
            {inputVal.length > 0 &&
                <p className="text-center font-bold text-[#347DD9] cursor-pointer pt-2" onClick={() => handleNewContact(inputVal)}>
                    Ajouter le contact
                </p>
            }
        </div>
    );
};

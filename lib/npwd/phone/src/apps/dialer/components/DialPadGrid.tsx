import React, {useContext} from 'react';
import {DialInputCtx} from '../context/InputContext';

interface ButtonItemProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    label: string | number;
}

const ButtonItem: React.FC<ButtonItemProps> = ({label, onClick}) => {
    return (
        <div key={label}>
            <button onClick={onClick}>
                <span >{label}</span>
            </button>
        </div>
    );
};

export const DialGrid = () => {
    const {add, removeOne, clear} = useContext(DialInputCtx);

    return (
        <div>
            <div>
                <ButtonItem label={1} onClick={() => add(1)}/>
                <ButtonItem label={2} onClick={() => add(2)}/>
                <ButtonItem label={3} onClick={() => add(3)}/>
                <ButtonItem label={4} onClick={() => add(4)}/>
                <ButtonItem label={5} onClick={() => add(5)}/>
                <ButtonItem label={6} onClick={() => add(6)}/>
                <ButtonItem label={7} onClick={() => add(7)}/>
                <ButtonItem label={8} onClick={() => add(8)}/>
                <ButtonItem label={9} onClick={() => add(9)}/>
                <ButtonItem label="*" onClick={clear}/>
                <ButtonItem label={0} onClick={() => add(0)}/>
                <ButtonItem label="#" onClick={removeOne}/>
                <ButtonItem label="-" onClick={() => add('-')}/>
            </div>
        </div>
    );
};

export default DialGrid;

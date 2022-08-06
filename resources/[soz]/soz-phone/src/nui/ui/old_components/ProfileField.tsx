import React, { forwardRef } from 'react';

import { TextField } from './Input';

interface ProfileFieldProps {
    label: string;
    value: string;
    handleChange?: (val: string) => void;
    allowChange?: boolean;
    multiline?: boolean;
    maxLength?: number;
}

const ProfileField = forwardRef<HTMLInputElement, ProfileFieldProps>(
    ({ label, value, handleChange, allowChange, multiline }, ref) => {
        const _handleChange = e => handleChange(e.target.value);

        return (
            <div>
                <TextField
                    label={label}
                    value={value}
                    onChange={_handleChange}
                    disabled={!allowChange}
                    multiline={multiline}
                    inputRef={ref}
                />
            </div>
        );
    }
);

ProfileField.defaultProps = {
    allowChange: true,
    maxLength: 200,
    multiline: false,
};

export default ProfileField;

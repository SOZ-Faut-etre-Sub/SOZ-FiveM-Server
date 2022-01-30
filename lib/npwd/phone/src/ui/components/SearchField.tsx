import React from 'react';
import {emphasize, Paper} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from '@mui/icons-material/Search';
import {InputBase} from './Input';

const useStyles = makeStyles((theme) => ({
    bg: {
        display: 'flex',
        height: '60px',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textFieldInput: {
        fontSize: 20,
    },
    inputRoot: {
        fontWeight: 400,
        fontSize: 18,
        borderRadius: '.7rem',
    },
    inputInput: {
        padding: theme.spacing(0.5, 4, 0.5, 4),
        // vertical padding + font size from searchIcon
        transition: theme.transitions.create(['width', 'border']),
        width: '98%',
    },
    search: {
        position: 'relative',
        borderRadius: '.7rem',
        backgroundColor: emphasize(theme.palette.background.paper, 0.21),
        '&:hover': {
            backgroundColor: emphasize(theme.palette.background.paper, 0.28),
        },
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
    searchIcon: {
        color: 'rgba(255,255,255,0.7)',
        padding: theme.spacing(0, 0.7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

interface SearchFieldProps {
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    value: string;
    placeholder?: string;
}

const DEFAULT_PROPS = {
    onChange: () => {
    },
    value: '',
    placeholder: 'Search...',
};

export const SearchField: React.FC<SearchFieldProps> = ({
    value,
    onChange,
    placeholder,
} = DEFAULT_PROPS) => {
    const classes = useStyles();
    return (
        <div className={classes.bg}>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon/>
                </div>
                <InputBase
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{'aria-label': 'search'}}
                />
            </div>
        </div>
    );
};

import {Theme} from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridGap: '1px'
    },
    photo: {
        height: 129,
        width: 129,
        maxWidth: 150,
        maxHeight: 150,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        cursor: 'pointer',
    },
    absolute: {
        position: 'absolute',
        right: theme.spacing(3),
        top: theme.spacing(5),
    },
}));

export default useStyles;

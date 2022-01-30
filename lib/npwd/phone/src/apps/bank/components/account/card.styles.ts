import {Theme} from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        background: '#333333',
        height: '179px',
        width: '350px',
        margin: 'auto',
        borderRadius: '15px',
        fontFamily: 'Bahnschrift Regular',
    },
    bankLogo: {
        textAlign: 'right',
        paddingTop: '.8rem',
        paddingRight: '2rem'
    },
    puce: {
        marginTop: '2rem',
        marginLeft: '2rem'
    },
    cardName: {
        margin: '1.5rem 1rem',
        fontSize: '1.2rem',
        fontWeight: 300,
        textTransform: 'uppercase'
    },
    cardFooter: {
        display: "flex",
        justifyContent: "space-between"
    }
}));

export default useStyles;

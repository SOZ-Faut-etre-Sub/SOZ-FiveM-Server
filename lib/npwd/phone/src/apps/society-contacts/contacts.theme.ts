import {common, teal} from '@mui/material/colors';

export const SOCIETY_CONTACTS_APP_PRIMARY_COLOR = teal[500];
export const SOCIETY_CONTACTS_APP_TEXT_COLOR = common.white;

const theme = {
  palette: {
    primary: {
      main: teal[500],
      light: teal[300],
      dark: teal[700],
      contrastText: SOCIETY_CONTACTS_APP_TEXT_COLOR,
    },
    secondary: {
      main: teal[500],
      light: teal[300],
      dark: teal[700],
      contrastText: SOCIETY_CONTACTS_APP_TEXT_COLOR,
    },
    success: {
      main: '#2196f3',
      contrastText: SOCIETY_CONTACTS_APP_TEXT_COLOR,
    },
  },
};

export default theme;

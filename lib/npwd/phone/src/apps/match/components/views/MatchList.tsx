import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

import Loader from '../Loader';
import PageText from '../PageText';
import Match from '../matches/Match';
import { useMatches } from '../../hooks/useMatches';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
});

function MatchList() {
  const classes = useStyles();
  const [t] = useTranslation();
  const { matches, error } = useMatches();

  if (error) return <PageText text={t('MATCH.FEEDBACK.MATCHES_ERROR')} />;
  if (!matches) return <Loader />;
  if (matches.length === 0) return <PageText text={t('MATCH.FEEDBACK.NO_MATCHES')} />;

  return (
    <Box className={classes.root}>
      {matches.map((match) => (
        <Match key={match.id} match={match} />
      ))}
    </Box>
  );
}

export default MatchList;

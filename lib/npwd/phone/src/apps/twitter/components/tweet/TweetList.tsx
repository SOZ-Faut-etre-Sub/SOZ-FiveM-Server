import React, { useCallback, useState, memo } from 'react';

import { List } from '@ui/components/List';
import Tweet from './Tweet';
import { FormattedTweet, Tweet as ITweet, TwitterEvents } from '../../../../../../typings/twitter';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchNui } from '@utils/fetchNui';
import { ServerPromiseResp } from '@typings/common';
import { processTweet } from '../../utils/tweets';
import { useTranslation } from 'react-i18next';
import { useTwitterActions } from '../../hooks/useTwitterActions';
import { useSnackbar } from '@os/snackbar/hooks/useSnackbar';
import { LoadingSpinner } from '@ui/components/LoadingSpinner';

export function TweetList({ tweets }: { tweets: FormattedTweet[] }) {
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(!!tweets.length);

  const { addAlert } = useSnackbar();
  const { t } = useTranslation();
  const { updateTweets } = useTwitterActions();

  const handleNextTweets = useCallback(() => {
    fetchNui<ServerPromiseResp<ITweet[]>>(
      TwitterEvents.FETCH_TWEETS,
      { pageId: page },
      {
        status: 'ok',
        data: [],
        // data: MockTweets as unknown as ITweet[],
      },
    ).then((resp) => {
      if (resp.status !== 'ok') {
        return addAlert({
          type: 'error',
          message: t('TWITTER.FEEDBACK.FETCH_TWEETS_FAILED'),
        });
      }

      if (resp.data.length === 0) {
        setHasMore(false);
        return;
      }

      setHasMore(true);
      setPage((curVal) => curVal + 1);

      updateTweets(resp.data.map(processTweet));
    });
  }, [page, updateTweets, addAlert, t]);

  return (
    <List>
      <InfiniteScroll
        next={handleNextTweets}
        hasMore={hasMore}
        height={587}
        loader={<LoadingSpinner height="auto" my={1} />}
        dataLength={tweets.length}
      >
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </InfiniteScroll>
    </List>
  );
}

export default memo(TweetList); // only re-render if our tweets change

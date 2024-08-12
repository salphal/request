import React, { useEffect } from 'react';
import Http, { type HttpProps } from './http';
import type { CacheType } from '@lib/request/http/types/cache-store';

export interface HttpStoryProps {}

export const HttpStory = React.forwardRef<any, HttpStoryProps & HttpProps>(
  (
    {
      ignoreLoading = false,
      setLoading = () => {},
      loadingType = 'single',

      abortAble = false,

      retryAble = false,
      retryDelay = 1000,
      retryCount = 0,
      retryMaxCount = 3,

      cacheAble = false,
      validityPeriod = 86400 * 3,

      ...rest
    },
    ref,
  ) => {
    const props = {
      ignoreLoading,
      setLoading,
      loadingType,

      abortAble,

      retryAble,
      retryDelay,
      retryCount,
      retryMaxCount,

      cacheAble,
      validityPeriod,

      ...rest,
    };

    return (
      <div className="story-wrap">
        <Http
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

HttpStory.displayName = 'HttpStory';

export default React.memo(HttpStory);

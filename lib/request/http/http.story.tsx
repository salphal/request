import React, { useEffect } from 'react';
import Http, { type HttpProps } from './http';

export interface HttpStoryProps {}

export const HttpStory = React.forwardRef<any, HttpStoryProps & HttpProps>(({ ...rest }, ref) => {
  const props = { ...rest };

  return (
    <div className="story-wrap">
      <Http
        ref={ref}
        {...props}
      />
    </div>
  );
});

HttpStory.displayName = 'HttpStory';

export default React.memo(HttpStory);

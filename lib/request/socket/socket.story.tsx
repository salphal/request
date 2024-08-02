import React from 'react';
import Socket, { type SocketProps } from './socket';

export interface SocketStoryProps {}

export const SocketStory = React.forwardRef<any, SocketStoryProps & SocketProps>(
  ({ ...rest }, ref) => {
    const props = { ...rest };

    return (
      <div className="story-wrap">
        <Socket
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

SocketStory.displayName = 'SocketStory';

export default React.memo(SocketStory);

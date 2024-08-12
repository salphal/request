import React from 'react';
import ConsolePreview, {type ConsolePreviewProps} from "./console-preview";

export interface ConsolePreviewStoryProps {
}

export const ConsolePreviewStory = React.forwardRef<any, ConsolePreviewStoryProps & ConsolePreviewProps>(
  (
    {
      ...rest
    },
    ref,
  ) => {

    const props = { ...rest };

    return (
      <div className="story-wrap">
        <ConsolePreview
          ref={ref}
          {...props}
        />
      </div>

    );
  },
);


ConsolePreviewStory.displayName = 'ConsolePreviewStory';

export default React.memo(ConsolePreviewStory);

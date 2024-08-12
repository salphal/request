import React from 'react';
import ConsolePreview, { type ConsolePreviewProps } from './console-preview';

export interface ConsolePreviewStoryProps {}

export const ConsolePreviewStory = React.forwardRef<
  any,
  ConsolePreviewStoryProps & ConsolePreviewProps
>(({ ...rest }, ref) => {
  const props = { ...rest };

  console.log('test_log');
  console.log('test_log');
  console.log('test_log');
  console.info('test_info');
  console.warn('test_warn');
  console.error('test_error');

  return (
    <div className="story-wrap">
      <ConsolePreview
        ref={ref}
        {...props}
      />
    </div>
  );
});

ConsolePreviewStory.displayName = 'ConsolePreviewStory';

export default React.memo(ConsolePreviewStory);

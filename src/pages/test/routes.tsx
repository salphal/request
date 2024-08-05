import { type ReactElement } from 'react';
import { useRoutes } from 'react-router-dom';
import Test from './index';
import TestCache from './components/test-cache.tsx';
import TestLoading from './components/test-loading.tsx';
import TestPending from './components/test-pending.tsx';
import TestRetry from './components/test-retry.tsx';

const TestRoutes = () => {
  const routers: ReactElement | null = useRoutes([
    {
      path: '/',
      element: <Test />,
    },
    {
      path: '/test-cache',
      element: <TestCache />,
    },
    {
      path: '/test-loading',
      element: <TestLoading />,
    },
    {
      path: '/test-pending',
      element: <TestPending />,
    },
    {
      path: '/test-retry',
      element: <TestRetry />,
    },
  ]);
  return routers;
};

export default TestRoutes;

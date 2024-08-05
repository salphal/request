import { Navigate, type RouteObject } from 'react-router-dom';
import TestRoutes from '@/pages/test/routes.tsx';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/test" />,
  },
  {
    path: '/test/*',
    element: <TestRoutes />,
  },
];

export default routes;

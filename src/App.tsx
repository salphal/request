import routes from './routes';
import { useRoutes } from 'react-router-dom';

function App() {
  const page = useRoutes(routes);

  return <>{page}</>;
}

export default App;

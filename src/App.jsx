import { useRoutes } from 'react-router-dom';
import AppRoutes from './routes/index.jsx';
import { Suspense } from 'react';

function PageFallback() {
  return <div>Loading...</div>;
}
function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AppRoutes />
    </Suspense>
  );
}
export default App;


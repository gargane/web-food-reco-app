import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';
import './styles/index.css';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;
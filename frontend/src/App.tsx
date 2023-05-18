import './styles/global.css';
import Home from './pages/home';
import { AuthContextManager } from './hooks/authContext';

const App: React.FC = () => {
  return (
    <AuthContextManager>
      <Home />
    </AuthContextManager>
  );
};

export default App;

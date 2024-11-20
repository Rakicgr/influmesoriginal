// src/App.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Routes from './routes';
import notificationService from './services/notification.service';
import { setConnected } from './store/slices/socketSlice';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Privremeno komentirano dok nemamo backend
    /*const socket = socketService.connect();
    
    if (import.meta.env.VITE_FIREBASE_PROJECT_ID) {
      notificationService.init();
    }

    socket.on('connect', () => {
      dispatch(setConnected(true));
    });

    socket.on('disconnect', () => {
      dispatch(setConnected(false));
    });

    return () => {
      socketService.disconnect();
    };*/
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <div className="app">
        {/* Main app content */}
        <main>
          <Routes />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
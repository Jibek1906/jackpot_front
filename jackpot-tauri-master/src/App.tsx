import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import TvScreen from './pages/TvScreen';
import CashierDesk from './pages/CashierDesk';
import AdminPanel from './pages/AdminPanel';
import DealerPanel from './pages/DealerPanel';
import DealerTableSelect from './pages/DealerTableSelect';

import './App.css';
import TvTableSelect from './pages/TvTableSelect';

// Проверяем, запущено ли приложение в Tauri
const isTauri = () => {
  return (window as any).__TAURI__ !== undefined || (window as any).__TAURI_IPC__ !== undefined;
};

// Выбираем роутер. Для Tauri обязателен HashRouter, для Web используем BrowserRouter (без #)
const Router: any = isTauri() ? HashRouter : BrowserRouter;

// Базовый путь на вебе будет /staff если мы зашли из панели персонала, иначе пустой
const getBasename = () => {
  if (isTauri()) return '';
  return window.location.pathname.startsWith('/staff') ? '/staff' : '';
};

function App() {
  return (
    <Router basename={getBasename()}>
      <Routes>
        <Route path='/' element={<LoginScreen />} />
        <Route path='/login' element={<LoginScreen />} />

        {/* Добавляем стартовый экран для телевизора */}
        <Route path='/tv' element={<TvTableSelect />} />
        {/* Сам экран с анимациями и пулом */}
        <Route path='/tv/display/:tvToken' element={<TvScreen />} />

        {/* Инспектор теперь использует рабочий пульт дилера */}
        <Route path='/inspector' element={<DealerTableSelect />} />
        <Route path='/inspector/:tableId' element={<DealerPanel />} />
        
        <Route path='/cashier' element={<CashierDesk />} />
        <Route path='/admin' element={<AdminPanel />} />

        {/* Стартовый экран для пульта */}
        <Route path='/dealer' element={<DealerTableSelect />} />
        {/* Сам пульт */}
        <Route path='/dealer/:tableId' element={<DealerPanel />} />
      </Routes>
    </Router>
  );
}

export default App;

import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginScreen from './pages/LoginScreen';
import TvScreen from './pages/TvScreen';
// Предполагаем, что ты создашь этот компонент (можно просто скопировать логику из DealerTableSelect)
import InspectorPanel from './pages/InspectorPanel';
import CashierDesk from './pages/CashierDesk';
import AdminPanel from './pages/AdminPanel';
import DealerPanel from './pages/DealerPanel';
import DealerTableSelect from './pages/DealerTableSelect';

import './App.css';
import TvTableSelect from './pages/TvTableSelect';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<LoginScreen />} />

        {/* Добавляем стартовый экран для телевизора */}
        <Route path='/tv' element={<TvTableSelect />} />
        {/* Сам экран с анимациями и пулом */}
        <Route path='/tv/display/:tvToken' element={<TvScreen />} />

        <Route path='/inspector' element={<InspectorPanel />} />
        <Route path='/cashier' element={<CashierDesk />} />
        <Route path='/admin' element={<AdminPanel />} />

        {/* Стартовый экран для пульта */}
        <Route path='/dealer' element={<DealerTableSelect />} />
        {/* Сам пульт */}
        <Route path='/dealer/:tableId' element={<DealerPanel />} />
      </Routes>
    </HashRouter>
  );
}

export default App;

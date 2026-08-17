import { Navigate, Route, Routes } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { FiltersProvider } from './state/FiltersContext';

export default function App() {
  return (
    <FiltersProvider>
      <div className="app-shell">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="/dashboard/:id" element={<DashboardPage />} />
        </Routes>
      </div>
    </FiltersProvider>
  );
}

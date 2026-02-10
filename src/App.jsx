import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlanProvider } from './context/PlanContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import Timeline from './components/timeline/Timeline';
import Settings from './components/settings/Settings';

export default function App() {
  return (
    <PlanProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlanProvider>
  );
}

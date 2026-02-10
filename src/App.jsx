import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlanProvider, usePlan } from './context/PlanContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import Timeline from './components/timeline/Timeline';
import Settings from './components/settings/Settings';

function ThemeApplier({ children }) {
  const { state } = usePlan();
  const theme = state.settings?.theme || 'dark';

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return children;
}

export default function App() {
  return (
    <PlanProvider>
      <ThemeApplier>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeApplier>
    </PlanProvider>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import DashboardPage from "@/pages/dashboard";
import RoutesPage from "@/pages/routes";
import StopsPage from "@/pages/stops";
import DriversPage from "@/pages/drivers";
import BusesPage from "@/pages/buses";
import SettingsPage from "@/pages/settings";
import LoginPage from "@/pages/login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/stops" element={<StopsPage />} />
          <Route path="/drivers" element={<DriversPage />} />
          <Route path="/buses" element={<BusesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

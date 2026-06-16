import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { CategoriesPage } from "./pages/CategoriesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DishesPage } from "./pages/DishesPage";
import { LoginPage } from "./pages/LoginPage";
import { OrdersPage } from "./pages/OrdersPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { StatisticsPage } from "./pages/StatisticsPage";
import { TablesPage } from "./pages/TablesPage";
import { BanksPage } from "./pages/BanksPage";

export function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="dishes" element={<DishesPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="banks" element={<BanksPage />} />
        <Route path="statistics" element={<StatisticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

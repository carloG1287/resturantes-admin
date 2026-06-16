import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { api, clearToken, getToken } from "../api/client";

export function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [me, setMe] = useState<any>(null);
  useEffect(() => { api("/api/admin/me").then(setMe).catch(() => undefined); }, []);
  if (!getToken()) return <Navigate to="/admin/login" replace />;
  return (
    <main className="app">
      <header className="admin-header">
        <button className="hamburger" onClick={() => setOpen((value) => !value)}>Menu</button>
        <div><strong>{me?.restaurant?.name ?? "Restaurante"}</strong><span>{me?.name}</span></div>
      </header>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <strong>Resturantes</strong>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/tables">Mesas</Link>
        <Link to="/admin/categories">Categorias</Link>
        <Link to="/admin/dishes">Platos</Link>
        <Link to="/admin/orders">Pedidos</Link>
        <Link to="/admin/payments">Pagos</Link>
        <Link to="/admin/banks">Bancos</Link>
        <Link to="/admin/statistics">Estadisticas</Link>
        <button onClick={() => { clearToken(); navigate("/admin/login"); }}>Salir</button>
      </aside>
      <section className="content">
        <Outlet />
      </section>
    </main>
  );
}

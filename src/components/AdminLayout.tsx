import { useEffect, useState } from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { api, clearToken, getToken } from "../api/client";

const links = [
  { to: "/admin/dashboard", label: "Inicio" },
  { to: "/admin/tables", label: "Mesas" },
  { to: "/admin/categories", label: "Categorias" },
  { to: "/admin/dishes", label: "Platos" },
  { to: "/admin/orders", label: "Pedidos" },
  { to: "/admin/payments", label: "Pagos" },
  { to: "/admin/banks", label: "Bancos" },
  { to: "/admin/statistics", label: "Estadisticas" }
];

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
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => isActive ? "active" : ""} onClick={() => setOpen(false)}>
            {link.label}
          </NavLink>
        ))}
        <button onClick={() => { clearToken(); navigate("/admin/login"); }}>Salir</button>
      </aside>
      <section className="content">
        <header className="desktop-header">
          <div>
            <strong>{me?.restaurant?.name ?? "Restaurante"}</strong>
            <span>{me?.name ?? "Administrador"}</span>
          </div>
        </header>
        <Outlet />
      </section>
    </main>
  );
}

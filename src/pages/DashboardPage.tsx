import { useEffect, useState } from "react";
import { api } from "../api/client";

export function DashboardPage() {
  const [me, setMe] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    api("/api/admin/me").then(setMe).catch(console.error);
    api("/api/admin/statistics").then(setStats).catch(console.error);
  }, []);
  return (
    <section>
      <div className="page-title">
        <div>
          <span>Inicio</span>
          <h1>Dashboard</h1>
          <p>{me?.restaurant?.name ?? "Restaurante"}</p>
        </div>
      </div>
      <div className="stats">
        <article><span>Pedidos hoy</span><strong>{stats?.todayOrders ?? 0}</strong></article>
        <article><span>Ventas hoy</span><strong>${Number(stats?.todaySales ?? 0).toFixed(2)}</strong></article>
        <article><span>Mesas activas</span><strong>{stats?.activeTables ?? 0}</strong></article>
      </div>
      <div className="chart">
        <h2>Platos mas vendidos</h2>
        {!stats?.topDishes?.length && <p className="empty">Todavia no hay ventas registradas.</p>}
        {stats?.topDishes?.map((item: any) => <p className="metric-row" key={item.name}><span>{item.name}</span><strong>{item.quantity}</strong></p>)}
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { api } from "../api/client";

export function DashboardPage() {
  const [me, setMe] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    api("/api/admin/me").then(setMe).catch(console.error);
    api("/api/admin/statistics").then(setStats).catch(console.error);
  }, []);
  return <section><h1>Dashboard</h1><p>{me?.restaurant?.name}</p><div className="stats"><strong>Pedidos hoy: {stats?.todayOrders ?? 0}</strong><strong>Ventas hoy: ${Number(stats?.todaySales ?? 0).toFixed(2)}</strong><strong>Mesas activas: {stats?.activeTables ?? 0}</strong></div><div className="chart"><h2>Platos mas vendidos</h2>{stats?.topDishes?.map((item: any) => <p key={item.name}>{item.name}: {item.quantity}</p>)}</div></section>;
}

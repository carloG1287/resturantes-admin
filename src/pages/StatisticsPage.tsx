import { useEffect, useState } from "react";
import { api } from "../api/client";

export function StatisticsPage() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => { api("/api/admin/statistics").then(setStats).catch(console.error); }, []);
  if (!stats) return <section><h1>Estadisticas</h1><p>Cargando...</p></section>;
  const maxStatus = Math.max(1, ...stats.ordersByStatus.map((item: any) => item.count));
  const maxDish = Math.max(1, ...stats.topDishes.map((item: any) => item.quantity));
  return (
    <section>
      <h1>Estadisticas</h1>
      <div className="stats"><strong>Pedidos hoy: {stats.todayOrders}</strong><strong>Ventas del dia: ${Number(stats.todaySales).toFixed(2)}</strong><strong>Mesas activas: {stats.activeTables}</strong></div>
      <div className="chartgrid">
        <article className="chart"><h2>Pedidos por estado</h2>{stats.ordersByStatus.map((item: any) => <div className="barrow" key={item.status}><span>{item.status}</span><div><i style={{ width: `${(item.count / maxStatus) * 100}%` }} /></div><strong>{item.count}</strong></div>)}</article>
        <article className="chart"><h2>Platos mas vendidos</h2>{stats.topDishes.map((item: any) => <div className="barrow" key={item.name}><span>{item.name}</span><div><i style={{ width: `${(item.quantity / maxDish) * 100}%` }} /></div><strong>{item.quantity}</strong></div>)}</article>
      </div>
    </section>
  );
}

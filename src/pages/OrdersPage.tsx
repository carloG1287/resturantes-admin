import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { api, getToken, socketUrl } from "../api/client";

const statuses = ["RECEIVED", "CONFIRMED", "PREPARING", "READY", "DELIVERED", "CANCELLED", "PAID"];
const lanes = [
  { title: "Nuevos", values: ["RECEIVED"] },
  { title: "Confirmados", values: ["CONFIRMED"] },
  { title: "Preparando", values: ["PREPARING"] },
  { title: "Listos", values: ["READY"] },
  { title: "Entregados", values: ["DELIVERED", "PAID"] }
];
type Order = { id: string; orderNumber: string; status: string; totalAmount: string; createdAt: string; table: { id: string; name: string; number: number }; items: { dishNameSnapshot: string; quantity: number }[] };
type Table = { id: string; name: string; number: number };

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [restaurantId, setRestaurantId] = useState("");
  const [filters, setFilters] = useState({ status: "", tableId: "", from: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams({ limit: "100" });
    if (filters.status) params.set("status", filters.status);
    if (filters.tableId) params.set("tableId", filters.tableId);
    if (filters.from) params.set("from", filters.from);
    return params.toString();
  }, [filters]);

  const load = () => api<{ orders: Order[] }>(`/api/admin/orders?${query}`).then((data) => setOrders(data.orders));

  useEffect(() => {
    api<any>("/api/admin/me").then((me) => setRestaurantId(me.restaurantId)).catch((err) => setError(err.message));
    api<{ tables: Table[] }>("/api/admin/tables").then((data) => setTables(data.tables)).catch(() => undefined);
  }, []);
  useEffect(() => { load().catch((err) => setError(err.message)); }, [query]);
  useEffect(() => {
    if (!restaurantId) return;
    const socket = io(socketUrl);
    socket.emit("restaurant:join", { restaurantId, token: getToken() });
    socket.on("order:created", (order: Order) => {
      setNotice(`Nuevo pedido ${order.orderNumber}`);
      setOrders((current) => [order, ...current.filter((item) => item.id !== order.id)]);
    });
    socket.on("order:status_updated", (order: Order) => setOrders((current) => current.map((item) => item.id === order.id ? order : item)));
    return () => { socket.disconnect(); };
  }, [restaurantId]);

  async function update(id: string, status: string) {
    const order = await api<Order>(`/api/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify({ status }) });
    setOrders((current) => current.map((item) => item.id === id ? order : item));
  }

  return (
    <section>
      <h1>Pedidos</h1>
      {notice && <p className="toast" onClick={() => setNotice("")}>{notice}</p>}
      {error && <p className="error">{error}</p>}
      <div className="filters">
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">Todos los estados</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select>
        <select value={filters.tableId} onChange={(e) => setFilters({ ...filters, tableId: e.target.value })}><option value="">Todas las mesas</option>{tables.map((table) => <option value={table.id} key={table.id}>{table.name} #{table.number}</option>)}</select>
        <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
      </div>
      {!orders.length && <p className="empty">No hay pedidos con estos filtros.</p>}
      <div className="kanban">
        {lanes.map((lane) => (
          <article className="lane" key={lane.title}>
            <h2>{lane.title}</h2>
            {orders.filter((order) => lane.values.includes(order.status)).map((order) => (
              <div className="order-card" key={order.id}>
                <strong>{order.orderNumber}</strong>
                <p>{order.table.name} #{order.table.number}</p>
                <p>{order.items.map((i) => `${i.quantity}x ${i.dishNameSnapshot}`).join(", ")}</p>
                <strong>${Number(order.totalAmount).toFixed(2)}</strong>
                <div className="actions">
                  {statuses.filter((status) => status !== order.status).slice(0, 4).map((status) => <button key={status} onClick={() => update(order.id, status)}>{status}</button>)}
                </div>
              </div>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

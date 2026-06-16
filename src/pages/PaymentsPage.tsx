import { useEffect, useState } from "react";
import { api } from "../api/client";

type Payment = { id: string; amount: string; reference?: string; status: string; order: { orderNumber: string } };

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const load = () => api<{ payments: Payment[] }>("/api/admin/payments").then((data) => setPayments(data.payments));
  useEffect(() => { load().catch(console.error); }, []);
  async function validate(id: string) {
    await api(`/api/admin/payments/${id}/validate`, { method: "PUT" });
    await load();
  }
  return <section><h1>Pagos</h1>{payments.map((payment) => <div className="row" key={payment.id}><span>{payment.order.orderNumber}</span><span>{payment.reference}</span><strong>{payment.status}</strong><button onClick={() => validate(payment.id)}>Validar</button></div>)}</section>;
}

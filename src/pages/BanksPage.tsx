import { useEffect, useState } from "react";
import { api } from "../api/client";

type Bank = { id: string; name: string; accountInfo?: string; isActive: boolean };

export function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [form, setForm] = useState({ name: "", accountInfo: "" });
  const [error, setError] = useState("");
  const load = () => api<{ banks: Bank[] }>("/api/admin/banks").then((data) => setBanks(data.banks));
  useEffect(() => { load().catch((err) => setError(err.message)); }, []);
  async function create() {
    try {
      await api("/api/admin/banks", { method: "POST", body: JSON.stringify(form) });
      setForm({ name: "", accountInfo: "" });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }
  return (
    <section>
      <h1>Bancos</h1>
      {error && <p className="error">{error}</p>}
      <div className="formrow"><input placeholder="Banco" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><input placeholder="Cuenta / datos" value={form.accountInfo} onChange={(e) => setForm({ ...form, accountInfo: e.target.value })} /><button onClick={create}>Crear</button></div>
      {!banks.length && <p className="empty">No hay bancos registrados.</p>}
      {banks.map((bank) => <div className="row" key={bank.id}><strong>{bank.name}</strong><span>{bank.accountInfo}</span><span>{bank.isActive ? "Activo" : "Inactivo"}</span></div>)}
    </section>
  );
}

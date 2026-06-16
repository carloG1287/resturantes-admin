import { useEffect, useState } from "react";
import { api } from "../api/client";

type Table = { id: string; name: string; number: number; isActive: boolean; qrCodes: { token: string; qrImageUrl?: string }[] };
const clientBase = import.meta.env.VITE_CLIENT_PUBLIC_URL ?? "http://localhost:3001";

export function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [name, setName] = useState("");
  const [number, setNumber] = useState(1);
  const load = () => api<{ tables: Table[] }>("/api/admin/tables").then((data) => setTables(data.tables));
  useEffect(() => { load().catch(console.error); }, []);

  async function create() {
    await api("/api/admin/tables", { method: "POST", body: JSON.stringify({ name, number }) });
    setName("");
    await load();
  }
  async function qr(id: string) {
    await api(`/api/admin/tables/${id}/generate-qr`, { method: "POST" });
    await load();
  }
  async function copyUrl(token?: string) {
    if (!token) return;
    await navigator.clipboard.writeText(`${clientBase}/order/${token}`);
    window.alert("URL copiada");
  }
  function printQr(table: Table) {
    const qr = table.qrCodes[0];
    if (!qr) return;
    const win = window.open("", "_blank");
    win?.document.write(`<html><body style="font-family:Arial;text-align:center"><h1>${table.name} #${table.number}</h1><p>${clientBase}/order/${qr.token}</p>${qr.qrImageUrl ? `<img src="${qr.qrImageUrl}" style="width:320px">` : ""}<script>print()</script></body></html>`);
    win?.document.close();
  }

  return (
    <section>
      <h1>Mesas</h1>
      <div className="formrow"><input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} /><input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} /><button onClick={create}>Crear</button></div>
      <div className="cardgrid">{tables.map((table) => {
        const activeQr = table.qrCodes[0];
        return <div className="admin-card" key={table.id}><strong>{table.name} #{table.number}</strong><span>{table.isActive ? "Activa" : "Inactiva"}</span>{activeQr?.qrImageUrl && <img className="qr-preview" src={activeQr.qrImageUrl} alt={`QR ${table.name}`} />}<code>{activeQr ? `${clientBase}/order/${activeQr.token}` : "Sin QR activo"}</code><div className="actions"><button onClick={() => qr(table.id)}>Regenerar QR</button><button onClick={() => copyUrl(activeQr?.token)}>Copiar URL</button>{activeQr?.qrImageUrl && <a className="button-link" href={activeQr.qrImageUrl} download>Descargar</a>}<button onClick={() => printQr(table)}>Imprimir</button></div></div>;
      })}</div>
    </section>
  );
}

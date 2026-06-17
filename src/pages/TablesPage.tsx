import { useEffect, useState } from "react";
import { api } from "../api/client";

type Table = {
  id: string;
  name: string;
  number: number;
  isActive: boolean;
  qrUrl?: string | null;
  qrCodes: { token: string; qrImageUrl?: string }[];
};

const clientBase = (import.meta.env.VITE_CLIENT_PUBLIC_URL ?? "https://resturantesclientes.netlify.app").replace(/\/+$/, "");
const defaultTenantCode = new URLSearchParams(window.location.search).get("code")?.trim().replace(/\.$/, "") || "demo";

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
  function getQrUrl(table: Table) {
    const token = table.qrCodes[0]?.token;
    if (table.qrUrl) return table.qrUrl;
    return token ? `${clientBase}/order/${encodeURIComponent(token)}?code=${encodeURIComponent(defaultTenantCode)}` : null;
  }
  async function copyUrl(table: Table) {
    const url = getQrUrl(table);
    if (!url) return;
    await navigator.clipboard.writeText(url);
    window.alert("URL copiada");
  }
  function printQr(table: Table) {
    const qr = table.qrCodes[0];
    if (!qr) return;
    const qrUrl = getQrUrl(table);
    const win = window.open("", "_blank");
    win?.document.write(`<html><body style="font-family:Arial;text-align:center"><h1>${table.name} #${table.number}</h1><p>${qrUrl ?? ""}</p>${qr.qrImageUrl ? `<img src="${qr.qrImageUrl}" style="width:320px">` : ""}<script>print()</script></body></html>`);
    win?.document.close();
  }

  return (
    <section>
      <h1>Mesas</h1>
      <div className="formrow"><input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} /><input type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} /><button onClick={create}>Crear</button></div>
      <div className="cardgrid">{tables.map((table) => {
        const activeQr = table.qrCodes[0];
        const qrUrl = getQrUrl(table);
        return <div className="admin-card" key={table.id}><strong>{table.name} #{table.number}</strong><span>{table.isActive ? "Activa" : "Inactiva"}</span>{activeQr?.qrImageUrl && <img className="qr-preview" src={activeQr.qrImageUrl} alt={`QR ${table.name}`} />}<code>{qrUrl ?? "Sin QR activo"}</code><div className="actions"><button onClick={() => qr(table.id)}>Regenerar QR</button><button onClick={() => copyUrl(table)}>Copiar URL</button>{activeQr?.qrImageUrl && <a className="button-link" href={activeQr.qrImageUrl} download>Descargar</a>}<button onClick={() => printQr(table)}>Imprimir</button></div></div>;
      })}</div>
    </section>
  );
}

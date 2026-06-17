import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "../api/client";
import { getTenantCodeFromQuery, setTenantCode } from "../tenant";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const tenantCode = getTenantCodeFromQuery();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      if (!tenantCode) throw new Error("Codigo de restaurante requerido");
      const result = await api<{ token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password, tenantCode }) });
      setToken(result.token);
      setTenantCode(tenantCode);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }

  if (!tenantCode) return <main className="login"><div className="login-wave" aria-hidden="true" /><form><h1>Resturantes</h1><p className="login-copy">Panel administrativo para restaurantes.</p><p className="error">Codigo de restaurante requerido. Usa un enlace como /admin/login?code=demo.</p></form></main>;
  return (
    <main className="login">
      <div className="login-wave" aria-hidden="true" />
      <form onSubmit={submit}>
        <h1>Inicia sesion</h1>
        <p className="login-copy">Ingrese sus credenciales para administrar mesas, menu y pedidos.</p>
        {error && <p className="error">{error}</p>}
        <label>Email<input placeholder="admin@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Contrasena<input placeholder="Ingrese su contrasena" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        <button>Iniciar sesion</button>
      </form>
    </main>
  );
}

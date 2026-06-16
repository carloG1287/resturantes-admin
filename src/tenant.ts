export function getTenantCodeFromQuery() {
  const code = normalizeTenantCode(new URLSearchParams(window.location.search).get("code"));
  return code || localStorage.getItem("resturantes_admin_tenant");
}

export function setTenantCode(code: string) {
  const normalized = normalizeTenantCode(code);
  if (normalized) localStorage.setItem("resturantes_admin_tenant", normalized);
}

function normalizeTenantCode(value: string | null) {
  const normalized = value?.trim().toLowerCase().replace(/\.+$/, "") ?? "";
  return normalized.length > 0 ? normalized : null;
}

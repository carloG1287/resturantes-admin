export function getTenantCodeFromQuery() {
  return new URLSearchParams(window.location.search).get("code")?.trim().toLowerCase() || localStorage.getItem("resturantes_admin_tenant");
}

export function setTenantCode(code: string) {
  localStorage.setItem("resturantes_admin_tenant", code);
}

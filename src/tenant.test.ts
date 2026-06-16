import { afterEach, describe, expect, it, vi } from "vitest";
import { getTenantCodeFromQuery, setTenantCode } from "./tenant";

function setLocation(url: string) {
  const store = new Map<string, string>();
  vi.stubGlobal("window", { location: new URL(url) });
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear()
  });
}

describe("admin tenant code", () => {
  afterEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  it("reads code from login query", () => {
    setLocation("https://admin.ordex.lat/login?code=demo");
    expect(getTenantCodeFromQuery()).toBe("demo");
  });

  it("keeps tenant code after login", () => {
    setLocation("https://resturantes.lat/login");
    setTenantCode("demo");
    expect(getTenantCodeFromQuery()).toBe("demo");
  });

  it("returns null when code is missing", () => {
    setLocation("https://resturantes.lat/login");
    expect(getTenantCodeFromQuery()).toBeNull();
  });
});

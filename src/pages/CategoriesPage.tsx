import { useEffect, useState } from "react";
import { api } from "../api/client";

type Category = { id: string; name: string; sortOrder: number; isActive: boolean };

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const load = () => api<{ categories: Category[] }>("/api/admin/categories").then((data) => setCategories(data.categories));
  useEffect(() => { load().catch(console.error); }, []);
  async function create() {
    await api("/api/admin/categories", { method: "POST", body: JSON.stringify({ name, sortOrder: categories.length + 1 }) });
    setName("");
    await load();
  }
  async function toggle(category: Category) {
    await api(`/api/admin/categories/${category.id}`, { method: "PUT", body: JSON.stringify({ isActive: !category.isActive }) });
    await load();
  }
  async function rename(category: Category) {
    const next = window.prompt("Nombre de categoria", category.name);
    if (!next) return;
    await api(`/api/admin/categories/${category.id}`, { method: "PUT", body: JSON.stringify({ name: next }) });
    await load();
  }
  return <section><h1>Categorias</h1><div className="formrow"><input placeholder="Nueva categoria" value={name} onChange={(e) => setName(e.target.value)} /><button onClick={create}>Crear</button></div>{categories.map((category) => <div className="row" key={category.id}><strong>{category.name}</strong><span>Orden {category.sortOrder}</span><span>{category.isActive ? "Activa" : "Inactiva"}</span><div className="actions"><button onClick={() => rename(category)}>Editar</button><button onClick={() => toggle(category)}>{category.isActive ? "Desactivar" : "Activar"}</button></div></div>)}</section>;
}

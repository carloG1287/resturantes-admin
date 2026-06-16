import { useEffect, useState } from "react";
import { api, upload } from "../api/client";

type Category = { id: string; name: string };
type Dish = { id: string; name: string; description?: string; price: string; imageUrl?: string; isAvailable: boolean; category: Category };

export function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: 0, categoryId: "" });
  const [error, setError] = useState("");
  const load = async () => {
    const [dishData, categoryData] = await Promise.all([api<{ dishes: Dish[] }>("/api/admin/dishes"), api<{ categories: Category[] }>("/api/admin/categories")]);
    setDishes(dishData.dishes);
    setCategories(categoryData.categories);
    setForm((current) => ({ ...current, categoryId: current.categoryId || categoryData.categories[0]?.id || "" }));
  };
  useEffect(() => { load().catch((err) => setError(err.message)); }, []);
  async function create() {
    try {
      await api("/api/admin/dishes", { method: "POST", body: JSON.stringify(form) });
      setForm({ ...form, name: "", description: "", price: 0 });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  }
  async function toggle(dish: Dish) {
    await api(`/api/admin/dishes/${dish.id}`, { method: "PUT", body: JSON.stringify({ isAvailable: !dish.isAvailable }) });
    await load();
  }
  async function updateImage(dish: Dish, file?: File) {
    if (!file) return;
    const data = new FormData();
    data.append("image", file);
    await upload(`/api/admin/dishes/${dish.id}/image`, data);
    await load();
  }
  return (
    <section>
      <h1>Platos</h1>
      {error && <p className="error">{error}</p>}
      <div className="formrow">
        <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Descripcion" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Precio" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
        <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
        <button onClick={create}>Crear</button>
      </div>
      <div className="cardgrid">
        {dishes.map((dish) => <div className="admin-card dish-admin-card" key={dish.id}>{dish.imageUrl ? <img src={dish.imageUrl} alt={dish.name} /> : <div className="image-empty">Sin imagen</div>}<strong>{dish.name}</strong><span>{dish.category.name}</span><p>{dish.description}</p><strong>${Number(dish.price).toFixed(2)}</strong><span>{dish.isAvailable ? "Disponible" : "No disponible"}</span><input aria-label={`Imagen de ${dish.name}`} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => updateImage(dish, e.target.files?.[0])} /><div className="actions"><button onClick={() => toggle(dish)}>{dish.isAvailable ? "Pausar" : "Activar"}</button></div></div>)}
      </div>
    </section>
  );
}

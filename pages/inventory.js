import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

const API_URL = "http://localhost:5001/api/product";

export default function InventoryPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ sku: "", name: "", quantity: 0, price: 0 });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const refreshProducts = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setProducts);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      // Add
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    refreshProducts();
    setForm({ sku: "", name: "", quantity: 0, price: 0 });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  if (!session) return <p className="text-center mt-10">Please sign in to view inventory.</p>;

  return (
    <div className="p-10">
      <NavBar />
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      {/* Add/Edit Inventory Form */}
      <form className="mb-6 flex gap-4 items-end" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm">SKU</label>
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Quantity</label>
          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            className="border px-2 py-1"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm">Price</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="border px-2 py-1"
            required
            min="0"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update" : "Add"} Product
        </button>
        {editingId && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditingId(null);
              setForm({ sku: "", name: "", quantity: 0, price: 0 });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.sku}</td>
              <td className="border px-4 py-2">{p.name}</td>
              <td className="border px-4 py-2">{p.quantity}</td>
              <td className="border px-4 py-2">${p.price}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  className="bg-yellow-400 px-2 py-1 rounded text-white"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 px-2 py-1 rounded text-white"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

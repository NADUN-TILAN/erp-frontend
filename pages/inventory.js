import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

export default function InventoryPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ sku: "", name: "", quantity: "", price: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/product")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const refreshProducts = () => {
    fetch("http://localhost:5001/api/product")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      // Edit mode
      await fetch(`http://localhost:5001/api/product/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: form.sku,
          name: form.name,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      });
      setEditId(null);
    } else {
      // Add mode
      await fetch("http://localhost:5001/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: form.sku,
          name: form.name,
          quantity: Number(form.quantity),
          price: Number(form.price),
        }),
      });
    }
    setForm({ sku: "", name: "", quantity: "", price: "" });
    refreshProducts();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5001/api/product/${id}`, {
      method: "DELETE",
    });
    refreshProducts();
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    });
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
          {editId ? "Update" : "Add"}
        </button>
        {editId && (
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditId(null);
              setForm({ sku: "", name: "", quantity: "", price: "" });
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
          {products.map(product => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.sku}</td>
              <td className="border px-4 py-2">{product.name}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">${product.price}</td>
              <td className="border px-4 py-2 flex gap-2">
                <button
                  className="bg-yellow-400 px-2 py-1 rounded text-white"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 px-2 py-1 rounded text-white"
                  onClick={() => handleDelete(product.id)}
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

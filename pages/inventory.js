import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import NavBar from "../components/NavBar";

const API_URL = "http://localhost:5001/api/product";

export default function InventoryPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ sku: "", name: "", quantity: 0, price: 0 });
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const refreshProducts = () => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []));
  };

  const showMessage = (message, type = "success") => {
    if (type === "success") {
      setSuccessMessage(message);
      setError("");
    } else {
      setError(message);
      setSuccessMessage("");
    }
    
    // Auto-hide message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
      setError("");
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    const payload = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      quantity: Number(form.quantity) || 0,
      price: Number(form.price) || 0,
    };
    
    try {
      if (editingId) {
        console.log(`Attempting to update product with ID: ${editingId}`);
        console.log(`PUT URL: ${API_URL}/${editingId}`);
        console.log(`Payload:`, payload);
        
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        console.log(`Update response status: ${response.status}`);
        console.log(`Update response ok: ${response.ok}`);
        
        if (response.ok) {
          showMessage("Product updated successfully!", "success");
        } else {
          const errorData = await response.json();
          console.log(`Update error data:`, errorData);
          showMessage(errorData.message || "Failed to update product", "error");
          return;
        }
      } else {
        console.log(`Attempting to add new product`);
        console.log(`POST URL: ${API_URL}`);
        console.log(`Payload:`, payload);
        
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        console.log(`Add response status: ${response.status}`);
        console.log(`Add response ok: ${response.ok}`);
        
        if (response.ok) {
          showMessage("Product added successfully!", "success");
        } else {
          const errorData = await response.json();
          console.log(`Add error data:`, errorData);
          showMessage(errorData.message || "Failed to add product", "error");
          return;
        }
      }
      
      refreshProducts();
      setForm({ sku: "", name: "", quantity: 0, price: 0 });
      setEditingId(null);
    } catch (error) {
      showMessage("Network error. Please check your connection and try again.", "error");
    }
  };

  const handleEdit = (product) => {
    setForm({ sku: product.sku || "", name: product.name || "", quantity: product.quantity || 0, price: product.price || 0 });
    setEditingId(product.id);
    setError("");
    setSuccessMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      console.log(`Attempting to delete product with ID: ${id}`);
      console.log(`DELETE URL: ${API_URL}/${id}`);
      
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      
      console.log(`Response status: ${response.status}`);
      console.log(`Response ok: ${response.ok}`);
      
      if (response.ok) {
        showMessage("Product deleted successfully!", "success");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        const errorData = await response.json();
        console.log(`Error data:`, errorData);
        showMessage(errorData.message || "Failed to delete product", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showMessage("Network error. Please check your connection and try again.", "error");
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      (p.sku || "").toLowerCase().includes(q) || (p.name || "").toLowerCase().includes(q)
    );
  }, [products, query]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-indigo-700 mb-2">Please sign in</h1>
          <p className="text-gray-500">You need to be logged in to view inventory.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory</h1>
            <p className="text-gray-500">Manage products, stock levels, and pricing.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by SKU or Name..."
                className="w-64 rounded-lg border border-gray-300 bg-white/90 px-3 py-2 pr-9 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <span className="pointer-events-none absolute right-2 top-2.5 text-gray-400">🔎</span>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Products</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{products.length}</div>
          </div>
          <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Quantity</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{products.reduce((s, p) => s + (Number(p.quantity) || 0), 0)}</div>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Inventory Value</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">
              ${products.reduce((s, p) => s + (Number(p.quantity) || 0) * (Number(p.price) || 0), 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white/90 shadow">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit Product" : "Add New Product"}
            </h2>
            {editingId && (
              <button
                type="button"
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  setEditingId(null);
                  setForm({ sku: "", name: "", quantity: 0, price: 0 });
                  setError("");
                  setSuccessMessage("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="col-span-1 md:col-span-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                required
                min="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-2.5 text-gray-500">$</span>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white pl-7 pr-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  required
                  min="0"
                />
              </div>
            </div>
            <div className="md:col-span-5 flex justify-end gap-3 mt-2">
              <button
                type="submit"
                className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {editingId ? "Update" : "Add"} Product
              </button>
            </div>
          </form>
          {error && (
            <div className="px-6 pb-5 text-sm text-red-600">{error}</div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">SKU</th>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Quantity</th>
                  <th className="px-6 py-3 font-semibold">Price</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-center text-gray-500">No products found.</td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                      <td className="px-6 py-3 font-mono text-gray-800">{p.sku}</td>
                      <td className="px-6 py-3 text-gray-800">{p.name}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          Number(p.quantity) > 0 ? "bg-green-50 text-green-700 ring-1 ring-green-200" : "bg-red-50 text-red-700 ring-1 ring-red-200"
                        }`}>
                          {p.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">${Number(p.price).toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            className="inline-flex items-center rounded-md bg-amber-500 px-3 py-1.5 text-white text-xs font-semibold shadow hover:bg-amber-600"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-white text-xs font-semibold shadow hover:bg-red-700"
                            onClick={() => handleDelete(p.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

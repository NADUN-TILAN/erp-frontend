import Link from "next/link";
import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    orderNumber: "",
    createdAt: "",
    items: ""
  });
  const [editId, setEditId] = useState(null);

  // Fetch orders from API on mount
  useEffect(() => {
    fetch("http://localhost:5002/api/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(() => setOrders([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      // Update order in backend (PUT)
      fetch(`http://localhost:5002/api/orders/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: form.orderNumber,
          createdAt: form.createdAt || new Date().toISOString(),
          items: form.items
            .split(",")
            .map((item, idx) => {
              const [productId, quantity] = item.split(":");
              return { id: idx + 1, productId: productId.trim(), quantity: Number(quantity) };
            })
        })
      })
        .then(() => {
          // Refresh orders after update
          return fetch("http://localhost:5002/api/orders")
            .then(res => res.json())
            .then(data => setOrders(data));
        });
      setEditId(null);
    } else {
      // Add new order to backend (POST)
      fetch("http://localhost:5002/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: form.orderNumber,
          createdAt: form.createdAt || new Date().toISOString(),
          items: form.items
            .split(",")
            .map((item, idx) => {
              const [productId, quantity] = item.split(":");
              return { id: idx + 1, productId: productId.trim(), quantity: Number(quantity) };
            })
        })
      })
        .then(() => {
          // Refresh orders after add
          return fetch("http://localhost:5002/api/orders")
            .then(res => res.json())
            .then(data => setOrders(data));
        });
    }
    setForm({ orderNumber: "", createdAt: "", items: "" });
  };

  const handleEditOrder = (order) => {
    setEditId(order.id);
    setForm({
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      items: order.items.map(i => `${i.productId}:${i.quantity}`).join(", ")
    });
  };

  const handleDeleteOrder = (orderId) => {
    fetch(`http://localhost:5002/api/orders/${orderId}`, {
      method: "DELETE"
    })
      .then(() => {
        // Refresh orders after delete
        return fetch("http://localhost:5002/api/orders")
          .then(res => res.json())
          .then(data => setOrders(data));
      });
    if (editId === orderId) {
      setEditId(null);
      setForm({ orderNumber: "", createdAt: "", items: "" });
    }
  };

  return (
    <div className="p-10">
      <NavBar />
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Add/Edit Order Form */}
      <form className="mb-6 flex gap-4 items-end" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm">Order #</label>
          <input
            name="orderNumber"
            value={form.orderNumber}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Date</label>
          <input
            name="createdAt"
            type="datetime-local"
            value={form.createdAt}
            onChange={handleChange}
            className="border px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm">Items<br /><span className="text-xs text-gray-500">(Format: P001:2, P002:1)</span></label>
          <input
            name="items"
            value={form.items}
            onChange={handleChange}
            className="border px-2 py-1"
            required
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
              setForm({ orderNumber: "", createdAt: "", items: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Order #</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Items</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">No orders found.</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.orderNumber}</td>
                <td className="border px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="border px-4 py-2">
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id}>{item.productId} - Qty: {item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded text-white"
                    onClick={() => handleEditOrder(order)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 px-2 py-1 rounded text-white"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

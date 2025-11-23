import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch orders from API
    setLoading(false);
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-indigo-700 mb-2">Please sign in</h1>
          <p className="text-gray-500">You need to be logged in to view orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500">Manage and track customer orders.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order ID</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-center text-gray-500">Loading...</td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-center text-gray-500">No orders found.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                      <td className="px-6 py-3 font-mono text-gray-800">{order.id}</td>
                      <td className="px-6 py-3 text-gray-800">{order.customer}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">${order.total?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-3 text-gray-600">{order.date}</td>
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
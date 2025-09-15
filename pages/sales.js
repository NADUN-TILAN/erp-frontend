import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";

export default function SalesPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    fetch("http://localhost:5002/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([]));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    return orders.filter((o) => {
      const matchQ = !q || (o.orderNumber || "").toLowerCase().includes(q);
      const dt = new Date(o.createdAt);
      const matchFrom = !fromDate || dt >= fromDate;
      const matchTo = !toDate || dt <= toDate;
      return matchQ && matchFrom && matchTo;
    });
  }, [orders, query, from, to]);

  const totalOrders = filtered.length;
  const totalItems = filtered.reduce((s, o) => s + (o.items?.reduce((x, i) => x + (i.quantity || 0), 0) || 0), 0);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-indigo-700 mb-2">Please sign in</h1>
          <p className="text-gray-500">You need to be logged in to view sales.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sales</h1>
            <p className="text-gray-500">Overview of recent orders and items sold.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search order #" className="w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Orders</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{totalOrders}</div>
          </div>
          <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Total Items</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{totalItems}</div>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Avg Items / Order</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{totalOrders ? (totalItems/totalOrders).toFixed(1) : 0}</div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order #</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Items</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="3" className="px-6 py-6 text-center text-gray-500">No sales in range.</td></tr>
                ) : (
                  filtered.map((o)=> (
                    <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                      <td className="px-6 py-3 font-medium text-gray-900">{o.orderNumber}</td>
                      <td className="px-6 py-3 text-gray-800">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3">{o.items?.reduce((s,i)=>s+(i.quantity||0),0)}</td>
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



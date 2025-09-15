import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";

export default function ReportsPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-indigo-700 mb-2">Please sign in</h1>
          <p className="text-gray-500">You need to be logged in to view reports.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reports</h1>
          <p className="text-gray-500">KPIs and exports (placeholders ready for charts).</p>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Revenue</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">$0.00</div>
          </div>
          <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Orders</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">0</div>
          </div>
          <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Top Product</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">—</div>
          </div>
          <div className="rounded-xl border border-pink-100 bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-500">Customers</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">—</div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-72 rounded-2xl border border-gray-200 bg-white/90 shadow grid place-items-center text-gray-500">
            Sales Chart (placeholder)
          </div>
          <div className="h-72 rounded-2xl border border-gray-200 bg-white/90 shadow grid place-items-center text-gray-500">
            Inventory Chart (placeholder)
          </div>
        </div>

        {/* Export Actions */}
        <div className="mt-8 flex gap-3">
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700">Export CSV</button>
          <button className="rounded-lg bg-gray-100 px-4 py-2 text-gray-800 font-semibold shadow hover:bg-gray-200">Export PDF</button>
        </div>
      </main>
    </div>
  );
}



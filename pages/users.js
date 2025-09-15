import { useState } from "react";
import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";

export default function UserPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullname: "",
    address: "",
    mobile: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setForm({ username: "", email: "", password: "", fullname: "", address: "", mobile: "" });
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white/90 rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
          <h1 className="text-2xl font-extrabold text-indigo-700 mb-2">Please sign in</h1>
          <p className="text-gray-500">You need to be logged in to manage your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <NavBar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">User Management</h1>
          <p className="text-gray-500">Update your profile and account details.</p>
        </div>

        {/* Profile + Form */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-8">
          <div className="md:col-span-1 rounded-2xl border border-gray-200 bg-white/90 shadow p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-indigo-600 text-white grid place-items-center text-xl font-bold">
                {session.user?.name?.[0] || session.user?.username?.[0] || "U"}
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{session.user?.fullname || session.user?.name || session.user?.username}</div>
                <div className="text-sm text-gray-600">{session.user?.email}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <div><span className="font-medium text-gray-700">Mobile:</span> {session.user?.mobile || "—"}</div>
              <div className="mt-1"><span className="font-medium text-gray-700">Address:</span> {session.user?.address || "—"}</div>
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white/90 shadow">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Edit Details</h2>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
                <input name="username" value={form.username} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                <input name="fullname" value={form.fullname} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Mobile</label>
                <input name="mobile" value={form.mobile} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200" required />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">Save</button>
              </div>
            </form>
          </div>
        </div>

        {/* Current user info table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">Username</th>
                  <th className="px-6 py-3 font-semibold">Full Name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">Mobile</th>
                  <th className="px-6 py-3 font-semibold">Address</th>
                  <th className="px-6 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-6 py-3">{session.user?.username || session.user?.name}</td>
                  <td className="px-6 py-3">{session.user?.fullname || session.user?.name}</td>
                  <td className="px-6 py-3">{session.user?.email}</td>
                  <td className="px-6 py-3">{session.user?.mobile || "—"}</td>
                  <td className="px-6 py-3">{session.user?.address || "—"}</td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button className="inline-flex items-center rounded-md bg-amber-500 px-3 py-1.5 text-white text-xs font-semibold shadow hover:bg-amber-600" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Edit</button>
                      <button className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-white text-xs font-semibold shadow hover:bg-red-700">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
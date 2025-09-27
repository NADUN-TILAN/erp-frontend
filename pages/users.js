import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NavBar from "../components/NavBar";

const API_URL = "http://localhost:5000/api/users";

export default function UserPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    id: "",
    email: "",
    name: "",
    githubId: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setError("");
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const errorText = await response.text();
        setError(`Failed to fetch users: ${errorText}`);
      }
    } catch (err) {
      setError(`Error connecting to the server: ${err.message}`);
      console.error("Fetch error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSuccessMessage("User created successfully!");
        setForm({ id: "", email: "", name: "", githubId: "" });
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create user");
      }
    } catch (err) {
      setError("Error connecting to the server");
    }
  };

  const handleDelete = async (username) => {
    try {
      const response = await fetch(`${API_URL}/${username}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("User deleted successfully!");
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      setError("Error connecting to the server");
    }
  };

  const handleEdit = async (user) => {
    try {
      const response = await fetch(`${API_URL}/${user.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        setSuccessMessage("User updated successfully!");
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update user");
      }
    } catch (err) {
      setError("Error connecting to the server");
    }
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

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
        )}

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
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">GitHub ID</label>
                <input
                  type="text"
                  name="githubId"
                  value={form.githubId}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {form.id ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Users table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 font-semibold">Name</th>
                  <th className="px-6 py-3 font-semibold">Email</th>
                  <th className="px-6 py-3 font-semibold">GitHub ID</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-t border-gray-100">
                      <td className="px-6 py-3">{user.name}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">{user.githubId || "—"}</td>
                      <td className="px-6 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setForm(user)}
                            className="inline-flex items-center rounded-md bg-amber-500 px-3 py-1.5 text-white text-xs font-semibold shadow hover:bg-amber-600">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-white text-xs font-semibold shadow hover:bg-red-700">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-3 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
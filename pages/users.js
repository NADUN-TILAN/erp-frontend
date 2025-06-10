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
    // Handle user registration or login logic here
    // Example: await fetch("/api/user", { method: "POST", body: JSON.stringify(form) });
    setForm({ username: "", email: "", password: "", fullname: "", address: "", mobile: "" });
  };

  if (!session) return <p className="text-center mt-10">Please sign in to manage your account.</p>;

  return (
    <div className="p-10">
      <NavBar />
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <form className="mb-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Full Name</label>
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Mobile Number</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="border px-2 py-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register / Login
        </button>
      </form>

      {session && (
        <div>
          <h2 className="text-xl font-bold">User Information</h2>
          <table className="min-w-[400px] border mt-4">
            <thead>
              <tr>
                <th className="border px-2 py-1">Username</th>
                <th className="border px-2 py-1">Full Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Mobile</th>
                <th className="border px-2 py-1">Address</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">{session.user.username}</td>
                <td className="border px-2 py-1">{session.user.fullname}</td>
                <td className="border px-2 py-1">{session.user.email}</td>
                <td className="border px-2 py-1">{session.user.mobile}</td>
                <td className="border px-2 py-1">{session.user.address}</td>
                <td className="border px-2 py-1">
                  <button className="bg-yellow-400 text-black px-2 py-1 rounded mr-2">Edit</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
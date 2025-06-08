import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update logic here
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full mt-10">
          <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-4">
            Profile
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="mb-2 text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              defaultValue={session.user.name}
              className="mb-4 p-2 border border-gray-300 rounded"
              required
            />
            <label className="mb-2 text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              defaultValue={session.user.email}
              className="mb-4 p-2 border border-gray-300 rounded"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </form>
          <button
            className="mt-4 flex items-center gap-2 mx-auto bg-red-600 text-white px-4 py-2 rounded font-semibold shadow hover:bg-red-700 transition"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
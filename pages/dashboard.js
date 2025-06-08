import { useSession, signOut } from "next-auth/react";
import NavBar from "../components/NavBar";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <h1 className="text-3xl font-extrabold text-indigo-700">
          You must be logged in to view this page.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex flex-col">
      <NavBar />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-lg w-full mt-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2">
            Welcome, {session.user.name}
          </h1>
          <div className="flex items-center justify-center text-gray-600 mb-6">
            <span>{session.user.email}</span>
          </div>
          <button
            className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-6 py-2 rounded font-semibold shadow hover:bg-blue-700 transition"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </main>
    </div>
  );
}
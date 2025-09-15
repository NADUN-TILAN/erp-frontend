import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const { error } = router.query;

  // Map known errors to user-friendly messages
  const errorMessages = {
    OAuthSignin: "There was a problem signing in with the selected provider.",
    OAuthCallback: "OAuth callback failed.",
    OAuthCreateAccount: "Could not create OAuth account.",
    EmailCreateAccount: "Could not create email account.",
    Callback: "Sign in callback error.",
    OAuthAccountNotLinked: "Account not linked. Try another sign-in method.",
    EmailSignin: "Error sending email.",
    CredentialsSignin: "Sign in failed. Check your credentials.",
    default: "Unable to sign in.",
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Keep hooks before any conditional returns to avoid hook order changes
  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <NavBar />
        <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-2">
          <section className="rounded-2xl border border-indigo-100 bg-white/90 p-8 shadow">
            <h1 className="text-3xl font-extrabold text-indigo-700 tracking-tight">Welcome to ERP System</h1>
            <p className="mt-2 text-gray-600">Manage Inventory, Orders, Users, and Reports in one place.</p>
            <ul className="mt-6 space-y-2 text-gray-700">
              <li>• Fast inventory updates and product management</li>
              <li>• Order tracking with Kafka-powered events</li>
              <li>• Secure authentication with sessions</li>
            </ul>
          </section>
          <section className="rounded-2xl border border-gray-200 bg-white/90 p-8 shadow">
            <h2 className="text-xl font-semibold text-gray-900">Sign in</h2>
            <p className="mt-1 text-sm text-gray-500">Use your credentials. Try admin / admin.</p>
            {error && (
              <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {errorMessages[error] || errorMessages.default}
              </div>
            )}
            <form
              className="mt-5 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await signIn("credentials", {
                  redirect: false,
                  username,
                  password,
                  callbackUrl: "/dashboard",
                });
                if (!res || res.error) {
                  // Surface generic error via query or inline message
                  alert("Sign in failed. Check your credentials.");
                }
              }}
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Sign in
              </button>
              <p className="text-xs text-gray-500">Hint: admin / admin</p>
            </form>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-green-700 mb-2 tracking-tight">
          Welcome, {session.user.name}
        </h1>
        <p className="mb-4 text-gray-500">
          Email:{" "}
          <span className="font-medium text-gray-700">{session.user.email}</span>
        </p>
        <button
          onClick={() => signOut()}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

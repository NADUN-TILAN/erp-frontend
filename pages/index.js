import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

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

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col items-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-2 tracking-tight">
            ERP System
          </h1>
          <p className="text-gray-500 mb-6 text-center">
            Sign in to access your dashboard
          </p>
          {/* Show error message if present */}
          {error && (
            <div className="mb-4 w-full text-center text-red-600 font-semibold">
              {errorMessages[error] || errorMessages.default}
            </div>
          )}
          <button
            onClick={() => signIn("github")}
            className="flex items-center gap-2 px-6 py-3 mb-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition"
          >
            {/* GitHub SVG */}
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98.01 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.67.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z" />
            </svg>
            Sign in with GitHub
          </button>
          <button
            onClick={() => signIn("google")}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow transition"
          >
            {/* Google SVG */}
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <g>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.87-6.87C36.68 2.36 30.74 0 24 0 14.82 0 6.73 5.8 2.69 14.09l7.99 6.21C12.36 13.97 17.73 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.91-2.18 5.37-4.65 7.03l7.19 5.6C43.99 37.13 46.1 31.37 46.1 24.55z"/>
                <path fill="#FBBC05" d="M10.68 28.3a14.48 14.48 0 0 1 0-8.6l-7.99-6.21A23.97 23.97 0 0 0 0 24c0 3.97.96 7.73 2.69 11.09l7.99-6.21z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.15 15.9-5.85l-7.19-5.6c-2.01 1.35-4.59 2.15-8.71 2.15-6.27 0-11.64-4.47-13.32-10.49l-7.99 6.21C6.73 42.2 14.82 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </g>
            </svg>
            Sign in with Google
          </button>
        </div>
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

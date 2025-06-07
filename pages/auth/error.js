import { useRouter } from "next/router";

const errorMessages = {
  OAuthSignin: "There was an error signing in with the provider.",
  OAuthCallback: "There was an error during the OAuth callback.",
  OAuthCreateAccount: "There was an error creating your account.",
  EmailCreateAccount: "There was an error creating your email account.",
  Callback: "There was an error during sign in.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "There was an error sending the email.",
  CredentialsSignin: "Sign in failed. Check your credentials.",
  default: "Unable to sign in.",
};

export default function AuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;
  const message = errorMessages[error] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-red-700 mb-4 tracking-tight">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-6 text-center">{message}</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
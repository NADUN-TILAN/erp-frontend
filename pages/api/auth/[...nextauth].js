import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const providers = [
  CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const username = credentials.username || credentials.email || "";
        const password = credentials.password || "";
        if (!username || !password) return null;
        // Allow local dev login with any non-empty credentials; prefer admin/admin
        return {
          id: "1",
          name: username === "admin" ? "Admin User" : username,
          email: username.includes("@") ? username : `${username}@example.com`,
          username,
          fullname: username,
          address: "",
          mobile: ""
        };
      }
    })
];

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    })
  );
}

export default NextAuth({
  providers,
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret"
});
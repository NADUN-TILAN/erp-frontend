import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
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
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret"
});
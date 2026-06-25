import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Auth.js v5 central config. Replaces the v4 `NextAuth({...})` handler in the
// [...nextauth] route. `auth()` is used both server-side (API routes, proxy)
// and to expose route handlers. Env var names are kept identical to the v4
// setup (GOOGLE_ID / GOOGLE_CLIENT_SECRET / NEXTAUTH_SECRET) so Netlify env
// vars don't need to change. `trustHost` is required off-Vercel (Netlify).
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, profile }: any) {
      // Enforce the allow-list at token-creation time (on sign-in).
      if (profile) {
        const allowedUsers = process.env.ALLOWED_USERS?.split(",");
        if (!allowedUsers?.includes(profile.email?.toLowerCase() || "")) {
          throw new Error("User not allowed");
        }
        token.email = profile.email;
        token.name = profile.name;
        token.picture = profile.picture;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ profile }: any) {
      try {
        const allowedUsers = process.env.ALLOWED_USERS?.split(",");
        if (!allowedUsers?.includes(profile?.email?.toLowerCase() || "")) {
          return false;
        }
        return true;
      } catch (error) {
        console.log("SignIn callback error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }: any) {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },
});

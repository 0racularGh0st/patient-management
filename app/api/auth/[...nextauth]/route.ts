import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        })
    ],
    pages: {
        signIn: '/',
        error: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, profile }: any) {
            // Check if user is allowed during JWT creation
            if (profile) {
                const allowedUsers = process.env.ALLOWED_USERS?.split(',');
                if (!allowedUsers?.includes(profile.email?.toLowerCase() || '')) {
                    throw new Error('User not allowed');
                }
                token.email = profile.email;
                token.name = profile.name;
                token.picture = profile.picture;
            }
            return token;
        },
        async session({ session, token }: any) {
            // Pass token data to session
            if (token && session.user) {
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture;
                session.user.id = token.sub;
            }
            return session;
        },
        async signIn({ profile }) {
            try {
                const allowedUsers = process.env.ALLOWED_USERS?.split(',');
                if (!allowedUsers?.includes(profile?.email?.toLowerCase() || '')) {
                    return false;
                }
                return true;
            }
            catch (error) {
                console.log('SignIn callback error:', error)
                return false;
            }
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            if (new URL(url).origin === baseUrl) return url
            return `${baseUrl}/dashboard`
        }
    },
    // Disable all cookies except essential ones
    cookies: {},
})

export { handler as GET, handler as POST };

import { connectToDB } from "@utils/database";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import User from "@models/user";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    pages: {
        signIn: '/',
        error: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    callbacks: {
        async session({ session }: { session: any }) {
            try {
                await connectToDB();
                const sessionUser = await User.findOne({ email: session.user.email });

                if (sessionUser) {
                    session.user.id = sessionUser._id.toString();
                }

                return session;
            } catch (error) {
                console.error('Session callback error:', error);
                return session;
            }
        },
        async signIn({ profile }) {
            try {
                const allowedUsers = process.env.ALLOWED_USERS?.split(',');
                if (!allowedUsers?.includes(profile?.email?.toLowerCase() || '')) {
                    return false;
                }
                await connectToDB();
                const userExists = await User.findOne({ email: profile?.email || '' })
                if (!userExists) {
                    await User.create({
                        email: profile?.email,
                        username: profile?.name?.replace(' ', '').toLowerCase()
                    })
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
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            }
        },
    },
})

export { handler as GET, handler as POST };

import { connectToDB } from "@utils/database";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import User from "@models/user";

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
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl + '/dashboard'
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    cookies: {
        sessionToken: {
            name: `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true, // Always use secure cookies in production
                domain: process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL?.replace('https://', '').replace('http://', '') : undefined,
            }
        },
        callbackUrl: {
            name: `next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                domain: process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL?.replace('https://', '').replace('http://', '') : undefined,
            }
        },
        csrfToken: {
            name: `next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                domain: process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL?.replace('https://', '').replace('http://', '') : undefined,
            }
        },
        pkceCodeVerifier: {
            name: `next-auth.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                maxAge: 60 * 15, // 15 minutes
                domain: process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL?.replace('https://', '').replace('http://', '') : undefined,
            }
        },
        state: {
            name: `next-auth.state`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                maxAge: 60 * 15, // 15 minutes
                domain: process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL?.replace('https://', '').replace('http://', '') : undefined,
            }
        },
        nonce: {
            name: `next-auth.nonce`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                domain: process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL?.replace('https://', '').replace('http://', '') : undefined,
            }
        },
    },
    jwt: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
})

export { handler as GET, handler as POST };

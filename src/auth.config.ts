import type { NextAuthConfig } from "next-auth";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";

export default {
    providers: [
        github({
            clientId: process.env.AUTH_GITHUB_ID as string,
            clientSecret: process.env.AUTH_GITHUB_SECRET as string,
        }),
        google({
            clientId: process.env.AUTH_GOOGLE_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        session({ session, user, token }) {
            if (session.user) {
                // If using JWT strategy, user is undefined and token is used
                // If using database strategy, user is available
                session.user.id = user?.id || token?.sub as string;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;

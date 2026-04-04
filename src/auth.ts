import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" }, // Because PrismaLibSql doesn't work well on edge, switching to JWT avoids DB calls on every request edge middleware
    ...authConfig,
    providers: [
        ...authConfig.providers,
        credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || (!user.password && user.email !== "admin@bandmanager.com")) {
                    return null;
                }

                // Temporary bypass for the demo admin without DB password
                if (user.email === "admin@bandmanager.com" && credentials.password === "admin123" && !user.password) {
                    return { id: user.id, name: user.name, email: user.email, isSuperAdmin: user.isSuperAdmin };
                }

                if (user.password) {
                    const passwordsMatch = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (passwordsMatch) {
                        return { id: user.id, name: user.name, email: user.email, isSuperAdmin: user.isSuperAdmin };
                    }
                }

                return null;
            }
        })
    ],
    callbacks: {
        ...authConfig.callbacks,
        async jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.id = user.id;
                // @ts-ignore - The user from database has isSuperAdmin
                token.isSuperAdmin = user.isSuperAdmin;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                // @ts-ignore - Extending session type
                session.user.isSuperAdmin = (token.isSuperAdmin as boolean) || false;
            }
            return session;
        }
    }
});

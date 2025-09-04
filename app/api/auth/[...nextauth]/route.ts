import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
        name: 'credentials',
        credentials: {
            email: { label: 'email', type: 'text' },
            password: { label: 'password', type: 'password' },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                throw new Error('Invalid credentials');
            }

            const client = await clientPromise;
            const db = client.db();
            const user = await db.collection('users').findOne({ email: credentials.email });

            if (!user || !user.password) {
                throw new Error('Invalid credentials');
            }

            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

            if (!isPasswordCorrect) {
                throw new Error('Invalid credentials');
            }

            return user;
        },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async session({ session, token }: { session: any; token: any }) {
        if (token) {
            session.user.id = token.id;
            session.user.gender = token.gender;
            session.user.address = token.address;
            session.user.age = token.age;
            session.user.image = token.image;
        }
        return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
        if (user) {
            token.id = user._id;
            const client = await clientPromise;
            const db = client.db();
            const dbUser = await db.collection('users').findOne({ email: user.email });
            if (dbUser) {
                token.gender = dbUser.gender;
                token.address = dbUser.address;
                token.age = dbUser.age;
                token.image = dbUser.image;
            }
        }
        return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions as any)

export { handler as GET, handler as POST }
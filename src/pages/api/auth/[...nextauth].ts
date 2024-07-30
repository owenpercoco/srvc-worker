import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connect from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials as { username: string, password: string };

        // Input validation
        if (!username || !password) {
          throw new Error('Invalid credentials');
        }

        // Connect to MongoDB
        await connect();

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('Invalid credentials');
        }

        // Check password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        // Return user object with required properties
        return { id: user.id.toString(), name: user.username };
      },
    }),
  ],
  pages: {
    signIn: '/inventory',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});

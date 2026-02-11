import { NextAuthOptions } from 'next-auth';
import type { Provider } from 'next-auth/providers';

// Mock SecondMe OAuth Provider for Demo
const MockSecondMeProvider: Provider = {
  id: 'secondme',
  name: 'SecondMe',
  type: 'credentials',
  credentials: {
    name: 'Demo User',
  },
  authorize: async () => {
    // 返回模拟用户数据
    return {
      id: 'demo-user-123',
      name: 'Demo User',
      email: 'demo@example.com',
      image: 'https://api.dicebear.com/7.x/avataaas/svg?seed=DemoUser',
    };
  },
};

export const authOptions: NextAuthOptions = {
  providers: [MockSecondMeProvider],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.accessToken = 'mock-access-token';
        session.user.secondMeId = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: 'jwt',
  },
};

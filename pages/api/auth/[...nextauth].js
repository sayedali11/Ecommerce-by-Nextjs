// every request for sign in and sign out and checking of the authentication will be redirected to this file ([...mextauth].js)  and we need to handle it here ([...mextauth].js)

import NextAuth from "next-auth/next";
import db from "@/utils/db";
import User from "@/models/User";
import bcryptjs from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?._isAdmin) token._isAdmin = user._isAdmin;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?._isAdmin) session.user._isAdmin = token._isAdmin;
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        const user = await User.findOne({
          email: credentials.email,
        });
        await db.disconnect();

        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            image: "f",
            isAdmin: user.isAdmin,
          };
        }
        throw new Error("Invalid email or password");
      },
    }),
  ],
});

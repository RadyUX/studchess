import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      eloBullet: number;
      eloBlitz: number;
      eloRapid: number;
      chesscomUsername: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    eloBullet: number;
    eloBlitz: number;
    eloRapid: number;
    chesscomUsername: string;
    repertoryId: string
  }
}

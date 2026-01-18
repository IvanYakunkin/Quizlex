import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            login: string;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        login: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        login: string;
    }
}
import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from "@/generated/prisma/client";

const port = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306;

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: port,
    connectionLimit: 15,
    connectTimeout: 5_000,
    idleTimeout: 300,
    // logger: {
    //     network: (info) => {
    //         console.log('PrismaAdapterNetwork', info);
    //     },
    //     query: (info) => {
    //         console.log('PrismaAdapterQuery', info);
    //     },
    //     error: (error) => {
    //         console.error('PrismaAdapterError', error);
    //     },
    //     warning: (info) => {
    //         console.warn('PrismaAdapterWarning', info);
    //     },
    // },
    allowPublicKeyRetrieval: true
});
const prisma = new PrismaClient({ adapter });

export { prisma }
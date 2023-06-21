import { PrismaClient } from "@prisma/client";

class DBClient {
    private static instance: DBClient;
    public prisma: PrismaClient;

    private constructor() {
        this.prisma = new PrismaClient();
    }

    public static getInstance() {
        if (!DBClient.instance) {
            DBClient.instance = new DBClient();
        }
        return DBClient.instance;
    }
}

export const prisma = DBClient.getInstance().prisma;

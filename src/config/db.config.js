const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function connectDB() {
    try {
        await prisma.$connect();
        console.log("Database connected successfully.");
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

connectDB();
module.exports = prisma;

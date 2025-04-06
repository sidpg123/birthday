
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();
async () => {
  await prisma.$connect()
  // console.log("connected to db");
  
}
export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
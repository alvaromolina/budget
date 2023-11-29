import { PrismaClient } from '@prisma/client'

const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {

  const hashedPassword = await bcrypt.hash("123456", 10);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      password: hashedPassword
    },
  });

  console.log({ alice })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
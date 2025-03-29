import prisma from "../src/lib/prisma";

async function main() {
  const director = await prisma.role.upsert({
    where: { name: 'director' },
    update: {},
    create: { name: 'director' },
  });
  
  await prisma.user.upsert({
    where: { phone: '0987654321' },
    update: {},
    create: {
      phone: '0987654321',
      password: '123456',
      roleId: director.id,
    },
  })
}

main()
  .then(async() => {
    await prisma.$disconnect()
  })
  .catch(async() => {
    await prisma.$disconnect()
    process.exit(1)
  })
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateItems() {
  const items = await prisma.item.findMany({
    where: {
      userId: "clipdsayh0000jp08nx9ba33e"
    }
  });

  for (const item of items) {
    await prisma.item.update({
      where: {id: item.id},
      data: { 
        category: null
      },
    });
  }

  console.log('Migration completed.');

  await prisma.$disconnect();
}

updateItems().catch((error) => {
  console.error(error);
  process.exit(1);
});
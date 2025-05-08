import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const id = process.argv[2];

if (!id) {
  console.error("❌ Missing Account ID");
  process.exit(1);
}

async function main() {
  console.log(`🔍 Deleting account with id = ${id}`);

  // Step 1: Find all threads of this account
  const threads = await prisma.thread.findMany({
    where: { accountId: id },
    select: { id: true },
  });
  const threadIds = threads.map((t) => t.id);

  // Step 2: Delete email attachments
  await prisma.emailAttachment.deleteMany({
    where: {
      Email: {
        threadId: { in: threadIds },
      },
    },
  });

  // Step 3: Delete emails
  await prisma.email.deleteMany({
    where: {
      threadId: { in: threadIds },
    },
  });

  // Step 4: Delete threads
  await prisma.thread.deleteMany({
    where: { accountId: id },
  });

  // Step 5: Delete email addresses
  await prisma.emailAddress.deleteMany({
    where: { accountId: id },
  });

  // Step 6: Delete the account
  await prisma.account.delete({
    where: { id },
  });

  console.log("✅ Deleted account and related data successfully");
}

main()
  .catch((err) => {
    console.error("❌ Error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

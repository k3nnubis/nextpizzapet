import { prisma } from "./prisma-client";
import { hashSync } from "bcrypt";

async function up() {
  await prisma.user.createMany(
    {
      data: [
        {
          fullName: "John Doe",
          email: "U9oNt@example.com",
          password: hashSync("password", 10),
          verified: new Date(),
          role: "USER",
        },
        {
          fullName: "Admin",
          email: "admin@example.com",
          password: hashSync("password", 10),
          verified: new Date(),
          role: "ADMIN",
        }
      ],
    }
  );
}
async function down() {
}
async function main() {
  try {
    await down();
    await up();
  } catch (error) {
    console.log(error);
  }
}

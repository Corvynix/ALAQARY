import bcrypt from "bcrypt";
import { storage } from "./storage";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function createAdmin() {
  try {
    const username = "admin";
    const password = "admin123";
    
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await storage.createUser({
      username,
      password: hashedPassword,
    });

    // Update role to admin
    await db
      .update(users)
      .set({ role: "admin" })
      .where(eq(users.id, user.id));

    console.log("Admin user created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
}

createAdmin();

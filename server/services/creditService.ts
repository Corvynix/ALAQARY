import { storage } from "../storage";
import type { InsertCreditTransaction } from "@shared/schema";

export interface CreditEarnRequest {
  userId: string;
  amount: number;
  reason: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

export interface CreditSpendRequest {
  userId: string;
  amount: number;
  reason: string;
  relatedEntityId?: string;
  relatedEntityType?: string;
}

/**
 * Earn credits for a user
 * Creates a credit transaction and updates user balance
 */
export async function earnCredits(
  userId: string,
  amount: number,
  reason: string,
  relatedEntityId?: string,
  relatedEntityType?: string
): Promise<{ success: boolean; newBalance: number; transactionId: string }> {
  if (amount <= 0) {
    throw new Error("Credit amount must be positive");
  }

  // Create credit transaction
  const transaction: InsertCreditTransaction = {
    userId,
    amount: amount.toString(),
    type: "earn",
    reason,
    relatedEntityId,
    relatedEntityType,
  };

  const creditTransaction = await storage.createCreditTransaction(transaction);

  // Update user credits
  const updatedUser = await storage.updateUserCredits(userId, amount);
  if (!updatedUser) {
    throw new Error("User not found");
  }

  const newBalance = parseFloat(updatedUser.credits || "0");

  return {
    success: true,
    newBalance,
    transactionId: creditTransaction.id,
  };
}

/**
 * Spend credits for a user
 * Creates a credit transaction and updates user balance
 * Throws error if insufficient credits
 */
export async function spendCredits(
  userId: string,
  amount: number,
  reason: string,
  relatedEntityId?: string,
  relatedEntityType?: string
): Promise<{ success: boolean; newBalance: number; transactionId: string }> {
  if (amount <= 0) {
    throw new Error("Credit amount must be positive");
  }

  // Check current balance
  const currentBalance = await storage.getUserCredits(userId);
  if (currentBalance < amount) {
    throw new Error("Insufficient credits");
  }

  // Create credit transaction
  const transaction: InsertCreditTransaction = {
    userId,
    amount: (-amount).toString(), // Store as negative for spending
    type: "spend",
    reason,
    relatedEntityId,
    relatedEntityType,
  };

  const creditTransaction = await storage.createCreditTransaction(transaction);

  // Update user credits (subtract)
  const updatedUser = await storage.updateUserCredits(userId, -amount);
  if (!updatedUser) {
    throw new Error("User not found");
  }

  const newBalance = parseFloat(updatedUser.credits || "0");

  return {
    success: true,
    newBalance,
    transactionId: creditTransaction.id,
  };
}

/**
 * Get credit transaction history for a user
 */
export async function getCreditHistory(userId: string) {
  const transactions = await storage.getCreditTransactions(userId);
  return transactions;
}

/**
 * Get current credit balance for a user
 */
export async function getCreditBalance(userId: string): Promise<number> {
  return await storage.getUserCredits(userId);
}

/**
 * Admin function to manually add credits to a user
 */
export async function adminAddCredits(
  userId: string,
  amount: number,
  reason: string = "Admin manual credit addition"
): Promise<{ success: boolean; newBalance: number; transactionId: string }> {
  return await earnCredits(userId, amount, reason, undefined, "admin_action");
}


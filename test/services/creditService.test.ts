import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as creditService from '../../server/services/creditService';

// Mock storage
vi.mock('../../server/storage', () => ({
  storage: {
    getUserCredits: vi.fn(),
    createCreditTransaction: vi.fn(),
    updateUserCredits: vi.fn(),
    getCreditTransactions: vi.fn(),
  },
}));

describe('Credit Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('earnCredits', () => {
    it('should throw error for negative amount', async () => {
      await expect(
        creditService.earnCredits('user1', -10, 'test')
      ).rejects.toThrow('Credit amount must be positive');
    });

    it('should throw error for zero amount', async () => {
      await expect(
        creditService.earnCredits('user1', 0, 'test')
      ).rejects.toThrow('Credit amount must be positive');
    });
  });

  describe('spendCredits', () => {
    it('should throw error for negative amount', async () => {
      await expect(
        creditService.spendCredits('user1', -10, 'test')
      ).rejects.toThrow('Credit amount must be positive');
    });

    it('should throw error for insufficient credits', async () => {
      const { storage } = await import('../../server/storage');
      vi.mocked(storage.getUserCredits).mockResolvedValue(5);

      await expect(
        creditService.spendCredits('user1', 10, 'test')
      ).rejects.toThrow('Insufficient credits');
    });
  });

  describe('getCreditBalance', () => {
    it('should return user credit balance', async () => {
      const { storage } = await import('../../server/storage');
      vi.mocked(storage.getUserCredits).mockResolvedValue(100);

      const balance = await creditService.getCreditBalance('user1');
      expect(balance).toBe(100);
    });
  });
});


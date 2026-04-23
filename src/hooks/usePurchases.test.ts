import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { usePurchases } from './usePurchases';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const mockUser = { id: 'user-123', email: 'test@example.com' };

describe('usePurchases', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns empty state when user is not signed in', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });

    const { result } = renderHook(() => usePurchases());

    expect(result.current.purchases).toEqual([]);
    expect(result.current.purchasedRoomIds.size).toBe(0);
  });

  it('fetches purchases when user is signed in', async () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: mockUser });

    const mockPurchases = [
      { id: 'p1', user_id: 'user-123', room_id: 'room-1', price_paid: 1500, purchased_at: '2024-01-01' },
    ];
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockPurchases, error: null }),
    });

    const { result } = renderHook(() => usePurchases());

    await act(async () => {});

    expect(result.current.purchases).toEqual(mockPurchases);
    expect(result.current.purchasedRoomIds.has('room-1')).toBe(true);
  });

  it('returns an error when purchasing without being signed in', async () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: null });

    const { result } = renderHook(() => usePurchases());

    const response = await act(async () => result.current.purchase('room-1', 1500));

    expect(response.error).toBe('You must be signed in to purchase.');
  });

  it('inserts a purchase and returns no error on success', async () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: mockUser });

    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    };
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockChain);

    const { result } = renderHook(() => usePurchases());

    const response = await act(async () => result.current.purchase('room-1', 1500));

    expect(response.error).toBeNull();
    expect(mockChain.insert).toHaveBeenCalledWith({
      user_id: 'user-123',
      room_id: 'room-1',
      price_paid: 1500,
    });
  });

  it('returns the error message when insert fails', async () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ user: mockUser });

    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ error: { message: 'Insert failed' } }),
    };
    (supabase.from as ReturnType<typeof vi.fn>).mockReturnValue(mockChain);

    const { result } = renderHook(() => usePurchases());

    const response = await act(async () => result.current.purchase('room-1', 1500));

    expect(response.error).toBe('Insert failed');
  });
});

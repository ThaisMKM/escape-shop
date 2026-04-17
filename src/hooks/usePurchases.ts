import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { UserPurchase } from '../types';

export function usePurchases() {
  const { user } = useAuth();
  const [purchasedRoomIds, setPurchasedRoomIds] = useState<Set<string>>(new Set());
  const [purchases, setPurchases] = useState<UserPurchase[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPurchases = useCallback(async () => {
    if (!user) {
      setPurchasedRoomIds(new Set());
      setPurchases([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('user_purchases')
      .select('*')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (data) {
      setPurchases(data);
      setPurchasedRoomIds(new Set(data.map(p => p.room_id)));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const purchase = async (roomId: string, price: number): Promise<{ error: string | null }> => {
    if (!user) return { error: 'You must be signed in to purchase.' };

    const { error } = await supabase.from('user_purchases').insert({
      user_id: user.id,
      room_id: roomId,
      price_paid: price,
    });

    if (error) return { error: error.message };

    await fetchPurchases();
    return { error: null };
  };

  return { purchasedRoomIds, purchases, loading, purchase, refetch: fetchPurchases };
}

import { useState, useEffect } from 'react';
import { User, BadgeCheck, Clock, ShoppingBag, Play, CalendarDays } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { EscapeRoom, UserPurchase } from '../types';

interface PurchasedRoom {
  purchase: UserPurchase;
  room: EscapeRoom;
}

interface ProfilePageProps {
  onSelectRoom: (id: string) => void;
}

export function ProfilePage({ onSelectRoom }: ProfilePageProps) {
  const { user } = useAuth();
  const [purchasedRooms, setPurchasedRooms] = useState<PurchasedRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchPurchasedRooms = async () => {
      const { data: purchases } = await supabase
        .from('user_purchases')
        .select('*')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false });

      if (!purchases || purchases.length === 0) {
        setLoading(false);
        return;
      }

      const roomIds = purchases.map(p => p.room_id);
      const { data: rooms } = await supabase
        .from('escape_rooms')
        .select('*')
        .in('id', roomIds);

      if (rooms) {
        const combined = purchases.map(purchase => ({
          purchase,
          room: rooms.find(r => r.id === purchase.room_id)!,
        })).filter(pr => pr.room);

        setPurchasedRooms(combined);
      }

      setLoading(false);
    };

    fetchPurchasedRooms();
  }, [user]);

  const totalSpent = purchasedRooms.reduce((sum, pr) => sum + pr.purchase.price_paid, 0);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20 flex-shrink-0">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">My Profile</h1>
              <p className="text-gray-400 text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <ShoppingBag size={20} className="text-amber-400 mx-auto mb-2" />
              <p className="text-white font-bold text-xl">{purchasedRooms.length}</p>
              <p className="text-gray-400 text-xs">Rooms Owned</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <Clock size={20} className="text-amber-400 mx-auto mb-2" />
              <p className="text-white font-bold text-xl">
                {purchasedRooms.reduce((sum, pr) => sum + pr.room.duration_minutes, 0)}
              </p>
              <p className="text-gray-400 text-xs">Total Minutes</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <BadgeCheck size={20} className="text-amber-400 mx-auto mb-2" />
              <p className="text-white font-bold text-xl">${(totalSpent / 100).toFixed(2)}</p>
              <p className="text-gray-400 text-xs">Total Spent</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
          <BadgeCheck size={20} className="text-amber-400" />
          Purchased Rooms
        </h2>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-pulse flex gap-4">
                <div className="w-24 h-24 bg-gray-800 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                  <div className="h-3 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : purchasedRooms.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
            <ShoppingBag size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 font-medium mb-1">No rooms purchased yet</p>
            <p className="text-gray-600 text-sm">Browse the catalog to find your first escape adventure.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchasedRooms.map(({ purchase, room }) => (
              <div
                key={purchase.id}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-black/30"
              >
                <div className="flex flex-col sm:flex-row gap-0">
                  <div className="relative w-full sm:w-32 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={room.image_url}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-900 hidden sm:block" />
                  </div>

                  <div className="flex-1 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <BadgeCheck size={15} className="text-green-400 flex-shrink-0" />
                        <span className="text-green-400 text-xs font-semibold">Owned</span>
                      </div>
                      <h3 className="text-white font-bold text-base mb-1 truncate">{room.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-1">{room.short_description}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {room.duration_minutes} min
                        </span>
                        <span className="capitalize">{room.difficulty}</span>
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} />
                          Purchased {formatDate(purchase.purchased_at)}
                        </span>
                        <span className="text-amber-400 font-semibold">
                          ${(purchase.price_paid / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectRoom(room.id)}
                      className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500 border border-amber-500/30 hover:border-amber-500 text-amber-400 hover:text-black font-semibold px-4 py-2.5 rounded-lg transition-all duration-200 text-sm flex-shrink-0"
                    >
                      <Play size={15} />
                      View Room
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

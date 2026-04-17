import { useState } from 'react';
import { ArrowLeft, Clock, Users, Star, BadgeCheck, ShoppingCart, Loader2, AlertCircle, Trophy, Zap } from 'lucide-react';
import type { EscapeRoom } from '../../types';
import { useAuth } from '../../context/AuthContext';

const difficultyConfig = {
  easy: { label: 'Easy', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  hard: { label: 'Hard', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
  expert: { label: 'Expert', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
};

interface RoomDetailProps {
  room: EscapeRoom;
  isPurchased: boolean;
  onBack: () => void;
  onPurchase: (roomId: string, price: number) => Promise<{ error: string | null }>;
  onShowAuth: () => void;
}

export function RoomDetail({ room, isPurchased, onBack, onPurchase, onShowAuth }: RoomDetailProps) {
  const { user } = useAuth();
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justPurchased, setJustPurchased] = useState(false);
  const diff = difficultyConfig[room.difficulty];

  const handlePurchase = async () => {
    if (!user) {
      onShowAuth();
      return;
    }
    setPurchasing(true);
    setError(null);
    const { error } = await onPurchase(room.id, room.price);
    if (error) {
      setError(error);
    } else {
      setJustPurchased(true);
    }
    setPurchasing(false);
  };

  const owned = isPurchased || justPurchased;

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={room.image_url}
          alt={room.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />

        <div className="absolute top-6 left-4 sm:left-6 lg:left-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700 text-gray-200 hover:text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative pb-20">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${diff.bg} ${diff.color}`}>
            {diff.label}
          </span>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
            {room.theme}
          </span>
          {room.is_featured && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500 text-black">
              FEATURED
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{room.title}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Star size={16} className="text-amber-400 fill-amber-400" />
                <span className="text-amber-400 font-semibold">{room.rating}</span>
                <span className="text-gray-400">({room.review_count} reviews)</span>
              </div>
            </div>
          </div>

          <div className="md:text-right">
            {owned ? (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-6 py-4">
                <BadgeCheck size={24} className="text-green-400" />
                <div>
                  <p className="text-green-400 font-bold text-lg">Purchased</p>
                  <p className="text-green-400/70 text-xs">You own this room</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 min-w-[200px]">
                <p className="text-3xl font-bold text-white mb-1">${(room.price / 100).toFixed(2)}</p>
                <p className="text-gray-400 text-xs mb-4">One-time purchase</p>
                {error && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
                    <AlertCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-300 text-xs">{error}</p>
                  </div>
                )}
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                >
                  {purchasing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={18} />
                  )}
                  {purchasing ? 'Processing...' : (user ? 'Buy Now' : 'Sign in to Buy')}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <Clock size={20} className="text-amber-400 mx-auto mb-2" />
            <p className="text-white font-bold">{room.duration_minutes} min</p>
            <p className="text-gray-400 text-xs">Duration</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <Users size={20} className="text-amber-400 mx-auto mb-2" />
            <p className="text-white font-bold">Up to {room.max_players}</p>
            <p className="text-gray-400 text-xs">Players</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
            <Trophy size={20} className="text-amber-400 mx-auto mb-2" />
            <p className={`font-bold ${diff.color}`}>{diff.label}</p>
            <p className="text-gray-400 text-xs">Difficulty</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-amber-400" />
            <h2 className="text-white font-bold text-lg">About this Experience</h2>
          </div>
          <p className="text-gray-300 leading-relaxed">{room.description}</p>
        </div>
      </div>
    </div>
  );
}

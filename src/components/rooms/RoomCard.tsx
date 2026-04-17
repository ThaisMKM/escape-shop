import { Clock, Users, Star, BadgeCheck, ShoppingCart } from 'lucide-react';
import type { EscapeRoom } from '../../types';

const difficultyConfig = {
  easy: { label: 'Easy', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  medium: { label: 'Medium', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  hard: { label: 'Hard', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  expert: { label: 'Expert', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

interface RoomCardProps {
  room: EscapeRoom;
  isPurchased: boolean;
  onSelect: (id: string) => void;
}

export function RoomCard({ room, isPurchased, onSelect }: RoomCardProps) {
  const diff = difficultyConfig[room.difficulty];

  return (
    <button
      onClick={() => onSelect(room.id)}
      className="group text-left bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={room.image_url}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

        {room.is_featured && !isPurchased && (
          <div className="absolute top-3 left-3 bg-amber-500 text-black text-xs font-bold px-2.5 py-1 rounded-full">
            FEATURED
          </div>
        )}

        {isPurchased && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-green-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <BadgeCheck size={12} />
            Owned
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${diff.color}`}>
            {diff.label}
          </span>
        </div>

        <div className="absolute bottom-3 left-3">
          <span className="bg-gray-900/80 backdrop-blur-sm text-gray-300 text-xs px-2.5 py-1 rounded-full border border-gray-700">
            {room.theme}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-white font-bold text-base leading-snug group-hover:text-amber-400 transition-colors">
            {room.title}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-amber-400 text-sm font-semibold">{room.rating}</span>
            <span className="text-gray-500 text-xs">({room.review_count})</span>
          </div>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {room.short_description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {room.duration_minutes}min
            </span>
            <span className="flex items-center gap-1">
              <Users size={12} />
              Up to {room.max_players}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isPurchased ? (
              <span className="text-green-400 text-sm font-semibold">Purchased</span>
            ) : (
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg px-3 py-1.5 group-hover:bg-amber-500 group-hover:border-amber-500 group-hover:text-black transition-all duration-200">
                <ShoppingCart size={13} />
                <span className="text-sm font-bold">${(room.price / 100).toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

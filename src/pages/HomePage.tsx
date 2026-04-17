import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Flame, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { RoomCard } from '../components/rooms/RoomCard';
import type { EscapeRoom } from '../types';

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard', 'Expert'] as const;
const THEMES = ['All', 'Horror', 'Sci-Fi', 'Mystery', 'Adventure', 'Fantasy', 'Thriller', 'Historical'];

interface HomePageProps {
  purchasedRoomIds: Set<string>;
  onSelectRoom: (id: string) => void;
}

export function HomePage({ purchasedRoomIds, onSelectRoom }: HomePageProps) {
  const [rooms, setRooms] = useState<EscapeRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<string>('All');
  const [theme, setTheme] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    supabase
      .from('escape_rooms')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .then(({ data }) => {
        if (data) setRooms(data);
        setLoading(false);
      });
  }, []);

  const featured = rooms.filter(r => r.is_featured);

  const filtered = rooms.filter(r => {
    const matchesSearch =
      search.trim() === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.theme.toLowerCase().includes(search.toLowerCase()) ||
      r.short_description.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficulty === 'All' || r.difficulty === difficulty.toLowerCase();
    const matchesTheme = theme === 'All' || r.theme === theme;
    return matchesSearch && matchesDiff && matchesTheme;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <Flame size={14} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Premium Escape Experiences</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Find Your Next<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Escape Adventure
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Explore hundreds of immersive escape room experiences for every skill level. Purchase once, play anytime.
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search rooms, themes, or genres..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!search && featured.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <h2 className="text-white font-bold text-xl">Featured Rooms</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isPurchased={purchasedRoomIds.has(room.id)}
                  onSelect={onSelectRoom}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-white font-bold text-xl">
              {search ? `Results for "${search}"` : 'All Rooms'}
              <span className="text-gray-500 font-normal text-base ml-2">({filtered.length})</span>
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 border rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                showFilters || difficulty !== 'All' || theme !== 'All'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {(difficulty !== 'All' || theme !== 'All') && (
                <span className="bg-amber-500 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {(difficulty !== 'All' ? 1 : 0) + (theme !== 'All' ? 1 : 0)}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Difficulty</p>
                <div className="flex flex-wrap gap-2">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        difficulty === d
                          ? 'bg-amber-500 text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Theme</p>
                <div className="flex flex-wrap gap-2">
                  {THEMES.map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        theme === t
                          ? 'bg-amber-500 text-black'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-800" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-800 rounded w-full" />
                    <div className="h-3 bg-gray-800 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No rooms match your search.</p>
              <button
                onClick={() => { setSearch(''); setDifficulty('All'); setTheme('All'); }}
                className="text-amber-400 hover:text-amber-300 text-sm mt-2 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(room => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isPurchased={purchasedRoomIds.has(room.id)}
                  onSelect={onSelectRoom}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

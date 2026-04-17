import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { RoomDetail } from './components/rooms/RoomDetail';
import { usePurchases } from './hooks/usePurchases';
import { supabase } from './lib/supabase';
import type { EscapeRoom, Page } from './types';

function AppInner() {
  const { user } = useAuth();
  const [page, setPage] = useState<Page>('home');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<EscapeRoom | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const { purchasedRoomIds, purchase } = usePurchases();

  useEffect(() => {
    if (!selectedRoomId) {
      setSelectedRoom(null);
      return;
    }
    supabase
      .from('escape_rooms')
      .select('*')
      .eq('id', selectedRoomId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSelectedRoom(data);
      });
  }, [selectedRoomId]);

  const handleSelectRoom = (id: string) => {
    setSelectedRoomId(id);
    setPage('detail');
  };

  const handleNavigate = (target: 'home' | 'profile') => {
    if (target === 'profile' && !user) {
      setShowAuth(true);
      return;
    }
    setPage(target);
    setSelectedRoomId(null);
  };

  const handleBack = () => {
    setPage('home');
    setSelectedRoomId(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {page !== 'detail' && (
        <Header
          onShowAuth={() => setShowAuth(true)}
          onNavigate={handleNavigate}
          currentPage={page}
        />
      )}

      {page === 'home' && (
        <HomePage
          purchasedRoomIds={purchasedRoomIds}
          onSelectRoom={handleSelectRoom}
        />
      )}

      {page === 'profile' && user && (
        <ProfilePage onSelectRoom={handleSelectRoom} />
      )}

      {page === 'detail' && selectedRoom && (
        <>
          <Header
            onShowAuth={() => setShowAuth(true)}
            onNavigate={handleNavigate}
            currentPage={page}
          />
          <RoomDetail
            room={selectedRoom}
            isPurchased={purchasedRoomIds.has(selectedRoom.id)}
            onBack={handleBack}
            onPurchase={purchase}
            onShowAuth={() => setShowAuth(true)}
          />
        </>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

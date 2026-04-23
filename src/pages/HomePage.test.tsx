import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { HomePage } from './HomePage';
import { supabase } from '../lib/supabase';

// The chain object is thenable so both single and double .order() chains work
const makeChain = () => {
  const chain: Record<string, unknown> = {};
  chain.select = vi.fn(() => chain);
  chain.order = vi.fn(() => chain);
  chain.then = (resolve: (value: unknown) => unknown) =>
    Promise.resolve(resolve({ data: [], error: null }));
  return chain;
};

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => makeChain()),
  },
}));

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(
      <HomePage
        purchasedRoomIds={new Set()}
        onSelectRoom={vi.fn()}
      />
    );
  });

  it('shows a loading skeleton while rooms are being fetched', () => {
    const pendingChain: Record<string, unknown> = {};
    pendingChain.select = vi.fn(() => pendingChain);
    pendingChain.order = vi.fn(() => pendingChain);
    pendingChain.then = vi.fn(); // never resolves — loading state stays true
    (supabase.from as ReturnType<typeof vi.fn>).mockImplementationOnce(() => pendingChain);

    render(
      <HomePage
        purchasedRoomIds={new Set()}
        onSelectRoom={vi.fn()}
      />
    );

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders the search input', () => {
    render(
      <HomePage
        purchasedRoomIds={new Set()}
        onSelectRoom={vi.fn()}
      />
    );

    expect(document.querySelector('input[type="text"]')).toBeInTheDocument();
  });
});

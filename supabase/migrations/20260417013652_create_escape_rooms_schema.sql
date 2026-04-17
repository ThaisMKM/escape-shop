
/*
  # Escape Rooms App Schema

  ## Overview
  Creates the core data model for an escape room marketplace app.

  ## New Tables

  ### escape_rooms
  Stores the catalog of escape room experiences available for purchase.
  - id: unique identifier
  - title: name of the escape room
  - description: detailed description
  - short_description: brief teaser text
  - price: cost in USD (cents stored as integer)
  - difficulty: enum (easy, medium, hard, expert)
  - duration_minutes: how long the experience lasts
  - max_players: maximum number of players
  - theme: category/genre of the room
  - image_url: cover image URL
  - rating: average star rating (1-5)
  - review_count: number of reviews
  - is_featured: whether to highlight on homepage
  - created_at: timestamp

  ### user_purchases
  Tracks which escape rooms a user has purchased.
  - id: unique identifier
  - user_id: references auth.users
  - room_id: references escape_rooms
  - purchased_at: when the purchase occurred
  - price_paid: price at time of purchase (in cents)
  - UNIQUE constraint on (user_id, room_id) to prevent duplicate purchases

  ## Security
  - RLS enabled on both tables
  - escape_rooms: publicly readable, no writes from client
  - user_purchases: users can only read/insert their own purchases
*/

CREATE TABLE IF NOT EXISTS escape_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  short_description text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  duration_minutes integer NOT NULL DEFAULT 60,
  max_players integer NOT NULL DEFAULT 6,
  theme text NOT NULL,
  image_url text NOT NULL DEFAULT '',
  rating numeric(3,1) NOT NULL DEFAULT 0,
  review_count integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES escape_rooms(id) ON DELETE CASCADE,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  price_paid integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, room_id)
);

ALTER TABLE escape_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view escape rooms"
  ON escape_rooms FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can view their own purchases"
  ON user_purchases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
  ON user_purchases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

INSERT INTO escape_rooms (title, description, short_description, price, difficulty, duration_minutes, max_players, theme, image_url, rating, review_count, is_featured) VALUES
(
  'The Haunted Mansion',
  'You and your team have been trapped inside the infamous Blackwood Mansion, home to the cursed Blackwood family for centuries. Legend has it that those who enter after dark are never seen again. Strange noises echo through the halls, doors slam on their own, and shadows move where no one stands. Find the hidden artifact before midnight strikes or become part of the mansion''s dark history forever.',
  'Escape the cursed Blackwood Mansion before midnight claims your soul.',
  2499,
  'medium',
  75,
  8,
  'Horror',
  'https://images.pexels.com/photos/1831234/pexels-photo-1831234.jpeg',
  4.8,
  312,
  true
),
(
  'Deep Space Odyssey',
  'Your crew has been stranded aboard the derelict space station Elysium-9, drifting in the outer reaches of the solar system. Life support is failing, communication arrays are down, and a mysterious alien signal is jamming your escape pods. Solve the alien technology puzzles, restore power to the station, and launch before the reactor goes critical in 60 minutes.',
  'Repair the failing space station before the reactor melts down.',
  2999,
  'hard',
  60,
  6,
  'Sci-Fi',
  'https://images.pexels.com/photos/1341279/pexels-photo-1341279.jpeg',
  4.9,
  478,
  true
),
(
  'The Da Vinci Secret',
  'Inside the Louvre''s hidden archives lies a secret Leonardo Da Vinci buried for 500 years — a discovery so profound it would reshape history. You''ve been given private access to his encrypted journals. Decode the Renaissance master''s ciphers, follow the clues hidden in his paintings, and uncover the truth before the Vatican''s agents arrive to destroy the evidence.',
  'Decode Da Vinci''s 500-year-old secret hidden in the Louvre.',
  1999,
  'easy',
  60,
  6,
  'Mystery',
  'https://images.pexels.com/photos/2570063/pexels-photo-2570063.jpeg',
  4.6,
  215,
  false
),
(
  'Pirate''s Plunder',
  'The legendary treasure of Captain Redbeard — stolen gold, jewels, and ancient artifacts — lies hidden somewhere in this weathered Caribbean fortress. You''ve discovered the captain''s coded map and secret compartments. Solve the nautical puzzles, crack the Jolly Roger cipher, and claim the treasure before the tide rises and floods the lower chambers.',
  'Find Captain Redbeard''s legendary treasure before the tide rises.',
  1799,
  'easy',
  55,
  10,
  'Adventure',
  'https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg',
  4.4,
  189,
  false
),
(
  'The Alchemist''s Workshop',
  'The eccentric alchemist Cornelius Voss has vanished, leaving behind his workshop filled with bubbling potions, cryptic formulas, and half-finished experiments. Among his notes is evidence of a world-changing discovery — and someone wants it destroyed. Piece together his research, complete the final formula, and escape before his enemies arrive to burn everything.',
  'Complete the missing formula before the alchemist''s enemies arrive.',
  2299,
  'medium',
  70,
  6,
  'Fantasy',
  'https://images.pexels.com/photos/3825578/pexels-photo-3825578.jpeg',
  4.7,
  267,
  true
),
(
  'Nuclear Countdown',
  'A rogue operative has armed a suitcase nuclear device hidden somewhere in the city. You''re the elite disposal team, called in when conventional methods fail. The bomb''s timer is running. The schematics are encrypted. The operative left a trail of impossible puzzles leading to the disarm sequence. Every second counts. No pressure.',
  'Disarm the nuclear device before the countdown reaches zero.',
  3499,
  'expert',
  45,
  4,
  'Thriller',
  'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
  4.9,
  134,
  true
),
(
  'Egyptian Tomb',
  'Deep beneath the Egyptian desert, archaeologists have uncovered the sealed tomb of Pharaoh Amenhotep IV — untouched for 3,000 years. You''ve been granted exclusive access for one hour before the site is sealed permanently. But ancient traps protect the inner chamber, hieroglyphic puzzles guard the sarcophagus, and the curse written on the walls may be more than superstition.',
  'Explore the ancient tomb and escape the pharaoh''s curse.',
  2199,
  'medium',
  65,
  8,
  'Historical',
  'https://images.pexels.com/photos/3522880/pexels-photo-3522880.jpeg',
  4.5,
  298,
  false
),
(
  'The Submarine',
  'Your submarine has been struck by an unknown force and is sinking fast. Emergency systems are offline, the navigation computer is corrupted, and water is beginning to fill the lower compartments. Your crew must work together to restore propulsion, patch the hull, and surface before you sink beyond rescue depth. Teamwork isn''t optional — it''s survival.',
  'Restore power to the sinking submarine before it''s too late.',
  2799,
  'hard',
  60,
  6,
  'Thriller',
  'https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg',
  4.8,
  201,
  false
);

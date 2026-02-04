-- IMPORTANT: Select all text below and run together

DROP TABLE IF EXISTS licenses;
DROP TABLE IF EXISTS beats;
DROP TABLE IF EXISTS profiles;

CREATE TABLE profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE TABLE beats (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  bpm integer,
  key text,
  genre text,
  price decimal not null,
  exclusive_price decimal,
  audio_url text not null,
  cover_url text,
  is_exclusive boolean default false,
  status text default 'active',
  producer_id uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

CREATE TABLE licenses (
  id uuid default gen_random_uuid() primary key,
  beat_id uuid references beats(id),
  user_id uuid references profiles(id),
  license_type text not null,
  price_paid decimal,
  transaction_id text,
  download_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE beats ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Add sample beats
INSERT INTO beats (title, bpm, key, genre, price, exclusive_price, audio_url, cover_url, is_exclusive, status) VALUES
('Night Drive', 140, 'Cm', 'Trap', 29.99, 299.99, 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours_En_Version_Originale/01_-_Sense_Ayou/Tours_-_01_-_Sense_Ayou.mp3', 'https://picsum.photos/400/400', false, 'active'),
('Summer Vibes', 100, 'G', 'Pop', 24.99, 249.99, 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/KieLoKaz_-_Free_Ganymed/01_-_Reunion_of_the_Spirits/KieLoKaz_-_01_-_Reunion_of_the_Spirits.mp3', 'https://picsum.photos/401/401', false, 'active'),
('Dark Knight', 95, 'Bm', 'Hip Hop', 34.99, 349.99, 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Dee_Yan-Kee/Yellow_Dog/Dee_Yan-Kee_-_01_-_Yellow_Dog.mp3', 'https://picsum.photos/402/402', false, 'active');

-- Verify
SELECT * FROM beats;

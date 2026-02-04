-- Sample beats data for testing
-- Run this in Supabase SQL Editor

INSERT INTO beats (title, bpm, key, genre, price, exclusive_price, audio_url, cover_url, is_exclusive, status, producer_id) VALUES
('Night Drive', 140, 'Cm', 'Trap', 29.99, 299.99, 'https://example.com/beats/night-drive.mp3', 'https://example.com/covers/night-drive.jpg', false, 'active', '00000000-0000-0000-0000-000000000000'),
('Summer Vibes', 100, 'G', 'Pop', 24.99, 249.99, 'https://example.com/beats/summer-vibes.mp3', 'https://example.com/covers/summer-vibes.jpg', false, 'active', '00000000-0000-0000-0000-000000000000'),
('Dark Knight', 95, 'Bm', 'Hip Hop', 34.99, 349.99, 'https://example.com/beats/dark-knight.mp3', 'https://example.com/covers/dark-knight.jpg', false, 'active', '00000000-0000-0000-0000-000000000000'),
('Energy Boost', 128, 'Am', 'EDM', 29.99, 299.99, 'https://example.com/beats/energy-boost.mp3', 'https://example.com/covers/energy-boost.jpg', false, 'active', '00000000-0000-0000-0000-000000000000'),
('Lofi Dreams', 85, 'Fm', 'Lofi', 19.99, 199.99, 'https://example.com/beats/lofi-dreams.mp3', 'https://example.com/covers/lofi-dreams.jpg', false, 'active', '00000000-0000-0000-0000-000000000000'),
('Street Flow', 92, 'Eb', 'Hip Hop', 29.99, 299.99, 'https://example.com/beats/street-flow.mp3', 'https://example.com/covers/street-flow.jpg', false, 'active', '00000000-0000-0000-0000-000000000000');

-- Note: Replace '00000000-0000-0000-0000-000000000000' with your actual user ID after creating an account
-- Replace audio_url and cover_url with actual file URLs from Supabase Storage

/*
-- To create a sample producer profile, run after signing up:
INSERT INTO profiles (id, email, full_name, avatar_url)
SELECT 
  auth.users.id,
  auth.users.email,
  auth.users.raw_user_meta_data->>'full_name',
  auth.users.raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE auth.users.email = 'your-email@example.com';
*/

DELETE FROM beats;

INSERT INTO beats (title, bpm, key, genre, price, exclusive_price, audio_url, cover_url, is_exclusive, status) VALUES
('Night Drive', 140, 'Cm', 'Trap', 29.99, 299.99, 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_0c2b1c7358.mp3', 'https://picsum.photos/seed/beat1/400/400', false, 'active'),
('Summer Vibes', 100, 'G', 'Pop', 24.99, 249.99, 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d0.mp3', 'https://picsum.photos/seed/beat2/400/400', false, 'active'),
('Dark Knight', 95, 'Bm', 'Hip Hop', 34.99, 349.99, 'https://cdn.pixabay.com/download/audio/2022/02/07/audio_12c4c509d3.mp3', 'https://picsum.photos/seed/beat3/400/400', false, 'active');

SELECT * FROM beats;

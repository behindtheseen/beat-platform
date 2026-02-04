-- Run this FIRST to create all tables
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table beats (
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

create table licenses (
  id uuid default gen_random_uuid() primary key,
  beat_id uuid references beats(id),
  user_id uuid references profiles(id),
  license_type text not null,
  price_paid decimal,
  transaction_id text,
  download_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table profiles enable row level security;
alter table beats enable row level security;
alter table licenses enable row level security;

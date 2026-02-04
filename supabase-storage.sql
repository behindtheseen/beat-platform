-- Storage Setup SQL for Supabase
-- Run this in SQL Editor to create storage buckets for beats and covers

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('beats', 'beats', true);
insert into storage.buckets (id, name, public) values ('covers', 'covers', true);

-- Set up storage policies for beats
create policy "Allow public access to beats"
on storage.objects for select
using ( bucket_id = 'beats' );

create policy "Allow authenticated users to upload beats"
on storage.objects for insert
with check ( bucket_id = 'beats' and auth.role() = 'authenticated' );

create policy "Allow owners to delete their beats"
on storage.objects for delete
using ( bucket_id = 'beats' and auth.uid() = owner );

-- Set up storage policies for covers
create policy "Allow public access to covers"
on storage.objects for select
using ( bucket_id = 'covers' );

create policy "Allow authenticated users to upload covers"
on storage.objects for insert
with check ( bucket_id = 'covers' and auth.role() = 'authenticated' );

create policy "Allow owners to delete their covers"
on storage.objects for delete
using ( bucket_id = 'covers' and auth.uid() = owner );

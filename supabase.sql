-- Run this in Supabase -> SQL Editor -> New query

create table if not exists public.messages (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(name) between 1 and 80),
  email      text not null check (char_length(email) between 3 and 120),
  message    text not null check (char_length(message) between 1 and 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id         bigint generated always as identity primary key,
  name       text not null check (char_length(name) between 1 and 60),
  text       text not null check (char_length(text) between 1 and 400),
  rating     int  not null check (rating between 1 and 5),
  approved   boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;
alter table public.reviews  enable row level security;

-- Visitors can only SEND a message (they cannot read anyone's messages)
create policy "anyone can send message"
  on public.messages for insert to anon
  with check (true);

-- Visitors can submit a review, but it stays hidden until you approve it
create policy "anyone can submit review"
  on public.reviews for insert to anon
  with check (approved = false);

-- Visitors can only read approved reviews
create policy "read approved reviews"
  on public.reviews for select to anon
  using (approved = true);

-- To approve a review: Table Editor -> reviews -> tick "approved" on the row.
-- To read messages: Table Editor -> messages (you are logged in as owner).

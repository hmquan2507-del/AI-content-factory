-- AI Content Factory Phase 3 demo schema.
-- Lưu ý production: khi có auth thật, thêm user_id và siết RLS policy theo user_id.

create extension if not exists "pgcrypto";

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  raw_idea text,
  selected_hook text,
  script_body text,
  visual_cues text,
  slides jsonb not null default '[]'::jsonb,
  caption text,
  hashtags text[] not null default '{}',
  cta text,
  platforms text[] not null default '{}',
  status text not null default 'draft',
  audio_url text,
  video_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_content_items_updated_at on public.content_items;

create trigger set_content_items_updated_at
before update on public.content_items
for each row
execute function public.set_updated_at();

alter table public.content_items enable row level security;

drop policy if exists "Allow public read content items" on public.content_items;
drop policy if exists "Allow public insert content items" on public.content_items;
drop policy if exists "Allow public update content items" on public.content_items;
drop policy if exists "Allow public delete content items" on public.content_items;

create policy "Allow public read content items"
on public.content_items for select
to anon
using (true);

create policy "Allow public insert content items"
on public.content_items for insert
to anon
with check (true);

create policy "Allow public update content items"
on public.content_items for update
to anon
using (true)
with check (true);

create policy "Allow public delete content items"
on public.content_items for delete
to anon
using (true);

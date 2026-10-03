create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_fr text not null,
  name_en text not null,
  category text not null check (category in ('Laptops','Phones','Monitors','Accessories')),
  brand text not null,
  price integer not null default 0,
  old_price integer,
  condition_fr text not null default 'Neuf',
  condition_en text not null default 'New',
  stock integer not null default 0,
  short_message_fr text not null default '',
  short_message_en text not null default '',
  description_fr text not null default '',
  description_en text not null default '',
  specs_fr jsonb not null default '[]'::jsonb,
  specs_en jsonb not null default '[]'::jsonb,
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products for select to anon, authenticated using (true);

drop policy if exists "Authenticated admins can insert products" on public.products;
create policy "Authenticated admins can insert products" on public.products for insert to authenticated with check (true);

drop policy if exists "Authenticated admins can update products" on public.products;
create policy "Authenticated admins can update products" on public.products for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated admins can delete products" on public.products;
create policy "Authenticated admins can delete products" on public.products for delete to authenticated using (true);

insert into storage.buckets (id,name,public) values ('products','products',true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images" on storage.objects for select to public using (bucket_id = 'products');

drop policy if exists "Authenticated admins can upload product images" on storage.objects;
create policy "Authenticated admins can upload product images" on storage.objects for insert to authenticated with check (bucket_id = 'products');

drop policy if exists "Authenticated admins can update product images" on storage.objects;
create policy "Authenticated admins can update product images" on storage.objects for update to authenticated using (bucket_id = 'products') with check (bucket_id = 'products');

drop policy if exists "Authenticated admins can delete product images" on storage.objects;
create policy "Authenticated admins can delete product images" on storage.objects for delete to authenticated using (bucket_id = 'products');

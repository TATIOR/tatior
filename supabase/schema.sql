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


insert into public.products
(slug,name_fr,name_en,category,brand,price,old_price,condition_fr,condition_en,stock,short_message_fr,short_message_en,description_fr,description_en,specs_fr,specs_en,images)
values
('elitebook-840-g5','EliteBook 840 G5','EliteBook 840 G5','Laptops','HP',195000,220000,'Reconditionné','Refurbished',2,'Ordinateur professionnel premium.','Premium business notebook.','Ordinateur professionnel premium au design sobre et élégant.','Premium business notebook with a clean professional design.','["Intel Core i5","8 Go RAM","256 Go SSD","14 pouces Full HD","Wi-Fi / Bluetooth"]','["Intel Core i5","8GB RAM","256GB SSD","14-inch Full HD","Wi-Fi / Bluetooth"]','["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=1000&q=85"]'),
('24-inch-monitor','Moniteur 24 pouces Full HD','24-inch Full HD Monitor','Monitors','TATIOR',85000,null,'Neuf','New',6,'Écran Full HD net pour le bureau et le trading.','Sharp Full HD display for office and trading.','Écran Full HD net pour le bureau, le contenu et le trading.','Sharp Full HD display for office work, content and trading.','["24 pouces","Full HD 1920×1080","HDMI / VGA","Format 16:9","60 Hz"]','["24 inch","Full HD 1920×1080","HDMI / VGA","16:9 display","60Hz"]','["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=85"]'),
('512gb-nvme','SSD NVMe 512 Go','512GB NVMe SSD','Accessories','Kingston',45000,null,'Neuf','New',8,'Mise à niveau rapide du stockage.','Fast storage upgrade.','Mise à niveau de stockage rapide pour ordinateurs compatibles.','Fast storage upgrade for compatible laptops and desktops.','["512 Go","NVMe","Haute vitesse","Interface PCIe","Garantie 5 ans"]','["512GB","NVMe","High speed","PCIe interface","5-year warranty"]','["https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1531492746076-161ca9b8e7c2?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1593642532744-d377ab507dc8?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=85"]'),
('iphone','iPhone','iPhone','Phones','Apple',0,null,'Disponible sur demande','Available on request',0,'Modèles iPhone disponibles sur demande.','iPhone models available on request.','Demandez à TATIOR les modèles iPhone et les prix disponibles.','Ask TATIOR for current iPhone models and prices.','["Plusieurs modèles","Options de garantie","Prix sur demande"]','["Multiple models","Warranty options","Price on request"]','["https://images.unsplash.com/photo-1592286927505-2fd0f17f2a6f?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=85"]'),
('android-phones','Téléphones Android','Android Phones','Phones','Various',0,null,'Disponible sur demande','Available on request',0,'Une sélection de smartphones Android.','A selection of Android smartphones.','Une sélection de smartphones Android disponible chez TATIOR.','A selection of Android smartphones available through TATIOR.','["Plusieurs marques","Plusieurs budgets","Prix sur demande"]','["Multiple brands","Multiple budgets","Price on request"]','["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=85","https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=85"]')
on conflict (slug) do nothing;

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

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Families table
create table public.families (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Family Members table
create table public.family_members (
  id uuid default uuid_generate_v4() primary key,
  family_id uuid references public.families(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  role text check (role in ('admin', 'member')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(family_id, user_id)
);

-- Categories table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  icon text,
  type text check (type in ('income', 'expense')) not null,
  is_default boolean default false,
  created_by uuid references public.users(id), -- null for default categories
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  family_id uuid references public.families(id) on delete set null,
  amount numeric not null,
  type text check (type in ('income', 'expense')) not null,
  category_id uuid references public.categories(id) on delete set null,
  date date default current_date not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Budgets table
create table public.budgets (
  id uuid default uuid_generate_v4() primary key,
  family_id uuid references public.families(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade, -- if personal budget
  amount numeric not null,
  month text not null, -- Format: YYYY-MM
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  check (family_id is not null or user_id is not null)
);

-- RLS Policies

-- Users
alter table public.users enable row level security;
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.users for update using (auth.uid() = id);

-- Families
alter table public.families enable row level security;
create policy "Users can view families they belong to" on public.families for select using (
  exists (select 1 from public.family_members where family_id = families.id and user_id = auth.uid())
);
create policy "Users can create families" on public.families for insert with check (auth.uid() = created_by);
create policy "Admins can update their families" on public.families for update using (
  exists (select 1 from public.family_members where family_id = families.id and user_id = auth.uid() and role = 'admin')
);

-- Family Members
alter table public.family_members enable row level security;
create policy "Users can view members of their families" on public.family_members for select using (
  exists (select 1 from public.family_members fm where fm.family_id = family_members.family_id and fm.user_id = auth.uid())
);
create policy "Admins can add members" on public.family_members for insert with check (
  exists (select 1 from public.family_members where family_id = family_members.family_id and user_id = auth.uid() and role = 'admin')
);

-- Categories
alter table public.categories enable row level security;
create policy "Users can view default categories and their own" on public.categories for select using (
  is_default = true or created_by = auth.uid()
);
create policy "Users can create their own categories" on public.categories for insert with check (auth.uid() = created_by);

-- Transactions
alter table public.transactions enable row level security;
create policy "Users can view their own transactions" on public.transactions for select using (auth.uid() = user_id);
create policy "Users can view family transactions" on public.transactions for select using (
  family_id is not null and exists (select 1 from public.family_members where family_id = transactions.family_id and user_id = auth.uid())
);
create policy "Users can create transactions" on public.transactions for insert with check (auth.uid() = user_id);
create policy "Users can update their own transactions" on public.transactions for update using (auth.uid() = user_id);
create policy "Users can delete their own transactions" on public.transactions for delete using (auth.uid() = user_id);

-- Budgets
alter table public.budgets enable row level security;
create policy "Users can view their own budgets" on public.budgets for select using (auth.uid() = user_id);
create policy "Users can view family budgets" on public.budgets for select using (
  family_id is not null and exists (select 1 from public.family_members where family_id = budgets.family_id and user_id = auth.uid())
);
create policy "Users can manage their own budgets" on public.budgets for all using (auth.uid() = user_id);
create policy "Family admins can manage family budgets" on public.budgets for all using (
  family_id is not null and exists (select 1 from public.family_members where family_id = budgets.family_id and user_id = auth.uid() and role = 'admin')
);

-- Functions to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert default categories
insert into public.categories (name, icon, type, is_default) values
('Salary', 'Wallet', 'income', true),
('Business', 'Briefcase', 'income', true),
('Gift', 'Gift', 'income', true),
('Food', 'Utensils', 'expense', true),
('Transport', 'Bus', 'expense', true),
('Shopping', 'ShoppingBag', 'expense', true),
('Bills', 'FileText', 'expense', true),
('Entertainment', 'Film', 'expense', true),
('Health', 'Heart', 'expense', true),
('Education', 'Book', 'expense', true),
('Others', 'MoreHorizontal', 'expense', true);

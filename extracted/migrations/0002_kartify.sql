-- Kartify Anime catalog, library, and admin schema.
-- Genres are text[] (AniList labels), not a join table: each title carries a
-- small set, filters use `= any(genres)`, and sync stays a single upsert.
-- episode_count is provider metadata only. It is not proof that episode rows
-- or authorized playback sources exist.
-- Authorization is enforced in server functions (the database is never exposed
-- to the browser). Per-user rows are always scoped by the verified user id.

create table if not exists profiles (
  id text primary key references "user" (id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'admin', 'suspended')),
  preferred_locale text not null default 'ar' check (preferred_locale in ('ar', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists anime (
  id text primary key,
  provider text not null,
  provider_id text not null,
  slug text not null unique,
  title text not null,
  title_ar text,
  original_title text,
  english_title text,
  synopsis text,
  synopsis_ar text,
  synopsis_origin text not null default 'provider' check (synopsis_origin in ('provider', 'admin', 'unverified')),
  poster_url text,
  banner_url text,
  poster_locked boolean not null default false,
  genres text[] not null default '{}',
  format text,
  release_year int,
  episode_count int,
  episode_duration_minutes int,
  airing_status text,
  season text,
  season_year int,
  rating int,
  rating_source text,
  popularity int,
  main_studio text,
  metadata_language text not null default 'en',
  data_origin text not null default 'provider' check (data_origin in ('provider', 'admin')),
  trending boolean not null default false,
  has_arabic_subs boolean,
  has_arabic_dub boolean,
  has_egyptian_dub boolean,
  related jsonb not null default '[]'::jsonb,
  provider_updated_at timestamptz,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_id)
);

create table if not exists seasons (
  id text primary key,
  anime_id text not null references anime (id) on delete cascade,
  season_number int not null,
  title text,
  synopsis text,
  origin text not null default 'provider' check (origin in ('provider', 'admin')),
  created_at timestamptz not null default now(),
  unique (anime_id, season_number)
);

create table if not exists episodes (
  id text primary key,
  anime_id text not null references anime (id) on delete cascade,
  season_id text references seasons (id) on delete set null,
  episode_number int not null,
  title text,
  synopsis text,
  thumbnail_url text,
  duration_seconds int,
  origin text not null default 'provider' check (origin in ('provider', 'admin', 'unverified')),
  created_at timestamptz not null default now(),
  unique (anime_id, episode_number)
);

create table if not exists streaming_sources (
  id text primary key,
  episode_id text not null references episodes (id) on delete cascade,
  provider_name text not null,
  source_type text not null check (source_type in ('mp4', 'hls', 'external')),
  playback_url text not null,
  language text,
  subtitles_language text,
  subtitle_url text,
  is_official boolean not null default false,
  authorization_verified boolean not null default false,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists external_watch_links (
  id text primary key,
  anime_id text not null references anime (id) on delete cascade,
  episode_id text references episodes (id) on delete cascade,
  site text not null,
  url text not null,
  title text,
  origin text not null default 'anilist' check (origin in ('anilist', 'admin')),
  confirmed_by_admin boolean not null default false,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  unique (anime_id, url)
);

create table if not exists favorites (
  user_id text not null references "user" (id) on delete cascade,
  anime_id text not null references anime (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, anime_id)
);

create table if not exists watchlist (
  user_id text not null references "user" (id) on delete cascade,
  anime_id text not null references anime (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, anime_id)
);

create table if not exists watch_progress (
  user_id text not null references "user" (id) on delete cascade,
  episode_id text not null references episodes (id) on delete cascade,
  progress_seconds int not null default 0 check (progress_seconds >= 0),
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);

create table if not exists admin_audit_logs (
  id text primary key,
  admin_user_id text not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists sync_runs (
  id text primary key,
  kind text not null,
  status text not null,
  success_count int not null default 0,
  failure_count int not null default 0,
  message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists app_settings (
  id int primary key default 1 check (id = 1),
  brand_name_ar text not null default 'كارتيفاي أنمي',
  brand_name_en text not null default 'KARTIFY ANIME',
  tagline_ar text not null default 'عالمك، قصتك، أنميك.',
  tagline_en text not null default 'Your world. Your story. Your anime.',
  default_locale text not null default 'ar' check (default_locale in ('ar', 'en')),
  sync_batch_size int not null default 20 check (sync_batch_size between 1 and 25),
  allowed_domains text[] not null default '{}',
  recommendations_enabled boolean not null default true,
  continue_watching_enabled boolean not null default true,
  bilingual_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into app_settings (id) values (1) on conflict (id) do nothing;

create table if not exists contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists anime_release_year_idx on anime (release_year);
create index if not exists anime_format_idx on anime (format);
create index if not exists anime_rating_idx on anime (rating desc);
create index if not exists anime_popularity_idx on anime (popularity desc);
create index if not exists anime_status_idx on anime (airing_status);
create index if not exists anime_season_idx on anime (season_year, season);
create index if not exists anime_trending_idx on anime (trending);
create index if not exists anime_provider_updated_idx on anime (provider_updated_at desc);
create index if not exists episodes_anime_idx on episodes (anime_id, episode_number);
create index if not exists sources_episode_idx on streaming_sources (episode_id);
create index if not exists watch_progress_user_idx on watch_progress (user_id, updated_at desc);
create index if not exists audit_created_idx on admin_audit_logs (created_at desc);
create index if not exists external_links_anime_idx on external_watch_links (anime_id);
create index if not exists favorites_user_idx on favorites (user_id, created_at desc);
create index if not exists watchlist_user_idx on watchlist (user_id, created_at desc);

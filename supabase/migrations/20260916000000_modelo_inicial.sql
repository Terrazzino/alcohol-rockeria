begin;

alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

create type public.estado_producto as enum ('ACTIVO', 'SIN_STOCK', 'OCULTO');

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null constraint categorias_nombre_no_vacio check (char_length(trim(nombre)) > 0),
  slug text not null constraint categorias_slug_valido check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  descripcion text,
  url_imagen text,
  orden integer not null default 0 constraint categorias_orden_no_negativo check (orden >= 0),
  esta_visible boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint categorias_slug_unico unique (slug)
);

create table public.bandas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null constraint bandas_nombre_no_vacio check (char_length(trim(nombre)) > 0),
  slug text not null constraint bandas_slug_valido check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  url_imagen text,
  descripcion text,
  orden integer not null default 0 constraint bandas_orden_no_negativo check (orden >= 0),
  esta_visible boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint bandas_slug_unico unique (slug)
);

create table public.productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null constraint productos_nombre_no_vacio check (char_length(trim(nombre)) > 0),
  slug text not null constraint productos_slug_valido check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  descripcion text not null constraint productos_descripcion_no_vacia check (char_length(trim(descripcion)) > 0),
  precio_base numeric(12, 2) not null constraint productos_precio_no_negativo check (precio_base >= 0),
  categoria_id uuid not null references public.categorias(id) on delete restrict,
  banda_id uuid references public.bandas(id) on delete set null,
  estado public.estado_producto not null default 'ACTIVO',
  destacado boolean not null default false,
  orden integer constraint productos_orden_no_negativo check (orden is null or orden >= 0),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint productos_slug_unico unique (slug)
);

create table public.imagenes_producto (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  ruta_storage text not null constraint imagenes_ruta_no_vacia check (char_length(trim(ruta_storage)) > 0),
  texto_alternativo text not null constraint imagenes_alt_no_vacio check (char_length(trim(texto_alternativo)) > 0),
  orden integer not null default 0 constraint imagenes_orden_no_negativo check (orden >= 0),
  es_principal boolean not null default false,
  creado_en timestamptz not null default now(),
  constraint imagenes_ruta_unica unique (ruta_storage)
);

create table public.variantes_producto (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  nombre text not null constraint variantes_nombre_no_vacio check (char_length(trim(nombre)) > 0),
  sku text constraint variantes_sku_no_vacio check (sku is null or char_length(trim(sku)) > 0),
  precio_especifico numeric(12, 2) constraint variantes_precio_no_negativo check (precio_especifico is null or precio_especifico >= 0),
  esta_disponible boolean not null default true,
  orden integer not null default 0 constraint variantes_orden_no_negativo check (orden >= 0),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

create table public.configuracion_tienda (
  id smallint primary key default 1 constraint configuracion_registro_unico check (id = 1),
  nombre_tienda text not null constraint configuracion_nombre_no_vacio check (char_length(trim(nombre_tienda)) > 0),
  titulo_principal text not null constraint configuracion_titulo_no_vacio check (char_length(trim(titulo_principal)) > 0),
  subtitulo_principal text not null,
  numero_whatsapp text not null constraint configuracion_whatsapp_no_vacio check (char_length(trim(numero_whatsapp)) > 0),
  url_instagram text not null,
  direccion text not null constraint configuracion_direccion_no_vacia check (char_length(trim(direccion)) > 0),
  url_maps text not null,
  horarios text not null constraint configuracion_horarios_no_vacios check (char_length(trim(horarios)) > 0),
  texto_historia text not null,
  texto_contacto text not null,
  actualizado_en timestamptz not null default now()
);

create table public.administradores (
  usuario_id uuid primary key references auth.users(id) on delete cascade,
  activo boolean not null default true,
  creado_en timestamptz not null default now()
);

create unique index imagenes_producto_una_principal
  on public.imagenes_producto (producto_id)
  where es_principal;

create unique index variantes_producto_sku_unico
  on public.variantes_producto (sku)
  where sku is not null;

create index productos_categoria_id_idx on public.productos (categoria_id);
create index productos_banda_id_idx on public.productos (banda_id);
create index productos_estado_idx on public.productos (estado);
create index imagenes_producto_producto_id_idx on public.imagenes_producto (producto_id);
create index variantes_producto_producto_id_idx on public.variantes_producto (producto_id);

create function public.establecer_actualizado_en()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$;

create trigger categorias_establecer_actualizado_en
before update on public.categorias
for each row execute function public.establecer_actualizado_en();

create trigger bandas_establecer_actualizado_en
before update on public.bandas
for each row execute function public.establecer_actualizado_en();

create trigger productos_establecer_actualizado_en
before update on public.productos
for each row execute function public.establecer_actualizado_en();

create trigger variantes_establecer_actualizado_en
before update on public.variantes_producto
for each row execute function public.establecer_actualizado_en();

create trigger configuracion_establecer_actualizado_en
before update on public.configuracion_tienda
for each row execute function public.establecer_actualizado_en();

revoke all on function public.establecer_actualizado_en() from public, anon, authenticated;

create function public.es_administrador()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.administradores
    where usuario_id = (select auth.uid())
      and activo
  );
$$;

revoke all on function public.es_administrador() from public;
grant execute on function public.es_administrador() to authenticated;

alter table public.categorias enable row level security;
alter table public.bandas enable row level security;
alter table public.productos enable row level security;
alter table public.imagenes_producto enable row level security;
alter table public.variantes_producto enable row level security;
alter table public.configuracion_tienda enable row level security;
alter table public.administradores enable row level security;

revoke all on table public.categorias from anon, authenticated;
revoke all on table public.bandas from anon, authenticated;
revoke all on table public.productos from anon, authenticated;
revoke all on table public.imagenes_producto from anon, authenticated;
revoke all on table public.variantes_producto from anon, authenticated;
revoke all on table public.configuracion_tienda from anon, authenticated;
revoke all on table public.administradores from anon, authenticated;

grant select on table public.categorias, public.bandas, public.productos,
  public.imagenes_producto, public.variantes_producto, public.configuracion_tienda
to anon;

grant select, insert, update, delete on table public.categorias, public.bandas,
  public.productos, public.imagenes_producto, public.variantes_producto,
  public.configuracion_tienda
to authenticated;

grant select on table public.administradores to authenticated;

create policy categorias_lectura_publica
on public.categorias for select
to anon, authenticated
using (esta_visible);

create policy bandas_lectura_publica
on public.bandas for select
to anon, authenticated
using (esta_visible);

create policy productos_lectura_publica
on public.productos for select
to anon, authenticated
using (
  estado <> 'OCULTO'
  and exists (
    select 1 from public.categorias
    where categorias.id = productos.categoria_id
      and categorias.esta_visible
  )
  and (
    banda_id is null
    or exists (
      select 1 from public.bandas
      where bandas.id = productos.banda_id
        and bandas.esta_visible
    )
  )
);

create policy imagenes_lectura_publica
on public.imagenes_producto for select
to anon, authenticated
using (
  exists (
    select 1 from public.productos
    where productos.id = imagenes_producto.producto_id
  )
);

create policy variantes_lectura_publica
on public.variantes_producto for select
to anon, authenticated
using (
  exists (
    select 1 from public.productos
    where productos.id = variantes_producto.producto_id
  )
);

create policy configuracion_lectura_publica
on public.configuracion_tienda for select
to anon, authenticated
using (true);

create policy administradores_lectura_propia
on public.administradores for select
to authenticated
using (usuario_id = (select auth.uid()) and activo);

create policy categorias_lectura_administrativa on public.categorias for select to authenticated using ((select public.es_administrador()));
create policy categorias_alta_administrativa on public.categorias for insert to authenticated with check ((select public.es_administrador()));
create policy categorias_edicion_administrativa on public.categorias for update to authenticated using ((select public.es_administrador())) with check ((select public.es_administrador()));
create policy categorias_baja_administrativa on public.categorias for delete to authenticated using ((select public.es_administrador()));

create policy bandas_lectura_administrativa on public.bandas for select to authenticated using ((select public.es_administrador()));
create policy bandas_alta_administrativa on public.bandas for insert to authenticated with check ((select public.es_administrador()));
create policy bandas_edicion_administrativa on public.bandas for update to authenticated using ((select public.es_administrador())) with check ((select public.es_administrador()));
create policy bandas_baja_administrativa on public.bandas for delete to authenticated using ((select public.es_administrador()));

create policy productos_lectura_administrativa on public.productos for select to authenticated using ((select public.es_administrador()));
create policy productos_alta_administrativa on public.productos for insert to authenticated with check ((select public.es_administrador()));
create policy productos_edicion_administrativa on public.productos for update to authenticated using ((select public.es_administrador())) with check ((select public.es_administrador()));
create policy productos_baja_administrativa on public.productos for delete to authenticated using ((select public.es_administrador()));

create policy imagenes_lectura_administrativa on public.imagenes_producto for select to authenticated using ((select public.es_administrador()));
create policy imagenes_alta_administrativa on public.imagenes_producto for insert to authenticated with check ((select public.es_administrador()));
create policy imagenes_edicion_administrativa on public.imagenes_producto for update to authenticated using ((select public.es_administrador())) with check ((select public.es_administrador()));
create policy imagenes_baja_administrativa on public.imagenes_producto for delete to authenticated using ((select public.es_administrador()));

create policy variantes_lectura_administrativa on public.variantes_producto for select to authenticated using ((select public.es_administrador()));
create policy variantes_alta_administrativa on public.variantes_producto for insert to authenticated with check ((select public.es_administrador()));
create policy variantes_edicion_administrativa on public.variantes_producto for update to authenticated using ((select public.es_administrador())) with check ((select public.es_administrador()));
create policy variantes_baja_administrativa on public.variantes_producto for delete to authenticated using ((select public.es_administrador()));

create policy configuracion_lectura_administrativa on public.configuracion_tienda for select to authenticated using ((select public.es_administrador()));
create policy configuracion_alta_administrativa on public.configuracion_tienda for insert to authenticated with check ((select public.es_administrador()));
create policy configuracion_edicion_administrativa on public.configuracion_tienda for update to authenticated using ((select public.es_administrador())) with check ((select public.es_administrador()));
create policy configuracion_baja_administrativa on public.configuracion_tienda for delete to authenticated using ((select public.es_administrador()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'imagenes-productos',
  'imagenes-productos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy imagenes_storage_alta_administrativa
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'imagenes-productos'
  and (select public.es_administrador())
);

create policy imagenes_storage_edicion_administrativa
on storage.objects for update
to authenticated
using (
  bucket_id = 'imagenes-productos'
  and (select public.es_administrador())
)
with check (
  bucket_id = 'imagenes-productos'
  and (select public.es_administrador())
);

create policy imagenes_storage_baja_administrativa
on storage.objects for delete
to authenticated
using (
  bucket_id = 'imagenes-productos'
  and (select public.es_administrador())
);

commit;

-- 1. EXTENSIONS & TYPES
CREATE TYPE user_role AS ENUM ('ADMIN', 'PRODUCER', 'MUSICIAN', 'MERCH_SELLER');
CREATE TYPE event_type AS ENUM ('Bar', 'Casamento', 'Prefeitura');
CREATE TYPE event_status AS ENUM ('Confirmado', 'Pendente', 'Cancelado');
CREATE TYPE transaction_type AS ENUM ('IN', 'OUT');
CREATE TYPE asset_type AS ENUM ('Kit VJ', 'Press Kit', 'Mapa de Palco');

-- 2. CORE TABLES (Tenancy)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#00f5ff',
  secondary_color TEXT DEFAULT '#bf00ff',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'MUSICIAN',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. DOMAIN TABLES
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type event_type NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  venue_name TEXT NOT NULL,
  city TEXT NOT NULL,
  status event_status DEFAULT 'Pendente',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  contractor_name TEXT NOT NULL,
  document_number TEXT,
  total_value NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_model TEXT,
  status TEXT DEFAULT 'Draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE logistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  timetable_json JSONB DEFAULT '[]'::jsonb,
  rooming_list_json JSONB DEFAULT '[]'::jsonb,
  transport_json JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE technical_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type asset_type NOT NULL,
  drive_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE financial_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'Concluido',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE merch_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE merch_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE merch_sales ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's tenant_id and role
CREATE OR REPLACE FUNCTION get_auth_user_data()
RETURNS TABLE (t_id UUID, u_role user_role) AS $$
  SELECT tenant_id, role FROM users WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- POLICIES

-- Users: Users can read their own profile and profiles in their tenant
CREATE POLICY users_isolation ON users
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- Events: Read-only for all members of the tenant, Edit for ADMIN/PRODUCER
CREATE POLICY events_isolation ON events
  FOR ALL USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY events_producer_admin_edit ON events
  FOR INSERT WITH CHECK (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()) AND
    (SELECT role FROM users WHERE id = auth.uid()) IN ('ADMIN', 'PRODUCER')
  );

-- Contracts: ADMIN/PRODUCER ONLY
CREATE POLICY contracts_access ON contracts
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()) AND
    (SELECT role FROM users WHERE id = auth.uid()) IN ('ADMIN', 'PRODUCER')
  );

-- Logistics: Read for all tenant members, Edit for ADMIN/PRODUCER
CREATE POLICY logistics_isolation ON logistics
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY logistics_edit ON logistics
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()) AND
    (SELECT role FROM users WHERE id = auth.uid()) IN ('ADMIN', 'PRODUCER')
  );

-- Financial Transactions: ADMIN ONLY
CREATE POLICY financial_access ON financial_transactions
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()) AND
    (SELECT role FROM users WHERE id = auth.uid()) IN ('ADMIN')
  );

-- Merch Inventory: Read for tenant, Edit for ADMIN/MERCH_SELLER
CREATE POLICY merch_inv_read ON merch_inventory
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY merch_inv_edit ON merch_inventory
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()) AND
    (SELECT role FROM users WHERE id = auth.uid()) IN ('ADMIN', 'MERCH_SELLER')
  );

-- Merch Sales: ADMIN/MERCH_SELLER ONLY
CREATE POLICY merch_sales_access ON merch_sales
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()) AND
    (SELECT role FROM users WHERE id = auth.uid()) IN ('ADMIN', 'MERCH_SELLER')
  );

-- Technical Assets: Read for tenant, Edit for ADMIN/PRODUCER
CREATE POLICY tech_assets_read ON technical_assets
  FOR SELECT USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

CREATE POLICY tech_assets_edit ON technical_assets
  FOR ALL USING (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()) AND
    (SELECT role FROM users WHERE id = auth.uid()) IN ('ADMIN', 'PRODUCER')
  );

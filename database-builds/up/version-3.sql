ALTER TABLE products ADD COLUMN image varchar(100);
ALTER TABLE cart_items ADD COLUMN discount numeric(10,2) NOT NULL default 0.00;
ALTER TABLE order_items ADD COLUMN discount numeric(10,2) NOT NULL default 0.00;

CREATE TABLE  coupons (
  id BIGSERIAL PRIMARY KEY,
  coupon_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  name varchar(100) UNIQUE NOT NULL,
  description  varchar(100),
  discount numeric(10,2) NOT NULL,
  expires_on timestamptz,
  applies_to varchar(100) NOT NULL DEFAULT 'order',
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER coupons_update_timestamp
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE cart_coupons (
  id BIGSERIAL PRIMARY KEY,
  cart_uuid UUID REFERENCES cart(cart_uuid),
  coupon_uuid UUID REFERENCES coupons(coupon_uuid),
  used BOOLEAN default false,
  applied BOOLEAN default false,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER cart_coupons_update_timestamp
  BEFORE UPDATE ON cart_coupons
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

ALTER TABLE users ADD COLUMN permission varchar(20) NOT NULL default 'guest' CHECK(permission ~'(guest)|(user)|(admin)');
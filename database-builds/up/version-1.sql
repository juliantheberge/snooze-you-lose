CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
	id BIGSERIAL PRIMARY KEY NOT NULL,
	user_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
	email varchar(100) UNIQUE NOT NULL CHECK (email ~ '^[A-Za-z0-9\._\$%\-]+@[A-Za-z0-9\-]+.[A-Za-z0-9]{2,6}$'),
	phone varchar(20) NOT NULL CHECK (phone ~ '^[0-9]+$'),
	password varchar(100) NOT NUll,
	name varchar(100) default 'USER' CHECK(name ~ '^([a-zA-Z]{1,15})( [a-zA-Z]{1,15})?([ -]?[a-zA-Z]{1,15})?$') NOT NULL
);

CREATE TABLE nonce (
  user_uuid UUID UNIQUE REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  nonce varchar(100),
  theTime timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE alarms (
	id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  title varchar(100) UNIQUE NOT NULL DEFAULT 'alarm' CHECK (title ~ '^[ 0-9a-zA-Z!@#$%^&*()_+]{1,15}$'),
  time time NOT NULL default '120000',
  thedate date NOT NULL DEFAULT now(),
	active boolean DEFAULT TRUE
);

CREATE FUNCTION set_updated_timestamp()
  RETURNS TRIGGER
  LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_timestamp := now();
  RETURN NEW;
END;
$$;

ALTER TABLE users ADD COLUMN create_timestamp timestamptz NOT NULL DEFAULT now()
ALTER TABLE users ADD COLUMN updated_timestamp timestamptz NOT NULL DEFAULT now();


CREATE TRIGGER alarms_on_update_timestamp
  BEFORE UPDATE ON alarms
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

ALTER TABLE nonce RENAME theTime TO created_timestamp;

ALTER TABLE alarms RENAME thedate TO created_timestamp;
ALTER TABLE alarms ADD COLUMN alarm_uuid UUID UNIQUE NOT NULL default uuid_generate_v4();
ALTER TABLE alarms ADD COLUMN alarm_id numeric default 1; -- must be updated via select and update on server
ALTER TABLE alarms ADD COLUMN updated_timestamp timestamptz NOT NULL DEFAULT now();


CREATE TRIGGER alarms_on_update_timestamp
  BEFORE UPDATE ON alarms
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TRIGGER payment_credit_update_timestamp
  BEFORE UPDATE ON payment_credit
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();


-- Master Card, Visa, Discover, American Express
CREATE TABLE payment_credit (
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE,
  card_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  card_number varchar(20) UNIQUE NOT NULL, -- will validate and encrypt on server lvl
  name varchar(100) NOT NULL CHECK(name ~ '^([a-zA-Z]{1,15})( [a-zA-Z]{1,15})?([ -]?[a-zA-Z]{1,15})?$'),
  exp_month varchar(20) NOT NULL CHECK (exp_month ~ '^[\d]{2}$'),
  exp_date varchar(20) NOT NULL CHECK (exp_date ~ '^[\d]{2}$'),
  cvv varchar(20) NOT NULL CHECK (cvv ~ '^[\d]{3,4}$'),
  address_1 varchar(100) NOT NULL CHECK (address_1 ~ '^[\da-zA-Z]{1,20}$'), -- could validate server level as well
  address_2 varchar(100) CHECK (address_2 ~ '^[\da-zA-Z]{1,20}$'),
  city varchar(20) NOT NULL CHECK (city ~ '^[\da-zA-Z]{1,20}$'),
  state varchar(20) NOT NULL CHECK (state ~ '^[A-Z]{2}'),
  zip varchar(20) NOT NULL CHECK (zip ~ '^\d{5}$'),
  active boolean default TRUE,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  product_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  product_id varchar(20) UNIQUE NOT NULL CHECK (product_id ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})'),
  universal_id varchar(20) NOT NULL CHECK (universal_id ~ '^[\d]{12}$'),  -- could be a lot better, probably validate server lvl too
  price numeric(10,2) NOT NULL,
  name varchar(100) NOT NULL UNIQUE CHECK (name ~ '^[A-Za-z\d ]{1,30}$'),
  description varchar(100) NOT NULL CHECK (name ~ '^[A-Za-z\d ]{1,99}$'),
  size varchar(20) NOT NULL CHECK (size ~ '^[sml]{1}$'),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, updated_timestamp)
);

CREATE TRIGGER products_update_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

-- this needs help, its not running at all
CREATE TABLE product_history (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  product_history_id UUID UNIQUE default uuid_generate_v4(),
  product_id varchar(20) NOT NULL CHECK (product_id ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})'),
  universal_id varchar(20) NOT NULL CHECK (universal_id ~ '^[\d]{12}$'),  -- could be a lot better, probably validate server lvl too
  price numeric(10,2) NOT NULL,
  name varchar(100) NOT NULL CHECK (name ~ '^[A-Za-z\d ]{1,30}$'),
  description varchar(100) NOT NULL CHECK (name ~ '^[A-Za-z\d ]{1,99}$'),
  size varchar(20) NOT NULL CHECK (size ~ '^[sml]{1}$'),
  updated_timestamp timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, updated_timestamp)
);

CREATE OR REPLACE FUNCTION function_copy() RETURNS TRIGGER AS
$BODY$
BEGIN
    INSERT INTO
        product_history(product_id, universal_id, updated_timestamp, price, name, description, size)
        VALUES(new.product_id,new.universal_id, new.updated_timestamp, new.price, new.name, new.description, new.size);
           RETURN new;
END;
$BODY$
language plpgsql;

CREATE TRIGGER trig_copy
    AFTER INSERT ON products
    FOR EACH ROW
    EXECUTE PROCEDURE function_copy();

CREATE TRIGGER trig_update
    AFTER UPDATE ON products
    FOR EACH ROW
    EXECUTE PROCEDURE function_copy();


CREATE TABLE cart (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  cart_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  card_number varchar(20) ON UPDATE CASCADE ON DELETE CASCADE, -- REFERENCES payment_credit(card_number) NEEDS TO BE ADDED
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER cart_update_timestamp
  BEFORE UPDATE ON cart
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();


CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  cart_uuid UUID REFERENCES cart(cart_uuid),
  cart_item_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  product_id varchar(20) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
  quantity numeric(10) NOT NULL default 1,
  product_history_id UUID REFERENCES product_history(product_history_id);
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER cart_items_update_timestamp
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID references users(user_uuid),
  order_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  card_number varchar(20) REFERENCES payment_credit(card_number) ON UPDATE CASCADE ON DELETE CASCADE,
  order_number numeric(10) NOT NULL default 1,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER orders_update_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  order_uuid UUID REFERENCES orders(order_uuid),
  order_item_uuid UUID NOT NULL default uuid_generate_v4(),
  product_id varchar(20) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE,
  quantity numeric(10) NOT NULL default 1,
  item_number numeric(10) NOT NULL default 1,
  product_history_id UUID default uuid_generate_v4(),
  UNIQUE (order_uuid, item_number),
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER order_items_update_timestamp
  BEFORE UPDATE ON order
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE session (
  user_uuid UUID REFERENCES users(user_uuid) ON DELETE CASCADE ON UPDATE CASCADE,
  sessionID varchar(100) NOT NULL UNIQUE,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER session_update_timestamp
  BEFORE UPDATE ON session
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

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

CREATE TABLE user_settings (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL UNIQUE REFERENCES users(user_uuid),
  payment_scheme varchar(50) NOT NULL default 'classic' CHECK (payment_scheme ~ '^[A-Za-z\d ]{1,30}$'),
  snooze_price numeric(10,2) NOT NULL default .50,
  dismiss_price numeric(10,2) NOT NULL default 3.00,
  wake_price numeric(10,2) NOT NULL default 0,
  month_max numeric(10,2) NOT NULL default 20.00,
  snooze_max numeric(10,2) NOT NULL default 6,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER user_settings_update_timestamp
  BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE orgs (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  org_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  org_sku varchar(20) UNIQUE NOT NULL, -- CHECK (org_sku ~ '([A-Z\d]{4})-([A-Z]{1})-([A-Z\d]{4})-([\d]{4})')
  name varchar(100) NOT NULL UNIQUE, --CHECK (name ~ '^[A-Za-z\d ]{1,30}$')
  description varchar(500) NOT NULL, --CHECK (description ~ '^[A-Za-z\d ]{1,500}$')
  cause varchar(50) NOT NULL, -- CHECK (cause ~ '^[A-Za-z\d ]{1,50}$')
  link varchar(100) NOT NULL default 'https://www.google.com',
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER orgs_update_timestamp
  BEFORE UPDATE ON orgs
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE user_orgs (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  org_uuid UUID NOT NULL REFERENCES orgs(org_uuid),
  active boolean default FALSE,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER user_orgs_timestamp
  BEFORE UPDATE ON user_orgs
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE snoozes (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  alarm_uuid UUID NOT NULL REFERENCES alarms(alarm_uuid),
  snooze_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  paid boolean default false,
  timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE dismisses (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  alarm_uuid UUID NOT NULL REFERENCES alarms(alarm_uuid),
  dismiss_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  paid boolean default false,
  timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE wakes (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  alarm_uuid UUID NOT NULL REFERENCES alarms(alarm_uuid),
  wake_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  paid boolean default false,
  timestamp timestamptz NOT NULL DEFAULT now()
);

alter table alarms add column state varchar(30) default 'pending';

ALTER TABLE alarms ADD COLUMN mon BOOLEAN DEFAULT false;
ALTER TABLE alarms ADD COLUMN tues BOOLEAN DEFAULT false;
ALTER TABLE alarms ADD COLUMN wed BOOLEAN DEFAULT false;
ALTER TABLE alarms ADD COLUMN thur BOOLEAN DEFAULT false;
ALTER TABLE alarms ADD COLUMN fri BOOLEAN DEFAULT false;
ALTER TABLE alarms ADD COLUMN sat BOOLEAN DEFAULT false;
ALTER TABLE alarms ADD COLUMN sun BOOLEAN DEFAULT false;
-- need somewhere to store price history per user


INSERT INTO orgs (org_sku, name, description, cause) VALUES ('UNIC-L-INTD-8168', 'United Nations Childrens Fund', 'UNICEF works in 190 countries and territories to save children’s lives, to defend their rights, and to help them fulfil their potential. And we never give up. UNICEF for every child.', 'international relief and development');
INSERT INTO orgs (org_sku, name, description, cause) VALUES ('MOMA-M-LIT0-6485', 'Museum of Modern Art', 'At The Museum of Modern Art and MoMA PS1, we celebrate creativity, openness, tolerance, and generosity. We aim to be inclusive places—both onsite and online—where diverse cultural, artistic, social, and political positions are welcome. We’re committed to sharing the most thought-provoking modern and contemporary art, and hope you will join us in exploring the art, ideas, and issues of our time.',
  'literacy');
INSERT INTO orgs (org_sku, name, description, cause) VALUES ('RNC0-M-POL0-8645', 'Republican National Committee', 'We believe that our: Country is exceptional, Constitution should be honored, valued, and upheld, Leaders should serve people, not special interests, Families and communities should be strong and free from government intrusion, Institution of traditional marriage is the foundation of society, Government should be smaller, smarter and more efficient, Health care decisions should be made by us and our doctors, Paychecks should not be wasted on poorly run government programs and more...', 'literacy');


ALTER TABLE alarms ADD COLUMN repeate BOOLEAN DEFAULT false;

ALTER TABLE payment_credit ADD COLUMN card_uuid UUID UNIQUE NOT NULL default uuid_generate_v4();
ALTER TABLE payment_credit DROP COLUMN active;

ALTER TABLE user_settings ADD COLUMN active_payment UUID REFERENCES payment_credit(card_uuid);

CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  trans_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  recipient UUID NOT NULL REFERENCES orgs(org_uuid),
  payment_uuid UUID NOT NULL REFERENCES payment_credit(card_uuid),
  snoozes numeric(10,2) NOT NULL,
  dismisses numeric(10,2) NOT NULL,
  wakes numeric(10,2) NOT NULL,
  total numeric(10,2) NOT NULL,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER transactions_update_timestamp
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE org_transactions (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  trans_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  recipient UUID NOT NULL REFERENCES orgs(org_uuid),
  org_trans_total numeric(10,2) NOT NULL,
  sent boolean NOT NULL default false,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER org_transactions_update_timestamp
  BEFORE UPDATE ON org_transactions
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

CREATE TABLE revenue (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  trans_uuid UUID UNIQUE NOT NULL default uuid_generate_v4(),
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  trans_revenue_total numeric(10,2) NOT NULL,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER revenue_update_timestamp
  BEFORE UPDATE ON revenue
  FOR EACH ROW EXECUTE
  PROCEDURE set_updated_timestamp();

ALTER TABLE alarms ADD COLUMN triggered boolean default FALSE;

-- reset transaction db changes
DELETE FROM org_transactions;
DELETE FROM revenue;
DELETE FROM transactions;
UPDATE snoozes SET paid = false;
UPDATE dismisses SET paid = false;
UPDATE wakes SET paid = false;

-- when users are deleted, they are also removed from user_settings which had a foreign key to user_uuid

ALTER TABLE user_settings DROP CONSTRAINT user_settings_user_uuid_fkey;
ALTER TABLE user_settings aaaaa FOREIGN KEY (user_uuid) REFERENCES users(user_uuid) ON DELETE CASCADE;

ALTER TABLE alarms DROP CONSTRAINT alarms_title_check;
ALTER TABLE alarms ADD CONSTRAINT alarms_title_check CHECK (title::text ~ '^[ 0-9a-zA-Z!@#$%^&*()_+]{0,25}$'::text);

ALTER TABLE alarms ALTER COLUMN title SET DEFAULT '';

ALTER TABLE alarms ALTER COLUMN title DROP NOT NULL;
ALTER TABLE alarms DROP CONSTRAINT alarms_title_key;


CREATE TABLE push_subs (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  user_uuid UUID NOT NULL REFERENCES users(user_uuid),
  p256dh varchar(300) NOT NULL,
  auth varchar(200) NOT NULL,
  expiration_time varchar(100) default null,
  endpoint varchar(300) NOT NULL,
  create_timestamp timestamptz NOT NULL DEFAULT now(),
  updated_timestamp timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE alarms ADD COLUMN archive BOOLEAN NOT NULL default false;

ALTER TABLE alarms DROP COLUMN triggered;
ALTER TABLE alarms ADD COLUMN snooze_tally numeric(10,2) NOT NULL DEFAULT 0;

ALTER TABLE user_settings ADD COLUMN queit_after numeric(10,2) NOT NULL DEFAULT 60; --60 seconds for production
ALTER TABLE user_settings ADD COLUMN snooze_length numeric(10,2) NOT NULL DEFAULT 30; --30 seconds for production

ALTER TABLE payment_credit ADD COLUMN active BOOLEAN default false;


-- no need to record this in settimngs, just query the payments table
alter table user_settings drop column active_payment;

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

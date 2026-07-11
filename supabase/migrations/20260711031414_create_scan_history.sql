/*
# Create scan_history table (single-tenant, no auth)

1. New Tables
- `scan_history`
  - `id` (uuid, primary key)
  - `email_subject` (text, the subject line of the analyzed email)
  - `email_sender` (text, the sender email address)
  - `email_body` (text, the body content of the analyzed email)
  - `spam_score` (numeric, 0-100 spam probability score)
  - `is_spam` (boolean, whether the email was classified as spam)
  - `risk_level` (text: 'low', 'medium', 'high', 'critical')
  - `flags` (jsonb, array of triggered spam indicators with descriptions)
  - `created_at` (timestamp, when the scan was performed)

2. Security
- Enable RLS on `scan_history`.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (no sign-in screen).
*/

CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_subject text,
  email_sender text,
  email_body text,
  spam_score numeric NOT NULL DEFAULT 0,
  is_spam boolean NOT NULL DEFAULT false,
  risk_level text NOT NULL DEFAULT 'low',
  flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_scan_history" ON scan_history;
CREATE POLICY "anon_select_scan_history" ON scan_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_scan_history" ON scan_history;
CREATE POLICY "anon_insert_scan_history" ON scan_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_scan_history" ON scan_history;
CREATE POLICY "anon_delete_scan_history" ON scan_history FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_scan_history_created_at ON scan_history (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_history_is_spam ON scan_history (is_spam);

-- Enable Row Level Security (RLS) on tables
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for items table
CREATE POLICY "Anyone can view items" ON items
FOR SELECT USING (true);

CREATE POLICY "Anyone can insert items" ON items
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own items" ON items
FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can delete their own items" ON items
FOR DELETE USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policies for contact_requests table
CREATE POLICY "Users can view their own contact requests" ON contact_requests
FOR SELECT USING (
  to_email = current_setting('request.jwt.claims', true)::json->>'email' OR
  from_email = current_setting('request.jwt.claims', true)::json->>'email'
);

CREATE POLICY "Anyone can insert contact requests" ON contact_requests
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own contact requests" ON contact_requests
FOR UPDATE USING (
  to_email = current_setting('request.jwt.claims', true)::json->>'email' OR
  from_email = current_setting('request.jwt.claims', true)::json->>'email'
);

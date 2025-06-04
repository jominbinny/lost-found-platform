-- Insert sample lost items
INSERT INTO items (type, name, email, item_name, category, description, location, date)
VALUES
  ('lost', 'John Smith', 'john@example.com', 'Blue Hydroflask Water Bottle', 'Water Bottle', 'Navy blue 32oz Hydroflask with a dent on the bottom and a sticker of a mountain on the side.', 'Science Building, Room 302', '2023-05-15T14:30:00Z'),
  ('lost', 'Emily Johnson', 'emily@example.com', 'MacBook Pro Charger', 'Electronics', 'White Apple MacBook Pro charger with my name written in black marker on the brick.', 'Library, 2nd floor study area', '2023-05-16T18:45:00Z'),
  ('lost', 'Michael Brown', 'michael@example.com', 'Student ID Card', 'ID Card', 'Student ID card with name Michael Brown, ID #12345678.', 'Student Center Cafeteria', '2023-05-17T12:15:00Z'),
  ('lost', 'Sarah Wilson', 'sarah@example.com', 'Black North Face Backpack', 'Bag/Backpack', 'Black North Face Surge backpack with a small tear on the front pocket. Contains textbooks and notebooks.', 'Parking Lot B', '2023-05-18T08:30:00Z'),
  ('lost', 'David Lee', 'david@example.com', 'Car Keys with Red Lanyard', 'Keys', 'Honda car keys with a red university lanyard and a small turtle keychain.', 'Gym locker room', '2023-05-18T16:20:00Z');

-- Insert sample found items
INSERT INTO items (type, name, email, item_name, category, description, location, date)
VALUES
  ('found', 'Jessica Martinez', 'jessica@example.com', 'Silver iPhone 13', 'Electronics', 'Silver iPhone 13 with a clear case. Screen is cracked in the bottom right corner. Found locked.', 'Engineering Building Hallway', '2023-05-15T17:10:00Z'),
  ('found', 'Robert Taylor', 'robert@example.com', 'Black Wallet', 'Wallet', 'Small black leather wallet containing some cash and cards. No ID inside.', 'Basketball Court', '2023-05-16T19:30:00Z'),
  ('found', 'Amanda Garcia', 'amanda@example.com', 'Textbook - Introduction to Psychology', 'Books', 'Introduction to Psychology textbook, 5th edition. Name "Alex" written inside the cover.', 'Classroom 105, Arts Building', '2023-05-17T15:45:00Z'),
  ('found', 'James Wilson', 'james@example.com', 'Blue Umbrella', 'Other', 'Collapsible blue umbrella with white polka dots.', 'Bus Stop outside Admin Building', '2023-05-18T09:15:00Z'),
  ('found', 'Sophia Chen', 'sophia@example.com', 'Gold Earring', 'Accessories', 'Single gold hoop earring with small pearl detail.', 'Women\'s Restroom, Student Center', '2023-05-18T14:50:00Z');

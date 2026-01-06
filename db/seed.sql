-- ================================================
-- DATABASE SEED SCRIPT
-- Event Management Platform - Basic Dataset
-- ================================================
-- This script creates the same data as db/seed.ts
-- Includes: 4 roles, 10 categories, 3 demo users
-- ================================================

-- STEP 1: Insert Roles
INSERT INTO roles (id, name, description) VALUES
  ('bnhxt8kmxy8r1akyuq1mbrvt', 'guest', 'Can browse events only'),
  ('ic3a4xkat1b8fm8mrw1wod2k', 'user', 'Can browse and register for events'),
  ('w47ift6viub6gfjju4lzxd7k', 'organizer', 'Can create and manage own events'),
  ('geq9fton2tvwjl2tdn4hffv8', 'admin', 'Full system access');

-- STEP 2: Insert Event Categories
INSERT INTO event_categories (id, name, description, created_at) VALUES
  ('q73j50w2qfbkkrddj9lmzqf8', 'Technology', 'Tech conferences, workshops, and meetups', strftime('%s', 'now')),
  ('gx9tqyn3rjdoynvtnlrdvpgs', 'Business', 'Business networking and professional development', strftime('%s', 'now')),
  ('byeto2rqvvy5snwfmxgykyu4', 'Arts & Culture', 'Art exhibitions, cultural events, and performances', strftime('%s', 'now')),
  ('yi19xawxp9l2cieipzf5w9e4', 'Sports & Fitness', 'Sports events, fitness classes, and outdoor activities', strftime('%s', 'now')),
  ('uzw5jdrptzi6f1jzg3f8mvu2', 'Music', 'Concerts, music festivals, and live performances', strftime('%s', 'now')),
  ('me79y9xqink4fclymqfpk8o3', 'Food & Drink', 'Food festivals, cooking classes, and tastings', strftime('%s', 'now')),
  ('b4a01a9vcco11yy62x93uirv', 'Education', 'Workshops, seminars, and educational events', strftime('%s', 'now')),
  ('pjjsk8vy3hlvhtwbe8ts2y93', 'Health & Wellness', 'Wellness workshops, yoga, and health seminars', strftime('%s', 'now')),
  ('omjp4xedssw2bg82fz3whjyo', 'Networking', 'Professional networking and community building', strftime('%s', 'now')),
  ('r8t5n1qx22hlamb287orcwxd', 'Entertainment', 'Comedy shows, theater, and entertainment events', strftime('%s', 'now'));

-- STEP 3: Insert Demo Users
-- Passwords: admin123, organizer123, user123 (respectively)
-- Hash format: bcrypt with 12 rounds

INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES
  ('h1j0nv1tc1wbpxlezhlc5xy0', 'Admin User', 'admin@example.com', '$2b$12$x3dyg2Zi2FcfBIegRYcWgejCbafCz6O7bscrvLnztIvegKpphpV.O', strftime('%s', 'now'), strftime('%s', 'now')),
  ('smcxz7ll1856kd21bwymoe1w', 'Organizer User', 'organizer@example.com', '$2b$12$8vf4T/ViIAX/xqltujzdGuuOTG/urC95xuLFUQer5oxutp1L1Jt3O', strftime('%s', 'now'), strftime('%s', 'now')),
  ('fhm3kkh84em4m4gsl5hfaxwg', 'Regular User', 'user@example.com', '$2b$12$kMDZbUpwc4yYM4RrkDStCeL.hZd3uWUbCjXWyigPyIurxvGs8yLHW', strftime('%s', 'now'), strftime('%s', 'now'));

-- STEP 4: Assign Roles to Users
INSERT INTO user_roles (user_id, role_id) VALUES
  -- Admin user gets admin role
  ('h1j0nv1tc1wbpxlezhlc5xy0', 'geq9fton2tvwjl2tdn4hffv8'),

  -- Organizer user gets organizer role
  ('smcxz7ll1856kd21bwymoe1w', 'w47ift6viub6gfjju4lzxd7k'),

  -- Regular user gets user role
  ('fhm3kkh84em4m4gsl5hfaxwg', 'ic3a4xkat1b8fm8mrw1wod2k');

-- STEP 5: Verification
SELECT '=== SEED VERIFICATION ===' as message;
SELECT 'Roles' as table_name, COUNT(*) as count FROM roles
UNION ALL
SELECT 'Event Categories', COUNT(*) FROM event_categories
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'User Roles', COUNT(*) FROM user_roles;

-- Display created users
SELECT '=== DEMO ACCOUNTS ===' as message;
SELECT name, email,
  (SELECT GROUP_CONCAT(r.name, ', ')
   FROM user_roles ur
   JOIN roles r ON ur.role_id = r.id
   WHERE ur.user_id = users.id) as roles
FROM users;
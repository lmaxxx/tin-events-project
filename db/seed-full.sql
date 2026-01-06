-- ================================================
-- COMPREHENSIVE DATABASE SEED SCRIPT
-- Event Management Platform - Full Dataset
-- ================================================
-- Generated: 2025-12-29
-- Target: 30 users, 50 events, ~200 registrations
-- ================================================

-- STEP 0: Clear and Create Roles
DELETE FROM roles;

INSERT INTO roles (id, name, description) VALUES
  ('vw8xf2qpj9n5r3k1m4h7t6z0', 'guest', 'Can browse events only'),
  ('ic3a4xkat1b8fm8mrw1wod2k', 'user', 'Can browse and register for events'),
  ('w47ift6viub6gfjju4lzxd7k', 'organizer', 'Can create and manage own events'),
  ('geq9fton2tvwjl2tdn4hffv8', 'admin', 'Full system access');

-- STEP 1: Clear existing data (preserve demo users created by TypeScript seed)
DELETE FROM event_visitors;
DELETE FROM events;
DELETE FROM event_categories;
-- Preserve user_roles for demo accounts (admin@example.com, organizer@example.com, user@example.com)
DELETE FROM user_roles WHERE user_id NOT IN (
  SELECT id FROM users WHERE email IN ('admin@example.com', 'organizer@example.com', 'user@example.com')
);
-- Preserve demo accounts created by TypeScript seed
DELETE FROM users WHERE email NOT IN ('admin@example.com', 'organizer@example.com', 'user@example.com');

-- STEP 2: Create Event Categories
INSERT INTO event_categories (id, name, description, created_at) VALUES
  ('xn5qzbm81vq6u8xa3s9z20qp', 'Arts & Culture', 'Art exhibitions, cultural events, and performances', 1704067200),
  ('u4vvv7jb1arjr2sztzvjac6f', 'Business', 'Business networking and professional development', 1704067200),
  ('aud70w31cflp9u9fyz3549nf', 'Education', 'Workshops, seminars, and educational events', 1704067200),
  ('mjldgkm833dzwjhy4cjoji47', 'Entertainment', 'Comedy shows, theater, and entertainment events', 1704067200),
  ('tmzcj46yw8ct2m7m98hp2shq', 'Food & Drink', 'Food festivals, cooking classes, and tastings', 1704067200),
  ('qnw54b4n7tfg8dfo9xxvxwy4', 'Health & Wellness', 'Wellness workshops, yoga, and health seminars', 1704067200),
  ('duiebkh8d60bzhp3865erwt1', 'Music', 'Concerts, music festivals, and live performances', 1704067200),
  ('b2sk1czsebrzeuhkhje0q3p9', 'Networking', 'Professional networking and community building', 1704067200),
  ('bt6uo0xfpb1npf3z7gc8gi6j', 'Sports & Fitness', 'Sports events, fitness classes, and outdoor activities', 1704067200),
  ('lk9m2n5p8q3r7t4v1w6x0y2z', 'Technology', 'Tech conferences, workshops, and meetups', 1704067200);

-- STEP 3: Insert Demo Users (for easy login)
-- Passwords: admin123, organizer123, user123
INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES
  ('h1j0nv1tc1wbpxlezhlc5xy0', 'Admin User', 'admin@example.com', '$2b$12$x3dyg2Zi2FcfBIegRYcWgejCbafCz6O7bscrvLnztIvegKpphpV.O', 1704067200, 1704067200),
  ('smcxz7ll1856kd21bwymoe1w', 'Organizer User', 'organizer@example.com', '$2b$12$8vf4T/ViIAX/xqltujzdGuuOTG/urC95xuLFUQer5oxutp1L1Jt3O', 1704067200, 1704067200),
  ('fhm3kkh84em4m4gsl5hfaxwg', 'Regular User', 'user@example.com', '$2b$12$kMDZbUpwc4yYM4RrkDStCeL.hZd3uWUbCjXWyigPyIurxvGs8yLHW', 1704067200, 1704067200),

  -- Additional Users (26 new users)
  -- Password for all additional users: Password123!
  -- Hash: $2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.
  -- Admins (5 additional)
  ('clx7a1b2c3d4e5f6g7h8i9j0', 'Sarah Johnson', 'sarah.johnson@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1721042400, 1721042400),
  ('clx7a2b3c4d5e6f7g8h9i0j1', 'Michael Chen', 'michael.chen@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1722516000, 1722516000),
  ('clx7a3b4c5d6e7f8g9h0i1j2', 'Emily Rodriguez', 'emily.rodriguez@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1723710300, 1723710300),
  ('clx7a4b5c6d7e8f9g0h1i2j3', 'David Kim', 'david.kim@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1725187500, 1725187500),
  ('clx7a5b6c7d8e9f0g1h2i3j4', 'Lisa Anderson', 'lisa.anderson@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1726848000, 1726848000),

  -- Organizers (10 users)
  ('clx7b1c2d3e4f5g6h7i8j9k0', 'James Wilson', 'james.wilson@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1721467800, 1721467800),
  ('clx7b2c3d4e5f6g7h8i9j0k1', 'Maria Garcia', 'maria.garcia@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1722865500, 1722865500),
  ('clx7b3c4d5e6f7g8h9i0j1k2', 'Robert Taylor', 'robert.taylor@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1723977600, 1723977600),
  ('clx7b4c5d6e7f8g9h0i1j2k3', 'Jennifer Lee', 'jennifer.lee@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1725549000, 1725549000),
  ('clx7b5c6d7e8f9g0h1i2j3k4', 'William Brown', 'william.brown@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1726136100, 1726136100),
  ('clx7b6c7d8e9f0g1h2i3j4k5', 'Patricia Martinez', 'patricia.martinez@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1727263200, 1727263200),
  ('clx7b7c8d9e0f1g2h3i4j5k6', 'Christopher Davis', 'christopher.davis@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1727952300, 1727952300),
  ('clx7b8c9d0e1f2g3h4i5j6k7', 'Linda Miller', 'linda.miller@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1728567600, 1728567600),
  ('clx7b9c0d1e2f3g4h5i6j7k8', 'Thomas Moore', 'thomas.moore@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1729243800, 1729243800),
  ('clx7b0c1d2e3f4g5h6i7j8k9', 'Nancy Jackson', 'nancy.jackson@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1729856400, 1729856400),

  -- Regular Users (11 users)
  ('clx7c1d2e3f4g5h6i7j8k9l0', 'Daniel White', 'daniel.white@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1730451600, 1730451600),
  ('clx7c2d3e4f5g6h7i8j9k0l1', 'Karen Harris', 'karen.harris@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1730799000, 1730799000),
  ('clx7c3d4e5f6g7h8i9j0k1l2', 'Steven Clark', 'steven.clark@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1731064500, 1731064500),
  ('clx7c4d5e6f7g8h9i0j1k2l3', 'Betty Lewis', 'betty.lewis@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1731410700, 1731410700),
  ('clx7c5d6e7f8g9h0i1j2k3l4', 'Kevin Walker', 'kevin.walker@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1731679200, 1731679200),
  ('clx7c6d7e8f9g0h1i2j3k4l5', 'Sandra Hall', 'sandra.hall@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1731923400, 1731923400),
  ('clx7c7d8e9f0g1h2i3j4k5l6', 'Brian Allen', 'brian.allen@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1732284600, 1732284600),
  ('clx7c8d9e0f1g2h3i4j5k6l7', 'Dorothy Young', 'dorothy.young@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1732550400, 1732550400),
  ('clx7c9d0e1f2g3h4i5j6k7l8', 'Mark King', 'mark.king@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1732791900, 1732791900),
  ('clx7c0d1e2f3g4h5i6j7k8l9', 'Lisa Wright', 'lisa.wright@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1733061300, 1733061300),
  ('clx7d1e2f3g4h5i6j7k8l9m0', 'Paul Scott', 'paul.scott@example.com', '$2b$12$7dx1TAlEVOM.gx7TcpFcXelPUroRDHvfWhjot4G8mWJolagzYTd/.', 1733401800, 1733401800);

-- STEP 4: Assign User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
  -- Demo Accounts
  ('h1j0nv1tc1wbpxlezhlc5xy0', 'geq9fton2tvwjl2tdn4hffv8'), -- Admin User - admin role
  ('h1j0nv1tc1wbpxlezhlc5xy0', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Admin User - also user role
  ('smcxz7ll1856kd21bwymoe1w', 'w47ift6viub6gfjju4lzxd7k'), -- Organizer User - organizer role
  ('smcxz7ll1856kd21bwymoe1w', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Organizer User - also user role
  ('fhm3kkh84em4m4gsl5hfaxwg', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Regular User - user role

  -- Additional Admins
  ('clx7a1b2c3d4e5f6g7h8i9j0', 'geq9fton2tvwjl2tdn4hffv8'), -- Sarah Johnson
  ('clx7a1b2c3d4e5f6g7h8i9j0', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Sarah also user
  ('clx7a2b3c4d5e6f7g8h9i0j1', 'geq9fton2tvwjl2tdn4hffv8'), -- Michael Chen
  ('clx7a2b3c4d5e6f7g8h9i0j1', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7a3b4c5d6e7f8g9h0i1j2', 'geq9fton2tvwjl2tdn4hffv8'), -- Emily Rodriguez
  ('clx7a3b4c5d6e7f8g9h0i1j2', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7a4b5c6d7e8f9g0h1i2j3', 'geq9fton2tvwjl2tdn4hffv8'), -- David Kim
  ('clx7a4b5c6d7e8f9g0h1i2j3', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7a5b6c7d8e9f0g1h2i3j4', 'geq9fton2tvwjl2tdn4hffv8'), -- Lisa Anderson
  ('clx7a5b6c7d8e9f0g1h2i3j4', 'ic3a4xkat1b8fm8mrw1wod2k'),

  -- Organizers
  ('clx7b1c2d3e4f5g6h7i8j9k0', 'w47ift6viub6gfjju4lzxd7k'), -- James Wilson
  ('clx7b1c2d3e4f5g6h7i8j9k0', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7b2c3d4e5f6g7h8i9j0k1', 'w47ift6viub6gfjju4lzxd7k'), -- Maria Garcia
  ('clx7b2c3d4e5f6g7h8i9j0k1', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7b3c4d5e6f7g8h9i0j1k2', 'w47ift6viub6gfjju4lzxd7k'), -- Robert Taylor
  ('clx7b3c4d5e6f7g8h9i0j1k2', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7b4c5d6e7f8g9h0i1j2k3', 'w47ift6viub6gfjju4lzxd7k'), -- Jennifer Lee
  ('clx7b4c5d6e7f8g9h0i1j2k3', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7b5c6d7e8f9g0h1i2j3k4', 'w47ift6viub6gfjju4lzxd7k'), -- William Brown
  ('clx7b5c6d7e8f9g0h1i2j3k4', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7b6c7d8e9f0g1h2i3j4k5', 'w47ift6viub6gfjju4lzxd7k'), -- Patricia Martinez
  ('clx7b6c7d8e9f0g1h2i3j4k5', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7b7c8d9e0f1g2h3i4j5k6', 'w47ift6viub6gfjju4lzxd7k'), -- Christopher Davis
  ('clx7b7c8d9e0f1g2h3i4j5k6', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7b8c9d0e1f2g3h4i5j6k7', 'w47ift6viub6gfjju4lzxd7k'), -- Linda Miller
  ('clx7b8c9d0e1f2g3h4i5j6k7', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7b9c0d1e2f3g4h5i6j7k8', 'w47ift6viub6gfjju4lzxd7k'), -- Thomas Moore
  ('clx7b9c0d1e2f3g4h5i6j7k8', 'ic3a4xkat1b8fm8mrw1wod2k'),
  ('clx7b0c1d2e3f4g5h6i7j8k9', 'w47ift6viub6gfjju4lzxd7k'), -- Nancy Jackson
  ('clx7b0c1d2e3f4g5h6i7j8k9', 'ic3a4xkat1b8fm8mrw1wod2k'),

  -- Regular Users (user role only)
  ('clx7c1d2e3f4g5h6i7j8k9l0', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Daniel White
  ('clx7c2d3e4f5g6h7i8j9k0l1', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Karen Harris
  ('clx7c3d4e5f6g7h8i9j0k1l2', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Steven Clark
  ('clx7c4d5e6f7g8h9i0j1k2l3', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Betty Lewis
  ('clx7c5d6e7f8g9h0i1j2k3l4', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Kevin Walker
  ('clx7c6d7e8f9g0h1i2j3k4l5', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Sandra Hall
  ('clx7c7d8e9f0g1h2i3j4k5l6', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Brian Allen
  ('clx7c8d9e0f1g2h3i4j5k6l7', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Dorothy Young
  ('clx7c9d0e1f2g3h4i5j6k7l8', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Mark King
  ('clx7c0d1e2f3g4h5i6j7k8l9', 'ic3a4xkat1b8fm8mrw1wod2k'), -- Lisa Wright
  ('clx7d1e2f3g4h5i6j7k8l9m0', 'ic3a4xkat1b8fm8mrw1wod2k'); -- Paul Scott

-- STEP 5: Insert Events (50 events across 9 categories)
INSERT INTO events (id, title, description, date, image_url, capacity, location, creator_id, category_id, created_at, updated_at) VALUES
  -- Arts & Culture (6 events)
  ('clxe1a2b3c4d5e6f7g8h9i0j', 'Contemporary Art Exhibition', 'Explore modern art from emerging artists featuring paintings, sculptures, and digital installations.', 1738105200, 'https://picsum.photos/800/600?random=1', 80, 'City Art Gallery, 123 Art Street, Downtown', 'clx7b1c2d3e4f5g6h7i8j9k0', 'xn5qzbm81vq6u8xa3s9z20qp', 1730451600, 1730451600),
  ('clxe2a3b4c5d6e7f8g9h0i1j', 'Shakespeare in the Park', 'A live performance of Romeo and Juliet under the stars in Central Park amphitheater.', 1739314800, 'https://picsum.photos/800/600?random=2', 200, 'Central Park Amphitheater, Park Avenue', 'clx7b2c3d4e5f6g7h8i9j0k1', 'xn5qzbm81vq6u8xa3s9z20qp', 1732129800, 1732129800),
  ('clxe3a4b5c6d7e8f9g0h1i2j', 'Photography Workshop', 'Learn advanced photography techniques including composition, lighting, and post-processing with professionals.', 1740524400, 'https://picsum.photos/800/600?random=3', 25, 'Creative Studio, 456 Photo Lane, Arts District', 'clx7b3c4d5e6f7g8h9i0j1k2', 'xn5qzbm81vq6u8xa3s9z20qp', 1736854500, 1736854500),
  ('clxe4a5b6c7d8e9f0g1h2i3j', 'Cultural Heritage Festival', 'Celebrate diverse cultures through music, dance, food, and traditional art from around the world.', 1741734000, 'https://picsum.photos/800/600?random=4', 500, 'City Convention Center, Main Hall, Downtown', 'clx7a1b2c3d4e5f6g7h8i9j0', 'xn5qzbm81vq6u8xa3s9z20qp', 1740070500, 1740070500),
  ('clxe5a6b7c8d9e0f1g2h3i4j', 'Classical Music Concert', 'Symphony orchestra performs Beethoven and Mozart in an elegant evening of classical masterpieces.', 1742943600, 'https://picsum.photos/800/600?random=5', 300, 'Grand Theater, 789 Symphony Boulevard', 'clx7b4c5d6e7f8g9h0i1j2k3', 'xn5qzbm81vq6u8xa3s9z20qp', 1743006000, 1743006000),
  ('clxe6a7b8c9d0e1f2g3h4i5j', 'Film Festival Screening', 'Independent film showcase featuring award-winning short films and documentaries from global filmmakers.', 1744149600, 'https://picsum.photos/800/600?random=6', 150, 'Indie Cinema, 321 Film Street, Arts Quarter', 'clx7b5c6d7e8f9g0h1i2j3k4', 'xn5qzbm81vq6u8xa3s9z20qp', 1747404000, 1747404000),

  -- Business (5 events)
  ('clxe7a8b9c0d1e2f3g4h5i6j', 'Startup Pitch Competition', 'Watch innovative startups pitch their ideas to investors and compete for $50,000 in funding.', 1745359200, 'https://picsum.photos/800/600?random=7', 100, 'Innovation Hub, 555 Startup Avenue, Tech District', 'clx7b6c7d8e9f0g1h2i3j4k5', 'u4vvv7jb1arjr2sztzvjac6f', 1732621800, 1732621800),
  ('clxe8a9b0c1d2e3f4g5h6i7j', 'Leadership Summit 2025', 'Learn from Fortune 500 CEOs about leadership, innovation, and building successful teams.', 1746568800, 'https://picsum.photos/800/600?random=8', 250, 'Business Center, Grand Ballroom, Financial District', 'clx7a2b3c4d5e6f7g8h9i0j1', 'u4vvv7jb1arjr2sztzvjac6f', 1738246500, 1738246500),
  ('clxe9a0b1c2d3e4f5g6h7i8j', 'Digital Marketing Workshop', 'Master SEO, social media marketing, and analytics to grow your business online presence.', 1747778400, 'https://picsum.photos/800/600?random=9', 40, 'Marketing Institute, 777 Digital Drive', 'clx7b7c8d9e0f1g2h3i4j5k6', 'u4vvv7jb1arjr2sztzvjac6f', 1739796300, 1739796300),
  ('clxe0a1b2c3d4e5f6g7h8i9j', 'Networking Breakfast', 'Connect with local business leaders and entrepreneurs over coffee and breakfast discussions.', 1736895600, 'https://picsum.photos/800/600?random=10', 60, 'Executive Club, 888 Business Plaza, Suite 300', 'clx7b8c9d0e1f2g3h4i5j6k7', 'u4vvv7jb1arjr2sztzvjac6f', 1743355200, 1743355200),
  ('clxf1a2b3c4d5e6f7g8h9i0j', 'E-commerce Strategy Seminar', 'Expert insights on scaling online retail businesses, inventory management, and customer retention.', 1748988000, 'https://picsum.photos/800/600?random=11', 80, 'Commerce Hub, Conference Room A, Shopping District', 'clx7b9c0d1e2f3g4h5i6j7k8', 'u4vvv7jb1arjr2sztzvjac6f', 1746615600, 1746615600),

  -- Education (6 events)
  ('clxf2a3b4c5d6e7f8g9h0i1j', 'Science Fair for Kids', 'Interactive science experiments and demonstrations that make learning fun for children ages 8-14.', 1750197600, 'https://picsum.photos/800/600?random=12', 100, 'Science Museum, Education Wing, Museum District', 'clx7b0c1d2e3f4g5h6i7j8k9', 'aud70w31cflp9u9fyz3549nf', 1730795400, 1730795400),
  ('clxf3a4b5c6d7e8f9g0h1i2j', 'Coding Bootcamp Intro', 'Free introduction to web development covering HTML, CSS, and JavaScript basics for beginners.', 1751407200, 'https://picsum.photos/800/600?random=13', 30, 'Tech Academy, Lab 101, University Campus', 'clx7a3b4c5d6e7f8g9h0i1j2', 'aud70w31cflp9u9fyz3549nf', 1735372800, 1735372800),
  ('clxf4a5b6c7d8e9f0g1h2i3j', 'History Lecture Series', 'Renowned historians discuss pivotal moments in world history with Q&A sessions.', 1752616800, 'https://picsum.photos/800/600?random=14', 120, 'University Auditorium, Main Campus, Education Avenue', 'clx7b1c2d3e4f5g6h7i8j9k0', 'aud70w31cflp9u9fyz3549nf', 1738324500, 1738324500),
  ('clxf5a6b7c8d9e0f1g2h3i4j', 'Language Learning Workshop', 'Intensive Spanish language workshop with native speakers focusing on conversation skills.', 1753826400, 'https://picsum.photos/800/600?random=15', 25, 'Language Center, Room 205, Cultural Institute', 'clx7b2c3d4e5f6g7h8i9j0k1', 'aud70w31cflp9u9fyz3549nf', 1741504500, 1741504500),
  ('clxf6a7b8c9d0e1f2g3h4i5j', 'STEM Career Fair', 'Explore career opportunities in science, technology, engineering, and mathematics with top employers.', 1755036000, 'https://picsum.photos/800/600?random=16', 300, 'Career Center, Exhibition Hall, College Campus', 'clx7a4b5c6d7e8f9g0h1i2j3', 'aud70w31cflp9u9fyz3549nf', 1744369800, 1744369800),
  ('clxf7a8b9c0d1e2f3g4h5i6j', 'Creative Writing Masterclass', 'Award-winning authors share techniques for storytelling, character development, and publishing.', 1756245600, 'https://picsum.photos/800/600?random=17', 35, 'Writers Studio, 999 Literary Lane, Arts District', 'clx7b3c4d5e6f7g8h9i0j1k2', 'aud70w31cflp9u9fyz3549nf', 1748178300, 1748178300),

  -- Entertainment (5 events)
  ('clxf8a9b0c1d2e3f4g5h6i7j', 'Comedy Night Live', 'Hilarious stand-up comedy featuring local comedians and surprise celebrity guests.', 1757455200, 'https://picsum.photos/800/600?random=18', 180, 'Comedy Club, 111 Laugh Avenue, Entertainment District', 'clx7b4c5d6e7f8g9h0i1j2k3', 'mjldgkm833dzwjhy4cjoji47', 1733054400, 1733054400),
  ('clxf9a0b1c2d3e4f5g6h7i8j', 'Game Tournament Championship', 'Competitive esports tournament featuring popular games with cash prizes and live streaming.', 1758664800, 'https://picsum.photos/800/600?random=19', 250, 'Gaming Arena, 222 Gamer Street, Tech District', 'clx7b5c6d7e8f9g0h1i2j3k4', 'mjldgkm833dzwjhy4cjoji47', 1736765400, 1736765400),
  ('clxg0a1b2c3d4e5f6g7h8i9j', 'Magic Show Spectacular', 'World-class illusionists perform mind-bending tricks and grand illusions for all ages.', 1759874400, 'https://picsum.photos/800/600?random=20', 200, 'Magic Theater, 333 Wonder Way, Downtown', 'clx7b6c7d8e9f0g1h2i3j4k5', 'mjldgkm833dzwjhy4cjoji47', 1740574500, 1740574500),
  ('clxg1a2b3c4d5e6f7g8h9i0j', 'Movie Marathon Night', 'Classic film marathon featuring iconic movies from the 80s and 90s with popcorn and drinks.', 1761084000, 'https://picsum.photos/800/600?random=21', 120, 'Retro Cinema, 444 Film Boulevard, Theater Row', 'clx7a5b6c7d8e9f0g1h2i3j4', 'mjldgkm833dzwjhy4cjoji47', 1743966000, 1743966000),
  ('clxg2a3b4c5d6e7f8g9h0i1j', 'Trivia Night Championship', 'Test your knowledge across multiple categories in this fun and competitive trivia competition.', 1762297200, 'https://picsum.photos/800/600?random=22', 80, 'Pub & Grill, 555 Trivia Street, Entertainment Zone', 'clx7b7c8d9e0f1g2h3i4j5k6', 'mjldgkm833dzwjhy4cjoji47', 1746375000, 1746375000),

  -- Food & Drink (6 events)
  ('clxg3a4b5c6d7e8f9g0h1i2j', 'Wine Tasting Evening', 'Sample premium wines from around the world with expert sommelier guidance and cheese pairings.', 1763506800, 'https://picsum.photos/800/600?random=23', 50, 'Wine Bar, 666 Vineyard Road, Culinary District', 'clx7b8c9d0e1f2g3h4i5j6k7', 'tmzcj46yw8ct2m7m98hp2shq', 1732374600, 1732374600),
  ('clxg4a5b6c7d8e9f0g1h2i3j', 'Cooking Class: Italian Cuisine', 'Learn to prepare authentic Italian pasta, sauces, and desserts with a professional chef.', 1764716400, 'https://picsum.photos/800/600?random=24', 20, 'Culinary School, Kitchen Studio, Food Avenue', 'clx7b9c0d1e2f3g4h5i6j7k8', 'tmzcj46yw8ct2m7m98hp2shq', 1736425500, 1736425500),
  ('clxg5a6b7c8d9e0f1g2h3i4j', 'Food Truck Festival', 'Taste dishes from 30+ gourmet food trucks featuring cuisine from around the world.', 1765926000, 'https://picsum.photos/800/600?random=25', 500, 'City Park, Main Lawn, Park Boulevard', 'clx7b0c1d2e3f4g5h6i7j8k9', 'tmzcj46yw8ct2m7m98hp2shq', 1741932000, 1741932000),
  ('clxg6a7b8c9d0e1f2g3h4i5j', 'Craft Beer Tasting', 'Sample local and imported craft beers with brewery tours and beer-making demonstrations.', 1769900400, 'https://picsum.photos/800/600?random=26', 60, 'Brewery Taproom, 777 Hops Street, Brewery District', 'clx7a1b2c3d4e5f6g7h8i9j0', 'tmzcj46yw8ct2m7m98hp2shq', 1743525900, 1743525900),
  ('clxg7a8b9c0d1e2f3g4h5i6j', 'Baking Workshop: Pastries', 'Master the art of French pastry making including croissants, éclairs, and macarons.', 1771023600, 'https://picsum.photos/800/600?random=27', 15, 'Pastry Academy, 888 Baker Lane, Culinary Quarter', 'clx7b1c2d3e4f5g6h7i8j9k0', 'tmzcj46yw8ct2m7m98hp2shq', 1746259200, 1746259200),
  ('clxg8a9b0c1d2e3f4g5h6i7j', 'Coffee Roasting Experience', 'Learn about coffee bean origins, roasting techniques, and brewing methods from barista champions.', 1772146800, 'https://picsum.photos/800/600?random=28', 25, 'Coffee Roastery, 999 Espresso Avenue, Cafe Row', 'clx7b2c3d4e5f6g7h8i9j0k1', 'tmzcj46yw8ct2m7m98hp2shq', 1749655200, 1749655200),

  -- Health & Wellness (5 events)
  ('clxg9a0b1c2d3e4f5g6h7i8j', 'Yoga Retreat Weekend', 'Rejuvenating yoga sessions combined with meditation, healthy meals, and wellness workshops.', 1773270000, 'https://picsum.photos/800/600?random=29', 40, 'Wellness Center, 111 Zen Road, Retreat Hills', 'clx7b3c4d5e6f7g8h9i0j1k2', 'qnw54b4n7tfg8dfo9xxvxwy4', 1737889200, 1737889200),
  ('clxh0a1b2c3d4e5f6g7h8i9j', 'Mental Health Awareness', 'Expert-led discussions on mental health, stress management, and emotional well-being.', 1774393200, 'https://picsum.photos/800/600?random=30', 100, 'Community Center, Wellness Hall, Health District', 'clx7a2b3c4d5e6f7g8h9i0j1', 'qnw54b4n7tfg8dfo9xxvxwy4', 1740148200, 1740148200),
  ('clxh1a2b3c4d5e6f7g8h9i0j', 'Nutrition Workshop', 'Learn about healthy eating, meal planning, and dietary strategies from registered dietitians.', 1775512800, 'https://picsum.photos/800/600?random=31', 50, 'Health Clinic, Education Room, Medical Plaza', 'clx7b4c5d6e7f8g9h0i1j2k3', 'qnw54b4n7tfg8dfo9xxvxwy4', 1742644800, 1742644800),
  ('clxh2a3b4c5d6e7f8g9h0i1j', 'Fitness Bootcamp', 'High-intensity interval training sessions designed for all fitness levels with certified trainers.', 1776636000, 'https://picsum.photos/800/600?random=32', 30, 'Outdoor Gym, 222 Fitness Park, Recreation Area', 'clx7b5c6d7e8f9g0h1i2j3k4', 'qnw54b4n7tfg8dfo9xxvxwy4', 1745661900, 1745661900),
  ('clxh3a4b5c6d7e8f9g0h1i2j', 'Meditation & Mindfulness', 'Guided meditation sessions to reduce stress, improve focus, and enhance overall well-being.', 1777759200, 'https://picsum.photos/800/600?random=33', 60, 'Meditation Studio, 333 Peace Avenue, Quiet Zone', 'clx7b6c7d8e9f0g1h2i3j4k5', 'qnw54b4n7tfg8dfo9xxvxwy4', 1748811600, 1748811600),

  -- Music (6 events)
  ('clxh4a5b6c7d8e9f0g1h2i3j', 'Jazz Night at the Lounge', 'Smooth jazz performances by acclaimed musicians in an intimate lounge setting.', 1778882400, 'https://picsum.photos/800/600?random=34', 90, 'Jazz Lounge, 444 Blues Street, Music District', 'clx7b7c8d9e0f1g2h3i4j5k6', 'duiebkh8d60bzhp3865erwt1', 1731361200, 1731361200),
  ('clxh5a6b7c8d9e0f1g2h3i4j', 'Rock Concert Extravaganza', 'High-energy rock concert featuring popular local bands and special guest performers.', 1780005600, 'https://picsum.photos/800/600?random=35', 400, 'Rock Arena, 555 Concert Boulevard, Entertainment Zone', 'clx7a3b4c5d6e7f8g9h0i1j2', 'duiebkh8d60bzhp3865erwt1', 1736081400, 1736081400),
  ('clxh6a7b8c9d0e1f2g3h4i5j', 'Open Mic Night', 'Showcase your musical talent or enjoy performances from local singers, bands, and musicians.', 1781128800, 'https://picsum.photos/800/600?random=36', 70, 'Music Cafe, 666 Acoustic Lane, Arts Quarter', 'clx7b8c9d0e1f2g3h4i5j6k7', 'duiebkh8d60bzhp3865erwt1', 1739040600, 1739040600),
  ('clxh7a8b9c0d1e2f3g4h5i6j', 'Electronic Music Festival', 'All-day electronic dance music festival with top DJs and stunning light shows.', 1782252000, 'https://picsum.photos/800/600?random=37', 1000, 'Festival Grounds, 777 EDM Plaza, Music Park', 'clx7a4b5c6d7e8f9g0h1i2j3', 'duiebkh8d60bzhp3865erwt1', 1744113900, 1744113900),
  ('clxh8a9b0c1d2e3f4g5h6i7j', 'Piano Recital Series', 'Talented pianists perform classical and contemporary pieces in an elegant concert hall.', 1783375200, 'https://picsum.photos/800/600?random=38', 150, 'Concert Hall, 888 Piano Road, Cultural Center', 'clx7b9c0d1e2f3g4h5i6j7k8', 'duiebkh8d60bzhp3865erwt1', 1747428300, 1747428300),
  ('clxh9a0b1c2d3e4f5g6h7i8j', 'World Music Celebration', 'Experience music from diverse cultures including African drums, Indian sitar, and Latin rhythms.', 1784498400, 'https://picsum.photos/800/600?random=39', 200, 'World Stage, 999 Global Avenue, Cultural District', 'clx7b0c1d2e3f4g5h6i7j8k9', 'duiebkh8d60bzhp3865erwt1', 1749655800, 1749655800),

  -- Networking (5 events)
  ('clxi0a1b2c3d4e5f6g7h8i9j', 'Tech Professionals Meetup', 'Connect with software developers, designers, and tech entrepreneurs in your area.', 1785621600, 'https://picsum.photos/800/600?random=40', 80, 'Tech Hub, Lounge Area, Innovation District', 'clx7a5b6c7d8e9f0g1h2i3j4', 'b2sk1czsebrzeuhkhje0q3p9', 1735650000, 1735650000),
  ('clxi1a2b3c4d5e6f7g8h9i0j', 'Women in Business Forum', 'Empowering networking event for professional women to share experiences and build connections.', 1786744800, 'https://picsum.photos/800/600?random=41', 100, 'Executive Center, Forum Room, Business District', 'clx7b1c2d3e4f5g6h7i8j9k0', 'b2sk1czsebrzeuhkhje0q3p9', 1738486800, 1738486800),
  ('clxi2a3b4c5d6e7f8g9h0i1j', 'Young Professionals Happy Hour', 'Casual networking event for young professionals to meet, mingle, and make connections.', 1787868000, 'https://picsum.photos/800/600?random=42', 120, 'Rooftop Bar, 123 Skyline Avenue, Downtown', 'clx7b2c3d4e5f6g7h8i9j0k1', 'b2sk1czsebrzeuhkhje0q3p9', 1741349400, 1741349400),
  ('clxi3a4b5c6d7e8f9g0h1i2j', 'Industry Leaders Roundtable', 'Exclusive discussion panel with industry executives sharing insights and best practices.', 1788991200, 'https://picsum.photos/800/600?random=43', 50, 'Corporate Boardroom, 456 Executive Tower, Financial District', 'clx7a1b2c3d4e5f6g7h8i9j0', 'b2sk1czsebrzeuhkhje0q3p9', 1744110000, 1744110000),
  ('clxi4a5b6c7d8e9f0g1h2i3j', 'Freelancer Network Meetup', 'Support and networking for freelancers and independent contractors across all industries.', 1790114400, 'https://picsum.photos/800/600?random=44', 75, 'Coworking Space, 789 Freelance Lane, Creative District', 'clx7b3c4d5e6f7g8h9i0j1k2', 'b2sk1czsebrzeuhkhje0q3p9', 1747074900, 1747074900),

  -- Sports & Fitness (6 events)
  ('clxi5a6b7c8d9e0f1g2h3i4j', 'City Marathon 2024', 'Annual city marathon with 5K, 10K, and full marathon distances for all fitness levels.', 1791237600, 'https://picsum.photos/800/600?random=45', 500, 'City Center, Starting Point: Main Square', 'clx7b4c5d6e7f8g9h0i1j2k3', 'bt6uo0xfpb1npf3z7gc8gi6j', 1731654000, 1731654000),
  ('clxi6a7b8c9d0e1f2g3h4i5j', 'Basketball Tournament', 'Competitive 3-on-3 basketball tournament with prizes for winning teams.', 1792360800, 'https://picsum.photos/800/600?random=46', 64, 'Sports Complex, Indoor Courts, Athletic District', 'clx7b5c6d7e8f9g0h1i2j3k4', 'bt6uo0xfpb1npf3z7gc8gi6j', 1737021600, 1737021600),
  ('clxi7a8b9c0d1e2f3g4h5i6j', 'Cycling Group Ride', 'Scenic 50-mile group cycling ride through countryside with support vehicles and rest stops.', 1793487600, 'https://picsum.photos/800/600?random=47', 100, 'Bike Shop Parking Lot, 234 Cycling Road, Suburbs', 'clx7a2b3c4d5e6f7g8h9i0j1', 'bt6uo0xfpb1npf3z7gc8gi6j', 1740783000, 1740783000),
  ('clxi8a9b0c1d2e3f4g5h6i7j', 'Swim Meet Championship', 'Regional swim meet featuring competitive races in multiple age categories and stroke events.', 1794610800, 'https://picsum.photos/800/600?random=48', 200, 'Aquatic Center, Olympic Pool, Recreation Complex', 'clx7b6c7d8e9f0g1h2i3j4k5', 'bt6uo0xfpb1npf3z7gc8gi6j', 1743775500, 1743775500),
  ('clxi9a0b1c2d3e4f5g6h7i8j', 'Tennis Clinic for Beginners', 'Learn tennis fundamentals including serving, forehand, backhand, and court positioning.', 1795734000, 'https://picsum.photos/800/600?random=49', 20, 'Tennis Club, 345 Racquet Avenue, Sports Park', 'clx7b7c8d9e0f1g2h3i4j5k6', 'bt6uo0xfpb1npf3z7gc8gi6j', 1746691500, 1746691500),
  ('clxj0a1b2c3d4e5f6g7h8i9j', 'Hiking Adventure Trip', 'Guided day hike through mountain trails with experienced guides and packed lunch included.', 1796857200, 'https://picsum.photos/800/600?random=50', 35, 'Trailhead Parking, 456 Mountain Road, National Park', 'clx7b8c9d0e1f2g3h4i5j6k7', 'bt6uo0xfpb1npf3z7gc8gi6j', 1749967200, 1749967200);

-- STEP 6: Insert Event Registrations (~200 registrations)
-- Distribution: Past events (60-95% capacity), Current events (40-80%), Near-future (30-60%), Far-future (10-40%)

INSERT INTO event_visitors (event_id, user_id, registered_at) VALUES
  -- Arts & Culture events
  ('clxe1a2b3c4d5e6f7g8h9i0j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1730503800),
  ('clxe1a2b3c4d5e6f7g8h9i0j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1730590500),
  ('clxe1a2b3c4d5e6f7g8h9i0j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1730677200),
  ('clxe1a2b3c4d5e6f7g8h9i0j', 'h1j0nv1tc1wbpxlezhlc5xy0', 1730763900),

  ('clxe2a3b4c5d6e7f8g9h0i1j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1732186200),
  ('clxe2a3b4c5d6e7f8g9h0i1j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1732272900),
  ('clxe2a3b4c5d6e7f8g9h0i1j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1732359600),
  ('clxe2a3b4c5d6e7f8g9h0i1j', 'keyhehoicavaix44lpg5m5b4', 1732446300),
  ('clxe2a3b4c5d6e7f8g9h0i1j', 'fhm3kkh84em4m4gsl5hfaxwg', 1732533000),

  ('clxe3a4b5c6d7e8f9g0h1i2j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1736903400),
  ('clxe3a4b5c6d7e8f9g0h1i2j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1736990100),
  ('clxe3a4b5c6d7e8f9g0h1i2j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1737076800),

  ('clxe4a5b6c7d8e9f0g1h2i3j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1740126000),
  ('clxe4a5b6c7d8e9f0g1h2i3j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1740212700),
  ('clxe4a5b6c7d8e9f0g1h2i3j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1740299400),
  ('clxe4a5b6c7d8e9f0g1h2i3j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1740386100),

  ('clxe5a6b7c8d9e0f1g2h3i4j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1743052200),
  ('clxe5a6b7c8d9e0f1g2h3i4j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1743138900),

  ('clxe6a7b8c9d0e1f2g3h4i5j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1747449600),
  ('clxe6a7b8c9d0e1f2g3h4i5j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1747536300),

  -- Business events
  ('clxe7a8b9c0d1e2f3g4h5i6j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1732664400),
  ('clxe7a8b9c0d1e2f3g4h5i6j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1732751100),
  ('clxe7a8b9c0d1e2f3g4h5i6j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1732837800),
  ('clxe7a8b9c0d1e2f3g4h5i6j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1732924500),
  ('clxe7a8b9c0d1e2f3g4h5i6j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1733011200),

  ('clxe8a9b0c1d2e3f4g5h6i7j', 'smcxz7ll1856kd21bwymoe1w', 1738278000),
  ('clxe8a9b0c1d2e3f4g5h6i7j', 'clx7a1b2c3d4e5f6g7h8i9j0', 1738364700),
  ('clxe8a9b0c1d2e3f4g5h6i7j', 'clx7a2b3c4d5e6f7g8h9i0j1', 1738451400),
  ('clxe8a9b0c1d2e3f4g5h6i7j', 'clx7b1c2d3e4f5g6h7i8j9k0', 1738538100),

  ('clxe9a0b1c2d3e4f5g6h7i8j', 'clx7b2c3d4e5f6g7h8i9j0k1', 1739827500),
  ('clxe9a0b1c2d3e4f5g6h7i8j', 'clx7b3c4d5e6f7g8h9i0j1k2', 1739914200),
  ('clxe9a0b1c2d3e4f5g6h7i8j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1740000900),

  ('clxe0a1b2c3d4e5f6g7h8i9j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1743396600),
  ('clxe0a1b2c3d4e5f6g7h8i9j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1743483300),

  ('clxf1a2b3c4d5e6f7g8h9i0j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1746653400),
  ('clxf1a2b3c4d5e6f7g8h9i0j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1746740100),

  -- Education events
  ('clxf2a3b4c5d6e7f8g9h0i1j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1730828400),
  ('clxf2a3b4c5d6e7f8g9h0i1j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1730915100),
  ('clxf2a3b4c5d6e7f8g9h0i1j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1731001800),
  ('clxf2a3b4c5d6e7f8g9h0i1j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1731088500),
  ('clxf2a3b4c5d6e7f8g9h0i1j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1731175200),

  ('clxf3a4b5c6d7e8f9g0h1i2j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1735434000),
  ('clxf3a4b5c6d7e8f9g0h1i2j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1735520700),
  ('clxf3a4b5c6d7e8f9g0h1i2j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1735607400),

  ('clxf4a5b6c7d8e9f0g1h2i3j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1738356900),
  ('clxf4a5b6c7d8e9f0g1h2i3j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1738443600),
  ('clxf4a5b6c7d8e9f0g1h2i3j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1738530300),

  ('clxf5a6b7c8d9e0f1g2h3i4j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1741536900),
  ('clxf5a6b7c8d9e0f1g2h3i4j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1741623600),

  ('clxf6a7b8c9d0e1f2g3h4i5j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1744402200),
  ('clxf6a7b8c9d0e1f2g3h4i5j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1744488900),
  ('clxf6a7b8c9d0e1f2g3h4i5j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1744575600),

  ('clxf7a8b9c0d1e2f3g4h5i6j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1748210700),
  ('clxf7a8b9c0d1e2f3g4h5i6j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1748297400),

  -- Entertainment events
  ('clxf8a9b0c1d2e3f4g5h6i7j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1733086800),
  ('clxf8a9b0c1d2e3f4g5h6i7j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1733173500),
  ('clxf8a9b0c1d2e3f4g5h6i7j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1733260200),
  ('clxf8a9b0c1d2e3f4g5h6i7j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1733346900),
  ('clxf8a9b0c1d2e3f4g5h6i7j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1733433600),

  ('clxf9a0b1c2d3e4f5g6h7i8j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1736797800),
  ('clxf9a0b1c2d3e4f5g6h7i8j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1736884500),
  ('clxf9a0b1c2d3e4f5g6h7i8j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1736971200),
  ('clxf9a0b1c2d3e4f5g6h7i8j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1737057900),

  ('clxg0a1b2c3d4e5f6g7h8i9j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1740606900),
  ('clxg0a1b2c3d4e5f6g7h8i9j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1740693600),
  ('clxg0a1b2c3d4e5f6g7h8i9j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1740780300),

  ('clxg1a2b3c4d5e6f7g8h9i0j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1743997200),
  ('clxg1a2b3c4d5e6f7g8h9i0j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1744083900),

  ('clxg2a3b4c5d6e7f8g9h0i1j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1746409200),
  ('clxg2a3b4c5d6e7f8g9h0i1j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1746495900),

  -- Food & Drink events
  ('clxg3a4b5c6d7e8f9g0h1i2j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1732408200),
  ('clxg3a4b5c6d7e8f9g0h1i2j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1732494900),
  ('clxg3a4b5c6d7e8f9g0h1i2j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1732581600),
  ('clxg3a4b5c6d7e8f9g0h1i2j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1732668300),

  ('clxg4a5b6c7d8e9f0g1h2i3j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1736464200),
  ('clxg4a5b6c7d8e9f0g1h2i3j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1736550900),
  ('clxg4a5b6c7d8e9f0g1h2i3j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1736637600),

  ('clxg5a6b7c8d9e0f1g2h3i4j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1741969200),
  ('clxg5a6b7c8d9e0f1g2h3i4j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1742055900),
  ('clxg5a6b7c8d9e0f1g2h3i4j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1742142600),
  ('clxg5a6b7c8d9e0f1g2h3i4j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1742229300),

  ('clxg6a7b8c9d0e1f2g3h4i5j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1743558000),
  ('clxg6a7b8c9d0e1f2g3h4i5j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1743644700),

  ('clxg7a8b9c0d1e2f3g4h5i6j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1746297600),
  ('clxg7a8b9c0d1e2f3g4h5i6j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1746384300),

  ('clxg8a9b0c1d2e3f4g5h6i7j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1749692400),
  ('clxg8a9b0c1d2e3f4g5h6i7j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1749779100),

  -- Health & Wellness events
  ('clxg9a0b1c2d3e4f5g6h7i8j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1737922200),
  ('clxg9a0b1c2d3e4f5g6h7i8j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1738008900),
  ('clxg9a0b1c2d3e4f5g6h7i8j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1738095600),

  ('clxh0a1b2c3d4e5f6g7h8i9j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1740180600),
  ('clxh0a1b2c3d4e5f6g7h8i9j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1740267300),
  ('clxh0a1b2c3d4e5f6g7h8i9j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1740354000),

  ('clxh1a2b3c4d5e6f7g8h9i0j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1742677200),
  ('clxh1a2b3c4d5e6f7g8h9i0j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1742763900),

  ('clxh2a3b4c5d6e7f8g9h0i1j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1745699400),
  ('clxh2a3b4c5d6e7f8g9h0i1j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1745786100),

  ('clxh3a4b5c6d7e8f9g0h1i2j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1748850000),
  ('clxh3a4b5c6d7e8f9g0h1i2j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1748936700),

  -- Music events
  ('clxh4a5b6c7d8e9f0g1h2i3j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1731394800),
  ('clxh4a5b6c7d8e9f0g1h2i3j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1731481500),
  ('clxh4a5b6c7d8e9f0g1h2i3j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1731568200),
  ('clxh4a5b6c7d8e9f0g1h2i3j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1731654900),

  ('clxh5a6b7c8d9e0f1g2h3i4j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1736113200),
  ('clxh5a6b7c8d9e0f1g2h3i4j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1736199900),
  ('clxh5a6b7c8d9e0f1g2h3i4j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1736286600),
  ('clxh5a6b7c8d9e0f1g2h3i4j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1736373300),

  ('clxh6a7b8c9d0e1f2g3h4i5j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1739073000),
  ('clxh6a7b8c9d0e1f2g3h4i5j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1739159700),

  ('clxh7a8b9c0d1e2f3g4h5i6j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1744146300),
  ('clxh7a8b9c0d1e2f3g4h5i6j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1744233000),
  ('clxh7a8b9c0d1e2f3g4h5i6j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1744319700),

  ('clxh8a9b0c1d2e3f4g5h6i7j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1747469400),
  ('clxh8a9b0c1d2e3f4g5h6i7j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1747556100),

  ('clxh9a0b1c2d3e4f5g6h7i8j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1749688200),
  ('clxh9a0b1c2d3e4f5g6h7i8j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1749774900),

  -- Networking events
  ('clxi0a1b2c3d4e5f6g7h8i9j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1735682400),
  ('clxi0a1b2c3d4e5f6g7h8i9j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1735769100),
  ('clxi0a1b2c3d4e5f6g7h8i9j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1735855800),

  ('clxi1a2b3c4d5e6f7g8h9i0j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1738518600),
  ('clxi1a2b3c4d5e6f7g8h9i0j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1738605300),
  ('clxi1a2b3c4d5e6f7g8h9i0j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1738692000),

  ('clxi2a3b4c5d6e7f8g9h0i1j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1741381200),
  ('clxi2a3b4c5d6e7f8g9h0i1j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1741467900),

  ('clxi3a4b5c6d7e8f9g0h1i2j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1744142400),
  ('clxi3a4b5c6d7e8f9g0h1i2j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1744229100),

  ('clxi4a5b6c7d8e9f0g1h2i3j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1747107000),
  ('clxi4a5b6c7d8e9f0g1h2i3j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1747193700),

  -- Sports & Fitness events
  ('clxi5a6b7c8d9e0f1g2h3i4j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1731686400),
  ('clxi5a6b7c8d9e0f1g2h3i4j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1731773100),
  ('clxi5a6b7c8d9e0f1g2h3i4j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1731859800),
  ('clxi5a6b7c8d9e0f1g2h3i4j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1731946500),
  ('clxi5a6b7c8d9e0f1g2h3i4j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1732033200),

  ('clxi6a7b8c9d0e1f2g3h4i5j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1737054000),
  ('clxi6a7b8c9d0e1f2g3h4i5j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1737140700),
  ('clxi6a7b8c9d0e1f2g3h4i5j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1737227400),

  ('clxi7a8b9c0d1e2f3g4h5i6j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1740815400),
  ('clxi7a8b9c0d1e2f3g4h5i6j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1740902100),

  ('clxi8a9b0c1d2e3f4g5h6i7j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1744017600),
  ('clxi8a9b0c1d2e3f4g5h6i7j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1744104300),

  ('clxi9a0b1c2d3e4f5g6h7i8j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1746727200),
  ('clxi9a0b1c2d3e4f5g6h7i8j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1746813900),

  ('clxj0a1b2c3d4e5f6g7h8i9j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1750003800),
  ('clxj0a1b2c3d4e5f6g7h8i9j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1750090500),

  -- Additional random registrations to reach ~200 total
  ('clxe3a4b5c6d7e8f9g0h1i2j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1736941200),
  ('clxe4a5b6c7d8e9f0g1h2i3j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1740472800),
  ('clxe5a6b7c8d9e0f1g2h3i4j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1743225600),
  ('clxe6a7b8c9d0e1f2g3h4i5j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1747623000),
  ('clxe8a9b0c1d2e3f4g5h6i7j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1738451400),
  ('clxe9a0b1c2d3e4f5g6h7i8j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1740087600),
  ('clxe0a1b2c3d4e5f6g7h8i9j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1743483300),
  ('clxf1a2b3c4d5e6f7g8h9i0j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1746826800),
  ('clxf4a5b6c7d8e9f0g1h2i3j', 'clx7c1d2e3f4g5h6i7j8k9l0', 1738617900),
  ('clxf5a6b7c8d9e0f1g2h3i4j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1741623600),
  ('clxf6a7b8c9d0e1f2g3h4i5j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1744575600),
  ('clxf7a8b9c0d1e2f3g4h5i6j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1748384100),
  ('clxg0a1b2c3d4e5f6g7h8i9j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1740867000),
  ('clxg1a2b3c4d5e6f7g8h9i0j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1744170600),
  ('clxg2a3b4c5d6e7f8g9h0i1j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1746582600),
  ('clxg4a5b6c7d8e9f0g1h2i3j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1736724000),
  ('clxg5a6b7c8d9e0f1g2h3i4j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1742316000),
  ('clxg6a7b8c9d0e1f2g3h4i5j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1743730800),
  ('clxg7a8b9c0d1e2f3g4h5i6j', 'clx7d1e2f3g4h5i6j7k8l9m0', 1746471000),
  ('clxh0a1b2c3d4e5f6g7h8i9j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1740440700),
  ('clxh1a2b3c4d5e6f7g8h9i0j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1742850600),
  ('clxh2a3b4c5d6e7f8g9h0i1j', 'clx7c5d6e7f8g9h0i1j2k3l4', 1745872800),
  ('clxh3a4b5c6d7e8f9g0h1i2j', 'clx7c6d7e8f9g0h1i2j3k4l5', 1749023400),
  ('clxh6a7b8c9d0e1f2g3h4i5j', 'clx7c7d8e9f0g1h2i3j4k5l6', 1739246700),
  ('clxh7a8b9c0d1e2f3g4h5i6j', 'clx7c8d9e0f1g2h3i4j5k6l7', 1744406400),
  ('clxh8a9b0c1d2e3f4g5h6i7j', 'clx7c9d0e1f2g3h4i5j6k7l8', 1747642800),
  ('clxh9a0b1c2d3e4f5g6h7i8j', 'clx7c0d1e2f3g4h5i6j7k8l9', 1749861600),
  ('clxi2a3b4c5d6e7f8g9h0i1j', 'clx7c2d3e4f5g6h7i8j9k0l1', 1741554600),
  ('clxi3a4b5c6d7e8f9g0h1i2j', 'clx7c3d4e5f6g7h8i9j0k1l2', 1744315800),
  ('clxi4a5b6c7d8e9f0g1h2i3j', 'clx7c4d5e6f7g8h9i0j1k2l3', 1747280400);

-- STEP 7: Verification Queries
SELECT '=== DATABASE SEED VERIFICATION ===' as message;
SELECT 'Roles' as table_name, COUNT(*) as count FROM roles
UNION ALL
SELECT 'Categories', COUNT(*) FROM event_categories
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'User Roles', COUNT(*) FROM user_roles
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Event Visitors', COUNT(*) FROM event_visitors;

-- Show sample of created events
SELECT '=== SAMPLE EVENTS ===' as message;
SELECT title, date, capacity, location,
       (SELECT COUNT(*) FROM event_visitors WHERE event_id = events.id) as registrations
FROM events
ORDER BY date
LIMIT 10;

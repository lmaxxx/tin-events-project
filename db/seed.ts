import { db, roles, users, userRoles, eventCategories } from './index';
import bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 Starting database seed...');

  // Create roles
  console.log('Creating roles...');
  const createdRoles = await db
    .insert(roles)
    .values([
      { name: 'guest', description: 'Can browse events only' },
      { name: 'user', description: 'Can browse and register for events' },
      { name: 'organizer', description: 'Can create and manage own events' },
      { name: 'admin', description: 'Full system access' },
    ])
    .returning();

  console.log(`✅ Created ${createdRoles.length} roles`);

  // Create event categories
  console.log('Creating event categories...');
  const categories = await db
    .insert(eventCategories)
    .values([
      { name: 'Technology', description: 'Tech conferences, workshops, and meetups' },
      { name: 'Business', description: 'Business networking and professional development' },
      { name: 'Arts & Culture', description: 'Art exhibitions, cultural events, and performances' },
      { name: 'Sports & Fitness', description: 'Sports events, fitness classes, and outdoor activities' },
      { name: 'Music', description: 'Concerts, music festivals, and live performances' },
      { name: 'Food & Drink', description: 'Food festivals, cooking classes, and tastings' },
      { name: 'Education', description: 'Workshops, seminars, and educational events' },
      { name: 'Health & Wellness', description: 'Wellness workshops, yoga, and health seminars' },
      { name: 'Networking', description: 'Professional networking and community building' },
      { name: 'Entertainment', description: 'Comedy shows, theater, and entertainment events' },
    ])
    .returning();

  console.log(`✅ Created ${categories.length} categories`);

  // Create demo admin user
  console.log('Creating demo users...');
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const [adminUser] = await db
    .insert(users)
    .values({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
    })
    .returning();

  // Assign admin role to admin user
  const adminRole = createdRoles.find((r) => r.name === 'admin');
  if (adminRole && adminUser) {
    await db.insert(userRoles).values({
      userId: adminUser.id,
      roleId: adminRole.id,
    });
    console.log('✅ Created admin user (admin@example.com / admin123)');
  }

  // Create demo organizer user
  const organizerPassword = await bcrypt.hash('organizer123', 12);
  const [organizerUser] = await db
    .insert(users)
    .values({
      name: 'Organizer User',
      email: 'organizer@example.com',
      password: organizerPassword,
    })
    .returning();

  const organizerRole = createdRoles.find((r) => r.name === 'organizer');
  if (organizerRole && organizerUser) {
    await db.insert(userRoles).values({
      userId: organizerUser.id,
      roleId: organizerRole.id,
    });
    console.log('✅ Created organizer user (organizer@example.com / organizer123)');
  }

  // Create demo regular user
  const userPassword = await bcrypt.hash('user123', 12);
  const [regularUser] = await db
    .insert(users)
    .values({
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
    })
    .returning();

  const userRole = createdRoles.find((r) => r.name === 'user');
  if (userRole && regularUser) {
    await db.insert(userRoles).values({
      userId: regularUser.id,
      roleId: userRole.id,
    });
    console.log('✅ Created regular user (user@example.com / user123)');
  }

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('Demo accounts:');
  console.log('  Admin:      admin@example.com / admin123');
  console.log('  Organizer:  organizer@example.com / organizer123');
  console.log('  User:       user@example.com / user123');
  console.log('');

  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});

#!/bin/bash
set -e

echo "🌱 Seeding database..."

# Run migrations (creates schema)
npm run db:migrate

# Seed full data (30 users, 50 events, registrations)
npm run db:seed-full

echo ""
echo "✅ Database seeded successfully!"
echo "   - 30 users"
echo "   - 50 events"
echo "   - ~200 registrations"
echo ""
echo "Demo accounts:"
echo "  admin@example.com / admin123"
echo "  organizer@example.com / organizer123"
echo "  user@example.com / user123"

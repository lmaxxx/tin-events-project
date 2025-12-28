import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { users } from './users';
import { eventCategories } from './categories';

export const events = sqliteTable('events', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  imageUrl: text('image_url'),
  capacity: integer('capacity').notNull(),
  location: text('location').notNull(),
  creatorId: text('creator_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  categoryId: text('category_id')
    .notNull()
    .references(() => eventCategories.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const eventVisitors = sqliteTable(
  'event_visitors',
  {
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    registeredAt: integer('registered_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.eventId, table.userId] }),
  })
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventVisitor = typeof eventVisitors.$inferSelect;
export type NewEventVisitor = typeof eventVisitors.$inferInsert;

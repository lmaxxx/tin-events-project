import { relations } from 'drizzle-orm';
import { users } from './users';
import { roles, userRoles } from './roles';
import { events, eventVisitors } from './events';
import { eventCategories } from './categories';

export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  createdEvents: many(events),
  eventVisitors: many(eventVisitors),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.creatorId],
    references: [users.id],
  }),
  category: one(eventCategories, {
    fields: [events.categoryId],
    references: [eventCategories.id],
  }),
  visitors: many(eventVisitors),
}));

export const eventCategoriesRelations = relations(eventCategories, ({ many }) => ({
  events: many(events),
}));

export const eventVisitorsRelations = relations(eventVisitors, ({ one }) => ({
  event: one(events, {
    fields: [eventVisitors.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventVisitors.userId],
    references: [users.id],
  }),
}));

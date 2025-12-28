import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as users from './schema/users';
import * as roles from './schema/roles';
import * as events from './schema/events';
import * as categories from './schema/categories';
import * as relations from './schema/relations';

const sqlite = new Database('sqlite.db');
sqlite.pragma('journal_mode = WAL');

const schema = {
  ...users,
  ...roles,
  ...events,
  ...categories,
  ...relations,
};

export const db = drizzle(sqlite, { schema });

export * from './schema/users';
export * from './schema/roles';
export * from './schema/events';
export * from './schema/categories';

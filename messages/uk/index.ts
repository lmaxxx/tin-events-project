import common from './common.json';
import auth from './auth.json';
import events from './events.json';
import admin from './admin.json';
import validation from './validation.json';
import errors from './errors.json';

const messages = {
  common,
  auth,
  events,
  admin,
  validation,
  errors,
} as const;

export default messages;

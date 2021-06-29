import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { User } from './schemas/User';

// eslint-disable-next-line prettier/prettier
const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/keystone-store-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 365,
  secret: process.env.COOKIE_SECRET,
};

export default config({
  server: {
    cors: {
      origin: [process.env.FRONTEND_URL],
      credentials: true,
    },
  },
  db: {
    adapter: 'mongoose',
    url: databaseURL,
    // add dataseeding
  },
  lists: createSchema({
    // schema items here
    User,
  }),
  ui: {
    // TODO change for roles
    isAccessAllowed: () => true,
  },
  // TODO add session values
});

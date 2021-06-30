import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
// eslint-disable-next-line prettier/prettier
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';

// eslint-disable-next-line prettier/prettier
const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/keystone-store-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 365,
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO add roles
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: databaseURL,
      async onConnect(keystone) {
        console.log('Connected to Database');
        // eslint-disable-next-line prettier/prettier
        if (process.argv.includes('--seed-data')) await insertSeedData(keystone);
      },
    },
    lists: createSchema({
      // schema items here
      User,
      Product,
      ProductImage,
    }),
    ui: {
      // show UI only to users who pass test
      // have session, are logged in
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      isAccessAllowed: ({ session }) => !!session?.data,
    },
    session: withItemData(statelessSessions(sessionConfig), {
      User: 'id',
    }),
  })
);

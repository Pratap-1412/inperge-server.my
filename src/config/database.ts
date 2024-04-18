// import { Sequelize } from 'sequelize';
// import * as dotenv from 'dotenv';

// dotenv.config();

// const {
//   POSTGRES_DATABASE,
//   POSTGRES_USER,
//   POSTGRES_PASSWORD,
//   POSTGRES_HOST,
//   POSTGRES_PORT,
// } = process.env;

// if (!POSTGRES_DATABASE || !POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_HOST || !POSTGRES_PORT) {
//   console.error('Missing required environment variables for PostgreSQL connection');
//   process.exit(1);
// }

// const sequelize = new Sequelize(
//   POSTGRES_DATABASE,
//   POSTGRES_USER,
//   POSTGRES_PASSWORD,
//   {
//     host: POSTGRES_HOST,
//     port: parseInt(POSTGRES_PORT),
//     dialect: 'postgres',
//     logging: false,
//   }
// );

// export default sequelize;

import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  console.error('Missing required environment variable DATABASE_URL');
  process.exit(1);
}

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // You might need to set this to true if OnRender requires SSL certificate verification
    }
  }
});


export default sequelize;

import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_DATABASE,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
} = process.env;

if (!POSTGRES_USER || !POSTGRES_HOST || !POSTGRES_DATABASE || !POSTGRES_PASSWORD || !POSTGRES_PORT) {
  console.error('Missing required environment variables for PostgreSQL connection');
  process.exit(1);
}

const sequelize = new Sequelize(
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  {
    host: POSTGRES_HOST,
    port: parseInt(POSTGRES_PORT),
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;
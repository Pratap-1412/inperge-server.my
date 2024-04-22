import express from 'express';
import * as dotenv from 'dotenv';
import sequelize from './config//database';
import { authRouter, userRouter } from './routes/user.routes';
import { handleBadJSONRequest } from './middlewares/bad-request.middleware';
import cors from 'cors'; 
import transactionRouter from './routes/transaction.routes';
import balanceRouter from './routes/balance.routes';

dotenv.config();

const {
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;

if (!POSTGRES_DATABASE || !POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_HOST || !POSTGRES_PORT) {
  console.error('Missing required environment variables for PostgreSQL connection');
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

// Sync the database schema
sequelize
  .sync()
  .then(() => {
    console.log('Database schema synced');
  })
  .catch((err) => {
    console.error('Error syncing database schema', err);
  });

app.use(express.json());

// Use CORS middleware
app.use(cors());

// Use authentication routes
app.use('/api/auth', authRouter);

// Use user routes
app.use('/api/users', userRouter);

// Use transaction routes
app.use('/api/transaction', transactionRouter)

// Use balance routes
app.use('/api/balance',balanceRouter)

// Use the bad request handling middleware
app.use(handleBadJSONRequest)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

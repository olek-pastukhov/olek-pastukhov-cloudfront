import { Provider } from '@nestjs/common';
import { Client } from 'pg';

console.log('DB_HOST', process.env.DB_HOST);
console.log('DB_PORT', process.env.DB_PORT);
console.log('DB_NAME', process.env.DB_NAME);
console.log('DB_USER', process.env.DB_USER);
console.log('DB_PASSWORD', process.env.DB_PASSWORD);

export const DatabaseProviders: Provider[] = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<any> => {
      try {
        const client = new Client({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          ssl: {
            rejectUnauthorized: false,
          },
          connectionTimeoutMillis: 5000,
        });

        await client.connect();
        return client;
      } catch (error) {
        console.error(
          'An error occurred in creating DATABASE_CONNECTION',
          error,
        );
        throw error;
      }
    },
  },
];

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from '../shared/schema';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found in environment');
  }

  console.log('Connecting to database...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Migrating database...');
  await migrate(db, { migrationsFolder: './drizzle' });
  
  console.log('Migration complete!');
  pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
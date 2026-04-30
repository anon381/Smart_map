const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString || connectionString.includes('[YOUR_NEON_PASSWORD]')) {
  console.error('❌ ERROR: DATABASE_URL is missing or contains a placeholder password.');
  console.error('Please update the .env file in the root directory.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
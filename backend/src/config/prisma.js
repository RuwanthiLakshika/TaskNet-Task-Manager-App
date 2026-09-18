const path = require('path');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const databaseUrl = new URL(process.env.DATABASE_URL);

const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.slice(1),
  port: Number(databaseUrl.port),
  connectionLimit: 10
});

const prisma = new PrismaClient({ adapter });

module.exports = prisma;
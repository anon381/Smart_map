const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedLocations() {
  console.log('🌱 Seeding dummy locations...');

  // 1. Create a dummy user to be the creator
  const dummyUser = await prisma.user.upsert({
    where: { email: 'admin@smartmap.test' },
    update: {},
    create: {
      name: 'SmartMap Admin',
      email: 'admin@smartmap.test',
      password: 'password123',
      role: 'ADMIN'
    }
  });

  const sampleLocations = [
    { name: "City Center Cafe", category: "food", lat: 8.9810, lng: 38.7580, desc: "A cozy place for coffee and snacks." },
    { name: "Addis Game Zone", category: "game", lat: 8.9825, lng: 38.7565, desc: "VR and arcade games." },
    { name: "Holy Trinity Cathedral", category: "culture", lat: 8.9830, lng: 38.7590, desc: "Historic church." },
    { name: "Meskel Square Station", category: "transport", lat: 8.9800, lng: 38.7550, desc: "Main transport hub." },
    { name: "Addis Ababa University", category: "study", lat: 8.9850, lng: 38.7585, desc: "Main campus." },
    { name: "Zewditu Hospital", category: "health", lat: 8.9790, lng: 38.7595, desc: "Public hospital." },
    { name: "National Museum", category: "art", lat: 8.9840, lng: 38.7570, desc: "Art and history." },
    { name: "Bole Printing Services", category: "services", lat: 8.9815, lng: 38.7560, desc: "Local printing." },
    { name: "Secret Garden", category: "hidden", lat: 8.9805, lng: 38.7590, desc: "A quiet place to relax." },
  ];

  for (const loc of sampleLocations) {
    await prisma.location.create({
      data: {
        name: loc.name,
        category: loc.category,
        description: loc.desc,
        latitude: loc.lat,
        longitude: loc.lng,
        status: 'APPROVED',
        createdById: dummyUser.id,
      }
    });
  }

  console.log('✅ 9 dummy locations added successfully!');
}

seedLocations()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

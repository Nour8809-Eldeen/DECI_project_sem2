const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Category = require('../models/Category');
const Event = require('../models/Event');
const User = require('../models/User');

async function seed() {
  await connectDB();

  await Promise.all([Category.deleteMany({}), Event.deleteMany({}), User.deleteMany({})]);

  const categories = await Category.insertMany([
    { name: 'Music', description: 'Live music events' },
    { name: 'Tech', description: 'Technology meetups' },
    { name: 'Sports', description: 'Sports tournaments' }
  ]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@eventpulse.com',
    password: 'Admin123',
    role: 'admin'
  });

  const events = [
    {
      title: 'Summer Music Fest',
      description: 'A weekend music festival',
      date: new Date('2026-09-20T18:00:00.000Z'),
      city: 'Sydney',
      venue: 'Harbor Arena',
      capacity: 100,
      category: categories[0]._id,
      createdBy: admin._id
    },
    {
      title: 'AI Startup Meetup',
      description: 'Meetup for founders and developers',
      date: new Date('2026-10-05T19:00:00.000Z'),
      city: 'Melbourne',
      venue: 'Innovation Hub',
      capacity: 80,
      category: categories[1]._id,
      createdBy: admin._id
    },
    {
      title: 'City Marathon',
      description: 'Annual charity marathon',
      date: new Date('2026-11-01T08:00:00.000Z'),
      city: 'Brisbane',
      venue: 'River Walk',
      capacity: 200,
      category: categories[2]._id,
      createdBy: admin._id
    }
  ];

  await Event.insertMany(events);

  console.log('Seed completed');
  console.log('Admin credentials: admin@eventpulse.com / Admin123');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

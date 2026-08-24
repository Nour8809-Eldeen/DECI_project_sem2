const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../../models/User', () => ({
  findById: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn()
}));

jest.mock('../../models/Category', () => ({
  findById: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
  deleteMany: jest.fn()
}));

jest.mock('../../models/Event', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  deleteMany: jest.fn()
}));

const app = require('../../app');
const User = require('../../models/User');
const Category = require('../../models/Category');
const Event = require('../../models/Event');

let adminToken;
const categoryId = '507f1f77bcf86cd799439011';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'testsecret';

  User.findById.mockImplementation(() => ({
    select: jest.fn().mockResolvedValue({ _id: 'admin123', name: 'Test Admin', role: 'admin' })
  }));

  Category.findById.mockResolvedValue({ _id: categoryId, name: 'Music' });
  Category.create.mockResolvedValue({ _id: categoryId, name: 'Music' });

  Event.create.mockImplementation(async (data) => ({ _id: 'event123', ...data }));
  Event.findById.mockImplementation(() => ({
    populate: jest.fn().mockResolvedValue({ _id: 'event123', title: 'Test Event', category: { name: 'Music' } })
  }));
  Event.find.mockImplementation(() => ({
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockResolvedValue([{ _id: 'event123', title: 'Test Event', category: { name: 'Music' } }])
  }));
  Event.countDocuments.mockResolvedValue(1);

  adminToken = jwt.sign({ id: 'admin123', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Events API', () => {
  it('creates an event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Event',
        description: 'A test event',
        date: '2026-09-10T10:00:00.000Z',
        city: 'Perth',
        venue: 'Arena',
        capacity: 50,
        category: categoryId
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test Event');
  });

  it('lists events', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('filters events by city and category', async () => {
    const res = await request(app).get(`/api/events?city=Perth&category=${categoryId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('returns validation failure for invalid create payload', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: '', description: '', date: 'bad-date', city: '', venue: '', capacity: 0, category: 'invalid' });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
  });
});

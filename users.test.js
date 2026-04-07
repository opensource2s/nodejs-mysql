const request = require('supertest');
const app = require('../src/app');

// Mock the DB pool so tests run without a real database
jest.mock('../src/config/db', () => {
  const mockPool = {
    query: jest.fn(),
    connect: jest.fn((cb) => cb(null, {}, jest.fn())),
  };
  return mockPool;
});

const pool = require('../src/config/db');

// Mock createUsersTable
jest.mock('../src/models/userModel', () => ({
  createUsersTable: jest.fn().mockResolvedValue(true),
  UserModel: {
    findAll:  jest.fn(),
    findById: jest.fn(),
    create:   jest.fn(),
    update:   jest.fn(),
    delete:   jest.fn(),
  },
}));

const { UserModel } = require('../src/models/userModel');

const mockUser = { id: 1, name: 'Alice', email: 'alice@example.com', age: 28 };

describe('Health Check', () => {
  it('GET /health → 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });
});

describe('Users API', () => {
  afterEach(() => jest.clearAllMocks());

  it('GET /api/users → returns list', async () => {
    UserModel.findAll.mockResolvedValue([mockUser]);
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /api/users/:id → returns user', async () => {
    UserModel.findById.mockResolvedValue(mockUser);
    const res = await request(app).get('/api/users/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.email).toBe('alice@example.com');
  });

  it('GET /api/users/:id → 404 if not found', async () => {
    UserModel.findById.mockResolvedValue(null);
    const res = await request(app).get('/api/users/999');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/users → creates user', async () => {
    UserModel.create.mockResolvedValue(mockUser);
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@example.com', age: 28 });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.name).toBe('Alice');
  });

  it('POST /api/users → 400 on invalid data', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: '', email: 'not-an-email' });
    expect(res.statusCode).toBe(400);
  });

  it('PUT /api/users/:id → updates user', async () => {
    UserModel.update.mockResolvedValue({ ...mockUser, name: 'Bob' });
    const res = await request(app)
      .put('/api/users/1')
      .send({ name: 'Bob' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.name).toBe('Bob');
  });

  it('DELETE /api/users/:id → deletes user', async () => {
    UserModel.delete.mockResolvedValue(mockUser);
    const res = await request(app).delete('/api/users/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User deleted');
  });
});

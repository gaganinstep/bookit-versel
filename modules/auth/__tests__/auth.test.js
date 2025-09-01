const request = require('supertest');
const app = require('../../../index'); // updated to app.js (not index.js)
const { getAllModels } = require('../../../middlewares/loadModels');

let sequelize;
let User;

beforeAll(async () => {
  const models = await getAllModels(process.env.DB_TYPE); // returns all models + sequelize
  sequelize = models.sequelize;
  User = models.User;

  if (!sequelize) {
    throw new Error('Sequelize instance not loaded from getAllModels');
  }

});

afterAll(async () => {
  await sequelize.close(); // Clean shutdown
});

describe('POST /api/v1/users/register', () => {

  it('should register a user successfully', async () => {
    
    const res = await request(app).post('/api/v1/users/register').send({
      full_name: 'Test User',
      email: 'testuser@example.com',
      phone: '+911234567098',
      password: 'SecurePass123!',
    });

    

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Registeration successful');
    expect(res.body.data.user).toHaveProperty('email', 'testuser@example.com');
  });

  it('should return 400 if email already exists', async () => {
    await request(app).post('/api/v1/users/register').send({
      full_name: 'Test User',
      email: 'duplicate@example.com',
      phone: '+911234567891',
      password: 'pass1234',
    });

    const res = await request(app).post('/api/v1/users/register').send({
      full_name: 'Another User',
      email: 'duplicate@example.com',
      phone: '+911234567892',
      password: 'pass5678',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/email already exist/i);
  });

  it('should return 400 if phone already exists', async () => {
    await request(app).post('/api/v1/users/register').send({
      full_name: 'User One',
      email: 'userone@example.com',
      phone: '+911234567893',
      password: 'pass1111',
    });

    const res = await request(app).post('/api/v1/users/register').send({
      full_name: 'User Two',
      email: 'usertwo@example.com',
      phone: '+911234567893',
      password: 'pass2222',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/phone already exist/i);
  });

  it('should return 400 for invalid data', async () => {
    const res = await request(app).post('/api/v1/users/register').send({
      full_name: '',
      email: 'not-an-email',
      phone: '',
      password: '',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBeDefined(); // You can refine this based on your validation messages
  });
});

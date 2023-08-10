const mongoose = require('mongoose');
const supertest = require('supertest');
// const helper = require('./test_helper.js');
const app = require('../app.js');
const api = supertest(app);

const User = require('../models/user');

beforeEach(async () => {
  await User.deleteMany({});
});

describe('addition of a user', () => {
  test('invalid users are not created and invalid creation returns status code 400 and an error message', async () => {
    const newUser = {
      username: 'Nu',
      name: 'Nu',
      password: 'Test'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);
    
    expect(result.body.error)
      .toContain('username and password must be at least 3 characters long');
  }, 100000);
});

afterAll(() => {
  mongoose.connection.close();
});

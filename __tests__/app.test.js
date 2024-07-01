const pool = require('../db/connection')
const app = require('../app');
const request = require('supertest');
const seedDatabase = require('../db/seed');



beforeEach(() => {
  return seedDatabase();
});

afterAll(async () => { 
  await pool.query('DELETE FROM users WHERE username IN (?, ?)',
   ['testuser1', 'testuser2']);
  await pool.end();
});


describe('GET api users', () => {
    test('GET:200 sends an array of users to the client, each of which should have the properties of username, name and avatar_url', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          console.log(users)
          expect(Array.isArray(users)).toBe(true);
          expect(users).toHaveLength(2);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              email: expect.any(String),
             password_hash: expect.any(String),
            });
          });
        });
    });
  });
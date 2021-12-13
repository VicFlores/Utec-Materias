import request from 'supertest';
import app from '../src';
import { pool } from '../src/database';
import { Iuser } from '../src/interfaces/Iuser';
import { User } from '../src/services/user.service';

const service = new User();

const newUser: Iuser = {
  firstname: 'Vic',
  lastname: 'Flores',
  email: 'nutriafeliz@gmail.com',
  passwd: 'abc12345',
};

const loginUser = {
  email: 'nutriafeliz@gmail.com',
  passwd: 'abc12345',
};

const fields = [{}, { email: 'vicescobar@gmail.com' }, { passwd: 'abc12345' }];

const delMockUser = async (email: string) => {
  await pool.query('DELETE FROM users WHERE email = $1', [email]);
};

beforeAll(async () => {
  await service.createUser(newUser);
});

describe('POST /login', () => {
  describe('Given all fields', () => {
    test('should respond with 200 status code', async () => {
      const res = await request(app).post('/api/v1/login').send(loginUser);
      expect(res.status).toBe(200);
    });

    test('should have a content-type of application/json in header', async () => {
      const res = await request(app).post('/api/v1/login').send(loginUser);
      expect(res.headers['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    test('should respond with all fields required', async () => {
      const res = await request(app).post('/api/v1/login').send(loginUser);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBeDefined();
    });
  });

  describe('When some field missing', () => {
    for (const body of fields) {
      test('should respond with 404 status code', async () => {
        const res = await request(app).post('/api/v1/login').send(body);
        expect(res.status).toBe(400);
      });
    }
  });
});

afterAll(async () => {
  await delMockUser(newUser.email);
  pool.end();
});

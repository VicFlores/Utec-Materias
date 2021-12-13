import app from '../src/';
import request from 'supertest';
import { pool } from '../src/database';
import { User } from '../src/services/user.service';
import { Iuser } from '../src/interfaces/Iuser';
import { Auth } from '../src/services/auth.service';

const userService = new User();
const authService = new Auth();

const newGeneralUser: Iuser = {
  firstname: 'Katherine',
  lastname: 'Mendoza',
  email: 'mendoza@gmail.com',
  passwd: 'abc12345',
};

const newSpecificUser: Iuser = {
  firstname: 'Carlos',
  lastname: 'Santana',
  email: 'santana@gmail.com',
  passwd: 'abc12345',
};

const updateUser = {
  firstname: 'Manuel',
  lastname: 'Santana',
  email: 'santana@gmail.com',
};

const fields = [
  {},
  { firstname: 'Vic' },
  { lastname: 'Flores' },
  { email: 'vicflores@gmail.com' },
  { passwd: 'xyz6789' },
];

beforeAll(async () => {
  await userService.createUser(newGeneralUser);
});

const getUserId = async (email: string) => {
  const response = await userService.findUserByEmail(email);
  const userId = response.rows[0].id;
  return userId;
};

const authLogin = async (email: string, password: string) => {
  const userLogin = await authService.LoginUser(email, password);
  return userLogin;
};

const deleteMockUser = async (email: string) => {
  await pool.query('DELETE FROM users WHERE email = $1', [email]);
};

describe('GET /users', () => {
  test('should respond with a 200 status code', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const res = await request(app).get('/api/v1/users');
    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const res = await request(app).get('/api/v1/users');

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].firstname).toBeDefined();
    expect(res.body[0].lastname).toBeDefined();
    expect(res.body[0].email).toBeDefined();
  });
});

describe('GET /users/:id', () => {
  test('should respond with 200 status code', async () => {
    const userId = await getUserId(newGeneralUser.email);
    const userLogin = await authLogin(
      newGeneralUser.email,
      newGeneralUser.passwd
    );
    const res = await request(app)
      .get(`/api/v1/users/specific/${userId}`)
      .set({ token: `${userLogin.token}` });

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const userId = await getUserId(newGeneralUser.email);
    const userLogin = await authLogin(
      newGeneralUser.email,
      newGeneralUser.passwd
    );
    const res = await request(app)
      .get(`/api/v1/users/specific/${userId}`)
      .set({ token: `${userLogin.token}` });

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const userId = await getUserId(newGeneralUser.email);
    const userLogin = await authLogin(
      newGeneralUser.email,
      newGeneralUser.passwd
    );
    const res = await request(app)
      .get(`/api/v1/users/specific/${userId}`)
      .set({ token: `${userLogin.token}` });

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const userId = await getUserId(newGeneralUser.email);
    const userLogin = await authLogin(
      newGeneralUser.email,
      newGeneralUser.passwd
    );
    const res = await request(app)
      .get(`/api/v1/users/specific/${userId}`)
      .set({ token: `${userLogin.token}` });

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].firstname).toBeDefined();
    expect(res.body[0].lastname).toBeDefined();
    expect(res.body[0].email).toBeDefined();
  });
});

describe('POST /users', () => {
  describe('Given all fields', () => {
    test('should respond with a 201 status code', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send(newSpecificUser);

      expect(res.status).toBe(201);
      await deleteMockUser(newSpecificUser.email);
    });

    test('should have a content-type of application/json in header', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send(newSpecificUser);

      expect(res.header['content-type']).toEqual(
        expect.stringContaining('json')
      );
      await deleteMockUser(newSpecificUser.email);
    });

    test('should respond a user created message', async () => {
      const res = await request(app)
        .post('/api/v1/users')
        .send(newSpecificUser);

      expect(res.body).toEqual('User created');
      await deleteMockUser(newSpecificUser.email);
    });
  });

  describe('When some field missing', () => {
    for (const body of fields) {
      test('should respond with 404 status code', async () => {
        const res = await request(app).post('/api/v1/users').send(body);
        expect(res.status).toBe(400);
      });
    }
  });
});

describe('PUT /users/:id', () => {
  test('should respond with a 200 status code', async () => {
    const userId = await getUserId(newGeneralUser.email);
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send(updateUser);

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const userId = await getUserId(updateUser.email);
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send(updateUser);

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with a modified message', async () => {
    const userId = await getUserId(updateUser.email);
    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send(updateUser);

    expect(res.body).toEqual('User modified successfully');
  });
});

describe('PUT /special/users/:id', () => {
  test('should respond with 200 status code', async () => {
    const userId = await getUserId(updateUser.email);
    const res = await request(app)
      .put(`/api/v1/users/special/${userId}`)
      .send({ roles: 'admin' });

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const userId = await getUserId(updateUser.email);
    const res = await request(app)
      .put(`/api/v1/users/special/${userId}`)
      .send({ roles: 'admin' });

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with a modified message', async () => {
    const userId = await getUserId(updateUser.email);
    const res = await request(app)
      .put(`/api/v1/users/special/${userId}`)
      .send({ roles: 'admin' });

    expect(res.body).toEqual('User modified successfully');
  });
});

describe('DELETE /users/:id', () => {
  test('should respond with all statements', async () => {
    const userId = await getUserId(updateUser.email);
    const res = await request(app).delete(`/api/v1/users/${userId}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual('User deleted successfully');
  });
});

afterAll(async () => {
  pool.end();
});

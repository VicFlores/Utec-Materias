import request from 'supertest';
import app from '../src/';
import { pool } from '../src/database';
import { Ifaculty } from '../src/interfaces/Ifaculty';
import { Faculty } from '../src/services/faculty.service';

const service = new Faculty();

const newGeneralFaculty: Ifaculty = {
  name: 'Facultad de informatica y ciencias aplicadas',
  school: 'Escuela de ciencias aplicadas',
};

const newSpecificFaculty: Ifaculty = {
  name: 'Facultad de derecho',
  school: 'Escuela ciencias sociales ',
};

const updateFaculty: Ifaculty = {
  name: 'Facultad de informatica y ciencias aplicadas',
  school: 'Escuela de Informática',
};

const fields = [{}, { name: 'Name Test' }, { school: 'School Test' }];

beforeAll(async () => {
  await pool.query('INSERT INTO faculties (name, school) VALUES ($1, $2)', [
    newGeneralFaculty.name,
    newGeneralFaculty.school,
  ]);
});

const getFacultyId = async (faculty: Ifaculty) => {
  const getFaculty = await service.findFacultyByNameAndSchool(
    faculty.name,
    faculty.school
  );

  const faculties = getFaculty[0].id;
  return faculties;
};

const delMockFaculty = async (faculty: Ifaculty) => {
  await pool.query('DELETE FROM faculties WHERE name = $1 AND school = $2', [
    faculty.name,
    faculty.school,
  ]);
};

describe('GET /faculties', () => {
  test('should respond with 200 status code', async () => {
    const res = await request(app).get('/api/v1/faculties');

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const res = await request(app).get('/api/v1/faculties');

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const res = await request(app).get('/api/v1/faculties');

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should content all fields', async () => {
    const res = await request(app).get('/api/v1/faculties');

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].name).toBeDefined();
    expect(res.body[0].school).toBeDefined();
  });
});

describe('GET /faculties/:id', () => {
  test('should respond with 200 status code', async () => {
    const facultyId = await getFacultyId(newGeneralFaculty);
    const res = await request(app).get(
      `/api/v1/faculties/specific/${facultyId}`
    );

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const facultyId = await getFacultyId(newGeneralFaculty);
    const res = await request(app).get(
      `/api/v1/faculties/specific/${facultyId}`
    );

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const facultyId = await getFacultyId(newGeneralFaculty);
    const res = await request(app).get(
      `/api/v1/faculties/specific/${facultyId}`
    );

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const facultyId = await getFacultyId(newGeneralFaculty);
    const res = await request(app).get(
      `/api/v1/faculties/specific/${facultyId}`
    );

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].name).toBeDefined();
    expect(res.body[0].school).toBeDefined();
  });
});

describe('POST /faculties', () => {
  describe('Given all fields', () => {
    test('should respond with 200 status code', async () => {
      const res = await request(app)
        .post('/api/v1/faculties')
        .send(newSpecificFaculty);

      expect(res.status).toBe(201);
      await delMockFaculty(newSpecificFaculty);
    });

    test('should have a content-type of application/json in header', async () => {
      const res = await request(app)
        .post('/api/v1/faculties')
        .send(newSpecificFaculty);

      expect(res.header['content-type']).toEqual(
        expect.stringContaining('json')
      );
      await delMockFaculty(newSpecificFaculty);
    });

    test('should respond with a faculty created message', async () => {
      const res = await request(app)
        .post('/api/v1/faculties')
        .send(newSpecificFaculty);

      expect(res.body).toEqual('Faculty created successfully');
      await delMockFaculty(newSpecificFaculty);
    });
  });

  describe('When some field missing', () => {
    for (const body of fields) {
      test('should respond with 400 status code', async () => {
        const res = await request(app).post('/api/v1/faculties').send(body);

        expect(res.status).toBe(400);
      });
    }
  });
});

describe('PUT /faculties/:id', () => {
  test('should responde with 200 status code', async () => {
    const facultyId = await getFacultyId(newGeneralFaculty);
    const res = await request(app)
      .put(`/api/v1/faculties/${facultyId}`)
      .send(updateFaculty);

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const facultyId = await getFacultyId(updateFaculty);
    const res = await request(app)
      .put(`/api/v1/faculties/${facultyId}`)
      .send(updateFaculty);

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with modified message', async () => {
    const facultyId = await getFacultyId(updateFaculty);
    const res = await request(app)
      .put(`/api/v1/faculties/${facultyId}`)
      .send(updateFaculty);

    expect(res.body).toEqual('Faculty modified successfully');
  });
});

describe('DELETE /faculties/:id', () => {
  test('should respond with all statements', async () => {
    const facultyId = await getFacultyId(updateFaculty);
    const res = await request(app).delete(`/api/v1/faculties/${facultyId}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual('Faculty deleted successfully');
  });
});

afterAll(async () => {
  pool.end();
});

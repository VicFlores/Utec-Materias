import request from 'supertest';
import app from '../src';
import { pool } from '../src/database';
import { Subject } from '../src/services/subject.service';

const service = new Subject();

const newGeneralSubject = {
  name: 'Programación IV',
  cod_subject: 'PROG4-I0302-2021',
};

const newSpecificSubject = {
  name: 'Redes II',
  cod_subject: 'REDII-I0302-2021',
};

const updateSubject = {
  name: 'Programación III',
  cod_subject: 'PROG3-I0302-2021',
};

const fields = [
  {},
  { name: 'Programación IV' },
  { cod_subject: 'PROG4-I0302-2021' },
];

beforeAll(async () => {
  await pool.query('INSERT INTO subjects (name, cod_subject) VALUES ($1, $2)', [
    newGeneralSubject.name,
    newGeneralSubject.cod_subject,
  ]);
});

const getSubjectId = async (codeSubject: string) => {
  const getSubject = await service.findSubjectByCode(codeSubject);
  const subjectID = getSubject[0].id;
  return subjectID;
};

const delMockSubject = async (codSubject: string) => {
  await pool.query('DELETE FROM subjects WHERE cod_subject = $1', [codSubject]);
};

describe('GET /subjects', () => {
  test('should respond with a 200 status code', async () => {
    const res = await request(app).get('/api/v1/subjects');
    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const res = await request(app).get('/api/v1/subjects');
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const res = await request(app).get('/api/v1/subjects');

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].name).toBeDefined();
    expect(res.body[0].cod_subject).toBeDefined();
  });
});

describe('GET /specific/:id', () => {
  test('should respond with a 200 status code', async () => {
    const subjectId = await getSubjectId(newGeneralSubject.cod_subject);
    const res = await request(app).get(
      `/api/v1/subjects/specific/${subjectId}`
    );

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const subjectId = await getSubjectId(newGeneralSubject.cod_subject);
    const res = await request(app).get(
      `/api/v1/subjects/specific/${subjectId}`
    );
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with a arrays type ', async () => {
    const subjectId = await getSubjectId(newGeneralSubject.cod_subject);
    const res = await request(app).get(
      `/api/v1/subjects/specific/${subjectId} `
    );

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const subjectId = await getSubjectId(newGeneralSubject.cod_subject);
    const res = await request(app).get(
      `/api/v1/subjects/specific/${subjectId} `
    );

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].name).toBeDefined();
    expect(res.body[0].cod_subject).toBeDefined();
  });
});

describe('POST /subjects', () => {
  describe('Given all fields', () => {
    test('should respond with a 200 status code', async () => {
      const res = await request(app)
        .post('/api/v1/subjects')
        .send(newSpecificSubject);
      expect(res.status).toBe(200);
      await delMockSubject(newSpecificSubject.cod_subject);
    });

    test('should have a content-type of application(json in header', async () => {
      const res = await request(app)
        .post('/api/v1/subjects')
        .send(newSpecificSubject);
      expect(res.header['content-type']).toEqual(
        expect.stringContaining('json')
      );
      await delMockSubject(newSpecificSubject.cod_subject);
    });

    test('should respond with subject created message', async () => {
      const res = await request(app)
        .post('/api/v1/subjects')
        .send(newSpecificSubject);
      expect(res.body).toEqual('Subject created successfully');
      await delMockSubject(newSpecificSubject.cod_subject);
    });
  });

  describe('When some field missing', () => {
    for (const body of fields) {
      test('should respond with 400 status code', async () => {
        const res = await request(app).post('/api/v1/subjects').send(body);
        expect(res.status).toBe(400);
      });
    }
  });
});

describe('PUT /subjects/:id', () => {
  test('should respond with 200 status code', async () => {
    const subjectId = await getSubjectId(newGeneralSubject.cod_subject);
    const res = await request(app)
      .put(`/api/v1/subjects/specific/${subjectId}`)
      .send(updateSubject);

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const subjectId = await getSubjectId(updateSubject.cod_subject);
    const res = await request(app)
      .put(`/api/v1/subjects/specific/${subjectId} `)
      .send(updateSubject);

    expect(res.headers['content-type']).toEqual(
      expect.stringContaining('json')
    );
  });

  test('should respond with modified message', async () => {
    const subjectId = await getSubjectId(updateSubject.cod_subject);
    const res = await request(app)
      .put(`/api/v1/subjects/specific/${subjectId} `)
      .send(updateSubject);

    expect(res.body).toEqual('Subject modified successfully');
  });
});

describe('DELETE /subjects/:id', () => {
  test('should respond with all statements', async () => {
    const subjectId = await getSubjectId(updateSubject.cod_subject);
    const res = await request(app).delete(`/api/v1/subjects/${subjectId} `);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual('Subject deleted successfully');
  });
});

afterAll(async () => {
  pool.end();
});

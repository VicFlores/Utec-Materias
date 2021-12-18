import request from 'supertest';
import app from '../src/';
import { pool } from '../src/database';
import { Itimestamp } from '../src/interfaces/Itimestamp';
import { TimeStamp } from '../src/services/timeStamp.service';

const service = new TimeStamp();

const newGeneralTimeStamp: Itimestamp = {
  start: '14-05-2021',
  finish: '14-05-2021',
  students: 45,
};

const newSpecificTimeStamp: Itimestamp = {
  start: '25-12-2021',
  finish: '25-12-2021',
  students: 69,
};

const updateTimeStamp: Itimestamp = {
  start: '14-05-2021',
  finish: '14-05-2021',
  students: 80,
};

const fields = [
  {},
  { start: '22-07-2021' },
  { finish: '22-07-2021' },
  { students: 85 },
];

beforeAll(async () => {
  await pool.query(
    'INSERT INTO time_stamp (start, finish, students) VALUES ($1, $2, $3)',
    [
      newGeneralTimeStamp.start,
      newGeneralTimeStamp.finish,
      newGeneralTimeStamp.students,
    ]
  );
});

const getTimeStampById = async (timeStamp: Itimestamp) => {
  const getTimeStamp = await service.findTimeStampByAllFields(timeStamp);
  const timeStampId = getTimeStamp[0].id;
  return timeStampId;
};

const delMockTimeStamp = async (timeStamp: Itimestamp) => {
  await pool.query(
    'DELETE FROM time_stamp WHERE start = $1 AND finish = $2 AND students = $3',
    [timeStamp.start, timeStamp.finish, timeStamp.students]
  );
};

describe('GET /timestamp', () => {
  test('should respond with 200 status code', async () => {
    const res = await request(app).get('/api/v1/timestamp');

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const res = await request(app).get('/api/v1/timestamp');

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const res = await request(app).get('/api/v1/timestamp');

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const res = await request(app).get('/api/v1/timestamp');

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].start).toBeDefined();
    expect(res.body[0].finish).toBeDefined();
    expect(res.body[0].students).toBeDefined();
  });
});

describe('GET /timestamp/:id', () => {
  test('should respond with 200 status code', async () => {
    const timestampId = await getTimeStampById(newGeneralTimeStamp);
    const res = await request(app).get(
      `/api/v1/timestamp/specific/${timestampId}`
    );

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const timestampId = await getTimeStampById(newGeneralTimeStamp);
    const res = await request(app).get(
      `/api/v1/timestamp/specific/${timestampId}`
    );

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const timestampId = await getTimeStampById(newGeneralTimeStamp);
    const res = await request(app).get(
      `/api/v1/timestamp/specific/${timestampId}`
    );

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const timestampId = await getTimeStampById(newGeneralTimeStamp);
    const res = await request(app).get(
      `/api/v1/timestamp/specific/${timestampId}`
    );

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].start).toBeDefined();
    expect(res.body[0].finish).toBeDefined();
    expect(res.body[0].students).toBeDefined();
  });
});

describe('POST /timestamp', () => {
  describe('Given all fields', () => {
    test('should respond with 200 status code', async () => {
      const res = await request(app)
        .post('/api/v1/timestamp')
        .send(newSpecificTimeStamp);

      expect(res.status).toBe(200);
      await delMockTimeStamp(newSpecificTimeStamp);
    });

    test('should have a content-type of application/json in header', async () => {
      const res = await request(app)
        .post('/api/v1/timestamp')
        .send(newSpecificTimeStamp);

      expect(res.header['content-type']).toEqual(
        expect.stringContaining('json')
      );
      await delMockTimeStamp(newSpecificTimeStamp);
    });

    test('should respond with created message', async () => {
      const res = await request(app)
        .post('/api/v1/timestamp')
        .send(newSpecificTimeStamp);

      expect(res.body).toEqual('TimeStamp created successfully');
      await delMockTimeStamp(newSpecificTimeStamp);
    });
  });

  describe('When some field missing', () => {
    for (const body of fields) {
      test('should respond with 400 status code', async () => {
        const res = await request(app).post('/api/v1/timestamp').send(body);
        expect(res.status).toBe(400);
      });
    }
  });
});

describe('PUT /timestamp/:id', () => {
  test('should respond with a 200 status code', async () => {
    const timestampId = await getTimeStampById(newGeneralTimeStamp);
    const res = await request(app)
      .put(`/api/v1/timestamp/${timestampId}`)
      .send(updateTimeStamp);

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const timestampId = await getTimeStampById(updateTimeStamp);
    const res = await request(app)
      .put(`/api/v1/timestamp/${timestampId}`)
      .send(updateTimeStamp);

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with a modified message', async () => {
    const timestampId = await getTimeStampById(updateTimeStamp);
    const res = await request(app)
      .put(`/api/v1/timestamp/${timestampId}`)
      .send(updateTimeStamp);

    expect(res.body).toEqual('Time Stamp modified successfully');
  });
});

describe('DELETE /timestamp/:id', () => {
  test('should respond with all statements', async () => {
    const timestampId = await getTimeStampById(updateTimeStamp);
    const res = await request(app).delete(`/api/v1/timestamp/${timestampId}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual('Time Stamp deleted successfully');
  });
});

afterAll(async () => {
  pool.end();
});

import request from 'supertest';
import app from '../src/';
import { pool } from '../src/database';
import { Imodality } from '../src/interfaces/Imodality';
import { Modality } from '../src/services/modality.service';

const service = new Modality();

const newGeneralModality: Imodality = {
  type: 'Virtual',
  class_type: 'https://teams-url-class-example',
};

const newSpecificModality: Imodality = {
  type: 'Presencial',
  class_type: 'BJ-4',
};

const updateModality: Imodality = {
  type: 'Virtual',
  class_type: 'https://google-meats',
};

const fields = [{}, { type: 'Presencial' }, { class: 'FM-3' }];

beforeAll(async () => {
  await pool.query(
    'INSERT INTO modalities (type, class_type) VALUES ($1, $2)',
    [newGeneralModality.type, newGeneralModality.class_type]
  );
});

const getModalityId = async (classType: string) => {
  const getModality = await service.findModalityByClassType(classType);
  const modality = getModality[0].id;
  return modality;
};

const delMockModality = async (classType: string) => {
  await pool.query('DELETE FROM modalities WHERE class_type = $1', [classType]);
};

describe('GET /modalities', () => {
  test('should respond with a 200 status code', async () => {
    const res = await request(app).get('/api/v1/modalities');

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const res = await request(app).get('/api/v1/modalities');

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const res = await request(app).get('/api/v1/modalities');
    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const res = await request(app).get('/api/v1/modalities');

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].type).toBeDefined();
    expect(res.body[0].class_type).toBeDefined();
  });
});

describe('GET /modalities/:id', () => {
  test('should respond with 200 status code', async () => {
    const modalityId = await getModalityId(newGeneralModality.class_type);
    const res = await request(app).get(
      `/api/v1/modalities/specific/${modalityId}`
    );

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const modalityId = await getModalityId(newGeneralModality.class_type);
    const res = await request(app).get(
      `/api/v1/modalities/specific/${modalityId}`
    );

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with a arrays type', async () => {
    const modalityId = await getModalityId(newGeneralModality.class_type);
    const res = await request(app).get(
      `/api/v1/modalities/specific/${modalityId}`
    );

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const modalityId = await getModalityId(newGeneralModality.class_type);
    const res = await request(app).get(
      `/api/v1/modalities/specific/${modalityId}`
    );

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].type).toBeDefined();
    expect(res.body[0].class_type).toBeDefined();
  });
});

describe('POST /modalities', () => {
  describe('Given all fields', () => {
    test('should respond with 201 status code', async () => {
      const res = await request(app)
        .post('/api/v1/modalities')
        .send(newSpecificModality);

      expect(res.status).toBe(201);
      await delMockModality(newSpecificModality.class_type);
    });

    test('should have a content-type of application/json in header', async () => {
      const res = await request(app)
        .post('/api/v1/modalities')
        .send(newSpecificModality);

      expect(res.header['content-type']).toEqual(
        expect.stringContaining('json')
      );
      await delMockModality(newSpecificModality.class_type);
    });

    test('should a modality created message', async () => {
      const res = await request(app)
        .post('/api/v1/modalities')
        .send(newSpecificModality);

      expect(res.body).toEqual('Modality created successfully');
      await delMockModality(newSpecificModality.class_type);
    });
  });

  describe('When some field missing', () => {
    for (const body of fields) {
      test('should respond with 400 status code', async () => {
        const res = await request(app).post('/api/v1/modalities').send(body);
        expect(res.status).toBe(400);
      });
    }
  });
});

describe('PUT /modalities/:id', () => {
  test('should respond with a 200 status code', async () => {
    const modalityId = await getModalityId(newGeneralModality.class_type);
    const res = await request(app)
      .put(`/api/v1/modalities/${modalityId}`)
      .send(updateModality);

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const modalityId = await getModalityId(updateModality.class_type);
    const res = await request(app)
      .put(`/api/v1/modalities/${modalityId}`)
      .send(updateModality);

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with a modified message', async () => {
    const modalityId = await getModalityId(updateModality.class_type);
    const res = await request(app)
      .put(`/api/v1/modalities/${modalityId}`)
      .send(updateModality);

    expect(res.body).toEqual('Modality modified successfully');
  });
});

describe('DELETE /modalities/:id', () => {
  test('should respond with all statements', async () => {
    const modalityId = await getModalityId(updateModality.class_type);
    const res = await request(app).delete(`/api/v1/modalities/${modalityId}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual('Section deleted successfully');
  });
});

afterAll(async () => {
  pool.end();
});

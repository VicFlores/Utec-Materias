import app from '../src/';
import request from 'supertest';
import { pool } from '../src/database';
import { Section } from '../src/services/section.service';
import { Isection } from '../src/interfaces/Isection';

const service = new Section();

const newGeneralSection: Isection = {
  sections: 69,
  hours: '8:00-9:30',
  days: 'Lun-Vie',
};

const newSpecificSection: Isection = {
  sections: 28,
  hours: '1:00-2:30',
  days: 'Mar-Jue',
};

const updateSection = {
  sections: 36,
  hours: '8:00-9:30',
  days: 'Mar-Jue',
};

const fields = [{}, { sections: 3 }, { hours: '1:00-4:00' }, { days: 'Sab' }];

beforeAll(async () => {
  await pool.query(
    'INSERT INTO sections (sections, hours, days) VALUES ($1, $2, $3)',
    [
      newGeneralSection.sections,
      newGeneralSection.hours,
      newGeneralSection.days,
    ]
  );
});

const getSectionId = async (number: number) => {
  const getSection = await service.findSectionByNumber(number);
  const sectionID = getSection[0].id;
  return sectionID;
};

const delMockSection = async (section: Isection) => {
  await pool.query('DELETE FROM sections WHERE sections = $1 ', [
    section.sections,
  ]);
};

describe('GET /sections', () => {
  test('should respond with 200 status code', async () => {
    const res = await request(app).get('/api/v1/sections');
    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const res = await request(app).get('/api/v1/sections');
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const res = await request(app).get('/api/v1/sections');
    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const res = await request(app).get('/api/v1/sections');

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].sections).toBeDefined();
    expect(res.body[0].hours).toBeDefined();
    expect(res.body[0].days).toBeDefined();
  });
});

describe('GET /sections/:id', () => {
  test('should respond with 200 status code', async () => {
    const sectionId = await getSectionId(newGeneralSection.sections);
    const res = await request(app).get(
      `/api/v1/sections/specific/${sectionId}`
    );

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const sectionId = await getSectionId(newGeneralSection.sections);
    const res = await request(app).get(
      `/api/v1/sections/specific/${sectionId}`
    );

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with a arrays type ', async () => {
    const sectionId = await getSectionId(newGeneralSection.sections);
    const res = await request(app).get(
      `/api/v1/sections/specific/${sectionId} `
    );

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const sectionId = await getSectionId(newGeneralSection.sections);
    const res = await request(app).get(
      `/api/v1/sections/specific/${sectionId} `
    );

    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].sections).toBeDefined();
    expect(res.body[0].hours).toBeDefined();
    expect(res.body[0].days).toBeDefined();
  });
});

describe('POST /sections', () => {
  describe('Given all fields', () => {
    test('should respond with 201 status code', async () => {
      const res = await request(app)
        .post('/api/v1/sections')
        .send(newSpecificSection);

      expect(res.status).toBe(201);
      await delMockSection(newSpecificSection);
    });

    test('should have a content-type of application/json in header', async () => {
      const res = await request(app)
        .post('/api/v1/sections')
        .send(newSpecificSection);
      expect(res.header['content-type']).toEqual(
        expect.stringContaining('json')
      );
      await delMockSection(newSpecificSection);
    });

    test('should respond a user created message', async () => {
      const res = await request(app)
        .post('/api/v1/sections')
        .send(newSpecificSection);
      expect(res.body).toEqual('Section created');
      await delMockSection(newSpecificSection);
    });
  });

  describe('When some field missing', () => {
    for (const body of fields) {
      test('should respond with 400 status code', async () => {
        const res = await request(app).post('/api/v1/sections').send(body);
        expect(res.status).toBe(400);
      });
    }
  });
});

describe('PUT /sections/:id', () => {
  test('should respond with a 200 status code', async () => {
    const sectionId = await getSectionId(newGeneralSection.sections);
    const res = await request(app)
      .put(`/api/v1/sections/${sectionId}`)
      .send(updateSection);

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const sectionId = await getSectionId(updateSection.sections);
    const res = await request(app)
      .put(`/api/v1/sections/${sectionId}`)
      .send(updateSection);

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with a modified message', async () => {
    const sectionId = await getSectionId(updateSection.sections);
    const res = await request(app)
      .put(`/api/v1/sections/${sectionId}`)
      .send(updateSection);

    expect(res.body).toEqual('Section modified successfully');
  });
});

describe('DELETE /sections/:id', () => {
  test('should respond with all statements', async () => {
    const sectionId = await getSectionId(updateSection.sections);
    const res = await request(app).delete(`/api/v1/sections/${sectionId}`);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual('Section deleted successfully');
  });
});

afterAll(async () => {
  pool.end();
});

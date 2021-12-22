import request from 'supertest';
import app from '../src';
import { pool } from '../src/database';
import { IclassDetail } from '../src/interfaces/IclassDetail';
import { Ifaculty } from '../src/interfaces/Ifaculty';
import { Imodality } from '../src/interfaces/Imodality';
import { Isection } from '../src/interfaces/Isection';
import { Iuser } from '../src/interfaces/Iuser';
import { ClassDetail } from '../src/services/classDetail.service';
import { Faculty } from '../src/services/faculty.service';
import { Modality } from '../src/services/modality.service';
import { Section } from '../src/services/section.service';
import { Subject } from '../src/services/subject.service';
import { User } from '../src/services/user.service';

const serviceClassDetail = new ClassDetail();
const serviceUser = new User();
const serviceSubject = new Subject();
const serviceSection = new Section();
const serviceModality = new Modality();
const serviceFaculty = new Faculty();

const newGeneralUser: Iuser = {
  firstname: 'Katherine',
  lastname: 'Mendoza',
  email: 'mendoza@gmail.com',
  passwd: 'abc12345',
};

const newGeneralSubject = {
  name: 'Programación IV',
  cod_subject: 'PROG4-I0302-2021',
};

const newGeneralSection: Isection = {
  sections: 69,
  hours: '8:00-9:30',
  days: 'Lun-Vie',
};

const newGeneralModality: Imodality = {
  type: 'Virtual',
  class_type: 'https://teams-url-class-example',
};

const newGeneralFaculty: Ifaculty = {
  name: 'Facultad de informatica y ciencias aplicadas',
  school: 'Escuela de ciencias aplicadas',
};

const fields = [
  {},
  { inscribed: 96 },
  { id_user: 'Test class detail' },
  { id_subject: 'Test class detail' },
  { id_section: 'Test class detail' },
  { id_modality: 'Test class detail' },
  { id_faculty: 'Test class detail' },
];

beforeAll(async () => {
  await pool.query(
    'INSERT INTO users (firstname, lastname, email, passwd) VALUES ($1, $2, $3, $4)',
    [
      newGeneralUser.firstname,
      newGeneralUser.lastname,
      newGeneralUser.email,
      newGeneralUser.passwd,
    ]
  );

  await pool.query('INSERT INTO subjects (name, cod_subject) VALUES ($1, $2)', [
    newGeneralSubject.name,
    newGeneralSubject.cod_subject,
  ]);

  await pool.query(
    'INSERT INTO sections (sections, hours, days) VALUES ($1, $2, $3)',
    [
      newGeneralSection.sections,
      newGeneralSection.hours,
      newGeneralSection.days,
    ]
  );

  await pool.query(
    'INSERT INTO modalities (type, class_type) VALUES ($1, $2)',
    [newGeneralModality.type, newGeneralModality.class_type]
  );

  await pool.query('INSERT INTO faculties (name, school) VALUES ($1, $2)', [
    newGeneralFaculty.name,
    newGeneralFaculty.school,
  ]);

  const classDetail = await newClassDetail();

  await pool.query(
    `INSERT INTO class_detail (inscribed, id_user, id_subject, id_section, id_modality, id_faculty) 
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      classDetail.inscribed,
      classDetail.idUser,
      classDetail.idSubject,
      classDetail.idSection,
      classDetail.idModality,
      classDetail.idFaculty,
    ]
  );
});

const newClassDetail = async (): Promise<IclassDetail> => {
  const userDB = await serviceUser.findUserByEmail(newGeneralUser.email);
  const userId = userDB.rows[0].id;

  const getSubject = await serviceSubject.findSubjectByCode(
    newGeneralSubject.cod_subject
  );

  const subjectId = getSubject[0].id;

  const getSection = await serviceSection.findSectionByNumber(
    newGeneralSection.sections
  );

  const sectionId = getSection[0].id;

  const getModality = await serviceModality.findModalityByClassType(
    newGeneralModality.class_type
  );

  const modalityId = getModality[0].id;

  const getFaculty = await serviceFaculty.findFacultyByNameAndSchool(
    newGeneralFaculty.name,
    newGeneralFaculty.school
  );

  const facultyId = getFaculty[0].id;

  return {
    inscribed: 70,
    idUser: userId,
    idSubject: subjectId,
    idSection: sectionId,
    idModality: modalityId,
    idFaculty: facultyId,
  };
};

const getClassDetailId = async () => {
  const classDetailId = await serviceClassDetail.findClassDetailByEmail(
    newGeneralUser.email
  );
  return classDetailId[0].id;
};

const delMockInfo = async () => {
  await pool.query('DELETE FROM class_detail WHERE inscribed = $1', [70]);

  await pool.query('DELETE FROM users WHERE email = $1', [
    newGeneralUser.email,
  ]);

  await pool.query('DELETE FROM subjects WHERE cod_subject = $1', [
    newGeneralSubject.cod_subject,
  ]);

  await pool.query('DELETE FROM sections WHERE sections = $1 ', [
    newGeneralSection.sections,
  ]);

  await pool.query('DELETE FROM modalities WHERE class_type = $1', [
    newGeneralModality.class_type,
  ]);

  await pool.query('DELETE FROM faculties WHERE name = $1 AND school = $2', [
    newGeneralFaculty.name,
    newGeneralFaculty.school,
  ]);
};

describe('GET /classdetail', () => {
  test('should respond with 200 status code', async () => {
    const res = await request(app).get('/api/v1/classdetail');

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const res = await request(app).get('/api/v1/classdetail');

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const res = await request(app).get('/api/v1/classdetail');

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const res = await request(app).get('/api/v1/classdetail');

    expect(res.body[0].id);
    expect(res.body[0].firstname);
    expect(res.body[0].lastname);
    expect(res.body[0].email);
    expect(res.body[0].name);
    expect(res.body[0].cod_subject);
    expect(res.body[0].sections);
    expect(res.body[0].hours);
    expect(res.body[0].days);
    expect(res.body[0].type);
    expect(res.body[0].class_type);
    expect(res.body[0].name);
    expect(res.body[0].school);
  });
});

describe('GET /classdetail/:id', () => {
  test('should respond with 200 status code', async () => {
    const classDetailId = await getClassDetailId();
    const res = await request(app).get(
      `/api/v1/classdetail/specific/${classDetailId}`
    );

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const classDetailId = await getClassDetailId();
    const res = await request(app).get(
      `/api/v1/classdetail/specific/${classDetailId}`
    );

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should with arrays type', async () => {
    const classDetailId = await getClassDetailId();
    const res = await request(app).get(
      `/api/v1/classdetail/specific/${classDetailId}`
    );

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const classDetailId = await getClassDetailId();
    const res = await request(app).get(
      `/api/v1/classdetail/specific/${classDetailId}`
    );

    expect(res.body[0].id);
    expect(res.body[0].firstname);
    expect(res.body[0].lastname);
    expect(res.body[0].email);
    expect(res.body[0].name);
    expect(res.body[0].cod_subject);
    expect(res.body[0].sections);
    expect(res.body[0].hours);
    expect(res.body[0].days);
    expect(res.body[0].type);
    expect(res.body[0].class_type);
    expect(res.body[0].name);
    expect(res.body[0].school);
  });
});

describe('POST /classdetail', () => {
  describe('Given all fields', () => {
    test('should respond with 200 status code', async () => {
      const classDetail = await newClassDetail();
      const res = await request(app)
        .post('/api/v1/classdetail')
        .send(classDetail);

      expect(res.status).toBe(200);
    });

    test('should have a content-type of application/json in header', async () => {
      const classDetail = await newClassDetail();
      const res = await request(app)
        .post('/api/v1/classdetail')
        .send(classDetail);

      expect(res.header['content-type']).toEqual(
        expect.stringContaining('json')
      );
    });

    test('should respond with created message', async () => {
      const classDetail = await newClassDetail();
      const res = await request(app)
        .post('/api/v1/classdetail')
        .send(classDetail);

      expect(res.body).toEqual('Class detail created successfully');
    });
  });

  describe('When some field missing', () => {
    for (const body of fields) {
      test('should respond with 400 status code', async () => {
        const res = await request(app).post('/api/v1/classdetail').send(body);
        expect(res.status).toBe(400);
      });
    }
  });
});

afterAll(async () => {
  await delMockInfo();
  pool.end();
});

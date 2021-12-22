import request from 'supertest';
import app from '../src';
import { pool } from '../src/database';
import { IclassDetail } from '../src/interfaces/IclassDetail';
import { Ifaculty } from '../src/interfaces/Ifaculty';
import { Imodality } from '../src/interfaces/Imodality';
import { Isection } from '../src/interfaces/Isection';
import { Itimestamp } from '../src/interfaces/Itimestamp';
import { Iuser } from '../src/interfaces/Iuser';
import { ClassDetail } from '../src/services/classDetail.service';
import { Faculty } from '../src/services/faculty.service';
import { Historial } from '../src/services/historial.service';
import { Modality } from '../src/services/modality.service';
import { Section } from '../src/services/section.service';
import { Subject } from '../src/services/subject.service';
import { TimeStamp } from '../src/services/timeStamp.service';
import { User } from '../src/services/user.service';

const serviceClassDetail = new ClassDetail();
const serviceUser = new User();
const serviceSubject = new Subject();
const serviceSection = new Section();
const serviceModality = new Modality();
const serviceFaculty = new Faculty();
const serviceTimeStamp = new TimeStamp();
const serviceHistorial = new Historial();

const newGeneralUser: Iuser = {
  firstname: 'Katherine',
  lastname: 'Mendoza',
  email: 'mendozaa@gmail.com',
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

const newGeneralTimeStamp: Itimestamp = {
  start: '14-05-2021',
  finish: '14-05-2021',
  students: 45,
};

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

  await pool.query(
    'INSERT INTO time_stamp (start, finish, students) VALUES ($1, $2, $3)',
    [
      newGeneralTimeStamp.start,
      newGeneralTimeStamp.finish,
      newGeneralTimeStamp.students,
    ]
  );

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

  const historial = await newHistorial();

  await pool.query(
    `INSERT INTO historial (id_class_detail, id_time_stamp)
        VALUES ($1, $2)`,
    [historial.classDetailId, historial.timeStampId]
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
    inscribed: 45,
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

const getTimeStampById = async (timeStamp: Itimestamp) => {
  const getTimeStamp = await serviceTimeStamp.findTimeStampByAllFields(
    timeStamp
  );
  const timeStampId = getTimeStamp[0].id;
  return timeStampId;
};

const newHistorial = async () => {
  const classDetailId = await getClassDetailId();
  const timeStampId = await getTimeStampById(newGeneralTimeStamp);

  return {
    classDetailId,
    timeStampId,
  };
};

const getHistorial = async () => {
  const { classDetailId } = await newHistorial();
  const historialId = await serviceHistorial.findHistorialByClassDetailId(
    classDetailId
  );

  return {
    historialId: historialId[0].id_historial,
    classDetailID: historialId[0].id,
  };
};

const delMockInfo = async () => {
  const classDetailId = await getClassDetailId();
  const { classDetailID } = await getHistorial();

  await pool.query('DELETE FROM historial WHERE id_class_detail = $1', [
    classDetailID,
  ]);

  await pool.query('DELETE FROM class_detail WHERE id = $1', [classDetailId]);

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

  await pool.query(
    'DELETE FROM time_stamp WHERE start = $1 AND finish = $2 AND students = $3',
    [
      newGeneralTimeStamp.start,
      newGeneralTimeStamp.finish,
      newGeneralTimeStamp.students,
    ]
  );
};

describe('GET /historial', () => {
  test('should respond with 200 status code', async () => {
    const res = await request(app).get('/api/v1/historial');

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const res = await request(app).get('/api/v1/historial');

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const res = await request(app).get('/api/v1/historial');

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const res = await request(app).get('/api/v1/historial');

    expect(res.body[0].id_historial);
    expect(res.body[0].id_time_stamp);
    expect(res.body[0].id);
    expect(res.body[0].inscribed);
    expect(res.body[0].id_user);
    expect(res.body[0].id_Subject);
    expect(res.body[0].id_section);
    expect(res.body[0].id_modality);
    expect(res.body[0].id_faculty);
  });
});

describe('GET /historial', () => {
  test('should respond with 200 status code', async () => {
    const { historialId } = await getHistorial();
    const res = await request(app).get(
      `/api/v1/historial/specific/${historialId}`
    );

    expect(res.status).toBe(200);
  });

  test('should have a content-type of application/json in header', async () => {
    const { historialId } = await getHistorial();
    const res = await request(app).get(
      `/api/v1/historial/specific/${historialId}`
    );

    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
  });

  test('should respond with arrays type', async () => {
    const { historialId } = await getHistorial();
    const res = await request(app).get(
      `/api/v1/historial/specific/${historialId}`
    );

    expect(res.body).toBeInstanceOf(Array);
  });

  test('should respond with all fields', async () => {
    const { historialId } = await getHistorial();
    const res = await request(app).get(
      `/api/v1/historial/specific/${historialId}`
    );

    expect(res.body[0].id_historial);
    expect(res.body[0].id_time_stamp);
    expect(res.body[0].id);
    expect(res.body[0].inscribed);
    expect(res.body[0].id_user);
    expect(res.body[0].id_Subject);
    expect(res.body[0].id_section);
    expect(res.body[0].id_modality);
    expect(res.body[0].id_faculty);
  });
});

describe('POST /historial', () => {
  test('should respond with 200 status code', async () => {
    const { classDetailId, timeStampId } = await newHistorial();
    const res = await request(app)
      .post('/api/v1/historial')
      .send({ id_class_detail: classDetailId, id_time_stamp: timeStampId });

    console.log('describe: ', classDetailId, timeStampId);

    expect(res.status).toBe(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual('Historial created successfully');
  });
});

afterAll(async () => {
  await delMockInfo();
  pool.end();
});

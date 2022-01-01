import { QueryResult } from 'pg';
import { pool } from '../database';
import { httpException } from '../exception/httpException';
import { IclassDetail } from '../interfaces/IclassDetail';

export class ClassDetail {
  async classDetails() {
    const res: QueryResult = await pool.query(
      ` SELECT 	class_detail.id, 
          users.firstname, users.lastname, users.email, 
          subjects.name,
          sections.sections, sections.hours, sections.days,
          modalities.type, modalities.class_type
        
        FROM class_detail 
          INNER JOIN users ON users.id = class_detail.id_user
          INNER JOIN subjects ON subjects.id = class_detail.id_subject
          INNER JOIN sections ON sections.id = class_detail.id_section
          INNER JOIN modalities ON modalities.id = class_detail.id_modality
      `
    );

    return res.rows;
  }

  async findClassDetailByEmail(email: string) {
    const res: QueryResult = await pool.query(
      ` SELECT class_detail.id, users.email  FROM class_detail 
          INNER JOIN users ON users.id = class_detail.id_user
        WHERE users.email = $1 `,

      [email]
    );

    return res.rows;
  }

  async findClassDetailById(id: string) {
    const res: QueryResult = await pool.query(
      `SELECT class_detail.id, 
        users.email, 
        subjects.cod_subject,
        sections.sections, sections.hours, sections.days,
        modalities.type, modalities.class_type,
        faculties.name, faculties.school
        
      FROM class_detail 
        INNER JOIN users ON users.id = class_detail.id_user
        INNER JOIN subjects ON subjects.id = class_detail.id_subject
        INNER JOIN sections ON sections.id = class_detail.id_section
        INNER JOIN modalities ON modalities.id = class_detail.id_modality
        INNER JOIN faculties ON faculties.id = class_detail.id_faculty
      
      WHERE
        class_detail.id = $1`,

      [id]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Class detail not found');
    }

    return res.rows;
  }

  async createClassDetail(body: IclassDetail) {
    await pool.query(
      `INSERT INTO class_detail (inscribed, id_user, id_subject, id_section, id_modality, id_faculty)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        body.inscribed,
        body.idUser,
        body.idSubject,
        body.idSection,
        body.idModality,
        body.idFaculty,
      ]
    );

    return 'Class detail created successfully';
  }
}

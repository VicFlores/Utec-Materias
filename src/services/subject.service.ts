import { QueryResult } from 'pg';
import { pool } from '../database';
import { httpException } from '../exception/httpException';
import { Isubjects } from '../interfaces/Isubject';

export class Subject {
  async findSubjects() {
    const res = await pool.query('SELECT * FROM subjects');
    return res.rows;
  }

  async findSubjectById(id: string) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM subjects WHERE id = $1',
      [id]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Subject not found');
    }

    return res.rows;
  }

  async findSubjectByCode(codeSubject: string) {
    const res = await pool.query(
      'SELECT * FROM subjects WHERE cod_subject = $1 ',
      [codeSubject]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Code subject not found');
    }

    return res.rows;
  }

  async createSubject(body: Isubjects) {
    await pool.query(
      'INSERT INTO subjects (name, cod_subject) VALUES ($1, $2)',
      [body.name, body.cod_subject]
    );

    return 'Subject created successfully';
  }

  async updateSubject(id: string, body: Isubjects) {
    await this.findSubjectById(id);
    await pool.query(
      'UPDATE subjects set name = $1, cod_subject = $2 WHERE id = $3 ',
      [body.name, body.cod_subject, id]
    );

    return 'Subject modified successfully';
  }

  async deleteSubject(id: string) {
    await this.findSubjectById(id);
    await pool.query('DELETE FROM subjects WHERE id = $1', [id]);

    return 'Subject deleted successfully';
  }
}

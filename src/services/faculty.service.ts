import { QueryResult } from 'pg';
import { pool } from '../database';
import { Ifaculty } from '../interfaces/Ifaculty';
import { httpException } from '../exception/httpException';

export class Faculty {
  async findFaculties() {
    const res: QueryResult = await pool.query('SELECT * FROM faculties');
    return res.rows;
  }

  async findFacultyById(id: string) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM faculties WHERE id = $1',
      [id]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Faculty not found');
    }

    return res.rows;
  }

  async findFacultyByNameAndSchool(name: string, school: string) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM faculties WHERE name = $1 AND school = $2',
      [name, school]
    );

    return res.rows;
  }

  async createFaculty(body: Ifaculty) {
    await pool.query('INSERT INTO faculties (name, school) VALUES ($1, $2)', [
      body.name,
      body.school,
    ]);

    return 'Faculty created successfully';
  }

  async updateFaculty(id: string, body: Ifaculty) {
    await this.findFacultyById(id);
    await pool.query(
      'UPDATE faculties SET name = $1, school = $2 WHERE id = $3',
      [body.name, body.school, id]
    );

    return 'Faculty modified successfully';
  }

  async deleteFaculty(id: string) {
    await this.findFacultyById(id);
    await pool.query('DELETE FROM faculties WHERE id = $1', [id]);

    return 'Faculty deleted successfully';
  }
}

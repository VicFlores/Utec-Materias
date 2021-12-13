import { QueryResult } from 'pg';
import { pool } from '../database';
import { httpException } from '../exception/httpException';
import { Isection } from '../interfaces/Isection';

export class Section {
  async findSections() {
    const res: QueryResult = await pool.query('SELECT * FROM sections');
    return res.rows;
  }

  async findSectionById(id: string) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM sections WHERE id = $1',
      [id]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Section not found');
    }

    return res.rows;
  }

  async findSectionByNumber(section: number) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM sections WHERE sections = $1',
      [section]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Section number not found');
    }

    return res.rows;
  }

  async createSection(body: Isection) {
    await pool.query(
      'INSERT INTO sections (sections, hours, days) VALUES ($1, $2, $3)',
      [body.sections, body.hours, body.days]
    );

    return 'Section created';
  }

  async updateSection(id: string, body: Isection) {
    await this.findSectionById(id);
    await pool.query(
      'UPDATE sections set sections = $1, hours = $2, days = $3 WHERE id = $4 ',
      [body.sections, body.hours, body.days, id]
    );

    return 'Section modified successfully';
  }

  async deleteSection(id: string) {
    await this.findSectionById(id);
    await pool.query('DELETE FROM sections WHERE id = $1', [id]);

    return 'Section deleted successfully';
  }
}

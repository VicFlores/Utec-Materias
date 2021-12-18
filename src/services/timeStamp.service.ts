import { QueryResult } from 'pg';
import { pool } from '../database';
import { httpException } from '../exception/httpException';
import { Itimestamp } from '../interfaces/Itimestamp';

export class TimeStamp {
  async findTimeStamps() {
    const res: QueryResult = await pool.query('SELECT * FROM time_stamp');
    return res.rows;
  }

  async findTimeStampById(id: string) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM time_stamp WHERE id = $1',
      [id]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Time Stamp not found');
    }

    return res.rows;
  }

  async findTimeStampByAllFields(timeStamp: Itimestamp) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM time_stamp WHERE start = $1 AND finish = $2 AND students = $3 ',
      [timeStamp.start, timeStamp.finish, timeStamp.students]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Time Stamp not found');
    }

    return res.rows;
  }

  async createTimeStamp(body: Itimestamp) {
    await pool.query(
      'INSERT INTO time_stamp (start, finish, students) VALUES ($1, $2, $3)',
      [body.start, body.finish, body.students]
    );

    return 'TimeStamp created successfully';
  }

  async updateTimeStamp(id: string, body: Itimestamp) {
    await this.findTimeStampById(id);
    await pool.query(
      'UPDATE time_stamp SET start = $1, finish = $2, students = $3 WHERE id = $4',
      [body.start, body.finish, body.students, id]
    );

    return 'Time Stamp modified successfully';
  }

  async deleteTimeStamp(id: string) {
    await this.findTimeStampById(id);
    await pool.query('DELETE FROM time_stamp WHERE id = $1', [id]);

    return 'Time Stamp deleted successfully';
  }
}

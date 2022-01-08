import { QueryResult } from 'pg';
import { pool } from '../database';
import { httpException } from '../exception/httpException';
import { Itimestamp } from '../interfaces/Itimestamp';

export class TimeStamp {
  async findTimeStamps() {
    const res: QueryResult = await pool.query(
      `SELECT * FROM public.time_stamp
        INNER JOIN public.class_detail ON public.class_detail.id = public.time_stamp.id_class_detail
      `
    );
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
      'INSERT INTO time_stamp (start, id_class_detail) VALUES ($1, $2)',
      [body.start, body.idClassDetail]
    );

    return 'TimeStamp created successfully';
  }

  async updateTimeStamp(id: string, body: Itimestamp) {
    await this.findTimeStampById(id);
    await pool.query(
      'UPDATE time_stamp SET finish = $1, students = $2 WHERE id = $3',
      [body.finish, body.students, id]
    );

    return 'Time Stamp modified successfully';
  }

  async deleteTimeStamp(id: string) {
    await this.findTimeStampById(id);
    await pool.query('DELETE FROM time_stamp WHERE id = $1', [id]);

    return 'Time Stamp deleted successfully';
  }
}

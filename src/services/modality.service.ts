import { QueryResult } from 'pg';
import { pool } from '../database';
import { httpException } from '../exception/httpException';
import { Imodality } from '../interfaces/Imodality';

export class Modality {
  async findModalities() {
    const res: QueryResult = await pool.query('SELECT * FROM modalities');
    return res.rows;
  }

  async findModalityById(id: string) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM modalities WHERE id = $1',
      [id]
    );

    if (res.rowCount == 0) {
      throw new httpException(404, 'Modality not found');
    }

    return res.rows;
  }

  async findModalityByClassType(classType: string) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM modalities WHERE class_type = $1',
      [classType]
    );

    if (res.rowCount == 0) {
      throw new httpException(404, 'Modality not found');
    }

    return res.rows;
  }

  async createModality(body: Imodality) {
    await pool.query(
      'INSERT INTO modalities (type, class_type) VALUES ($1, $2)',
      [body.type, body.class_type]
    );

    return 'Modality created successfully';
  }

  async updateModality(id: string, body: Imodality) {
    await this.findModalityById(id);
    await pool.query(
      'UPDATE modalities SET type = $1, class_type = $2 WHERE id = $3',
      [body.type, body.class_type, id]
    );

    return 'Modality modified successfully';
  }

  async deleteModality(id: string) {
    await this.findModalityById(id);
    await pool.query('DELETE FROM modalities WHERE id = $1', [id]);

    return 'Section deleted successfully';
  }
}

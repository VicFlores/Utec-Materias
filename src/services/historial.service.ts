import { QueryResult } from 'pg';
import { pool } from '../database';
import { httpException } from '../exception/httpException';
import { Ihistorial } from '../interfaces/Ihistorial';

export class Historial {
  async findHistories() {
    const res: QueryResult = await pool.query(
      `SELECT 
            historial.id_historial,
            historial.id_time_stamp,
            class_detail.id,
            class_detail.inscribed,
            class_detail.id_user,
            class_detail.id_Subject,
            class_detail.id_section,
            class_detail.id_modality,
            class_detail.id_faculty

        FROM historial
            INNER JOIN class_detail ON class_detail.id = historial.id_class_detail`
    );

    return res.rows;
  }

  async findHistorialById(id: string) {
    const res: QueryResult = await pool.query(
      ` SELECT * FROM historial
          INNER JOIN class_detail ON class_detail.id = historial.id_class_detail
            
        WHERE historial.id_historial = $1 `,
      [id]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Historial not found');
    }

    return res.rows;
  }

  async findHistorialByClassDetailId(idClassDetail: string) {
    const res: QueryResult = await pool.query(
      `SELECT historial.id_historial, class_detail.id
  
          FROM historial
            INNER JOIN class_detail ON class_detail.id = historial.id_class_detail
            
        WHERE 
            historial.id_class_detail = $1 `,
      [idClassDetail]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'Historial not found');
    }

    return res.rows;
  }

  async createHistorial(body: Ihistorial) {
    await pool.query(
      'INSERT INTO historial (id_class_detail, id_time_stamp) VALUES ($1, $2)',
      [body.id_class_detail, body.id_time_stamp]
    );

    return 'Historial created successfully';
  }
}

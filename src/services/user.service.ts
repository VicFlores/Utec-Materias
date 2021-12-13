import { QueryResult } from 'pg';
import bcrypt from 'bcrypt';
import { pool } from '../database';
import { httpException } from '../exception/httpException';
import { Iuser } from '../interfaces/Iuser';

export class User {
  async findUsers() {
    const res: QueryResult = await pool.query('SELECT * FROM users');
    return res.rows;
  }

  async findUserById(id: string) {
    const res: QueryResult = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (res.rowCount === 0) {
      throw new httpException(404, 'User not found');
    }

    return res.rows;
  }

  async findUserByEmail(email: string) {
    const response: QueryResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return response;
  }

  async createUser(body: Iuser) {
    const hash = await bcrypt.hash(body.passwd, 10);
    const res: QueryResult = await this.findUserByEmail(body.email);

    if (res.rowCount === 1) {
      throw new httpException(400, 'Duplicate email ');
    }

    await pool.query(
      'INSERT INTO users (firstname, lastname, email, passwd) VALUES ($1, $2, $3, $4)',
      [body.firstname, body.lastname, body.email, hash]
    );

    return 'User created';
  }

  async updateUser(id: string, body: Iuser) {
    await this.findUserById(id);
    await pool.query(
      'UPDATE users set firstname = $1, lastname = $2, email = $3 WHERE id = $4 ',
      [body.firstname, body.lastname, body.email, id]
    );

    return 'User modified successfully';
  }

  async updateSpecialUser(id: string, body: Iuser) {
    await this.findUserById(id);
    await pool.query('UPDATE users set roles = $1 WHERE id = $2', [
      body.roles,
      id,
    ]);

    return 'User modified successfully';
  }

  async deleteUser(id: string) {
    await this.findUserById(id);
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return 'User deleted successfully';
  }
}

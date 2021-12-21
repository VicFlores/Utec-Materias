import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { httpException } from '../exception/httpException';
import { Iuser } from '../interfaces/Iuser';
import { User } from './user.service';

const service = new User();

export class Auth {
  async LoginUser(email: string, pass: string) {
    const res = await service.findUserByEmail(email);

    if (res.rowCount === 0) {
      throw new httpException(404, 'User! or password incorrect');
    }

    const { passwd, id } = res.rows[0];

    const isMatch = await bcrypt.compare(pass, passwd);

    if (!isMatch) throw new httpException(404, 'User or password! incorrect');

    const payload = {
      sub: id,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
      expiresIn: '12h',
    });

    res.rows.map((user) => {
      delete user.passwd;
    });

    return {
      user: res.rows,
      token,
    };
  }
}

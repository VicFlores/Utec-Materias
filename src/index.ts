import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import routerApi from './routes';
import { handleError } from './middleware/handleErrors';

dotenv.config({ path: './.env' });

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());

routerApi(app);

app.use(handleError);

export default app;

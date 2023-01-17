import dotenv from 'dotenv';
import express from 'express';

import { usersRouter } from './routes';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

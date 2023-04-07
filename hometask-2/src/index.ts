import dotenv from 'dotenv';
import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { serviceMethodLogger } from './middleware/serviceMethodLogger';
import process from 'node:process';

import { groupsRouter, usersRouter } from './routes';

import { logger } from './services/logger';
import { setupErrorHandlers } from './process';

dotenv.config();

const app = express();
const port = 3000;

setupErrorHandlers();

app.use(express.json());
app.use(serviceMethodLogger);

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);

app.use(errorHandler);

app.listen(port, () => {
    logger.info({ label: 'server', message: `Example app listening on port ${port}.` });
});

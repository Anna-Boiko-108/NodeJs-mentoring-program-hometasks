import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { serviceMethodLogger } from './middleware/serviceMethodLogger';
import cors from 'cors';

import { groupsRouter, loginRouter, usersRouter } from './routes';

import { logger } from './services/logger';
import { setupErrorHandlers } from './process';
import { config } from './config';
import { checkToken } from './middleware/checkToken';

const app = express();
const port = config.PORT;

app.use(cors());
setupErrorHandlers();

app.use(express.json());
app.use(serviceMethodLogger);

app.use('/login', loginRouter);

app.use('/users', usersRouter);
app.use('/groups', groupsRouter);
app.use(errorHandler);

app.listen(port, () => {
    logger.info({ label: 'server', message: `Example app listening on port ${port}.` });
});

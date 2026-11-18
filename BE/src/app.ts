import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { getEnv } from './configs/env';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { catalogRoutes } from './modules/catalog/catalog.routes';
import { identityRoutes } from './modules/identity/identity.routes';

const env = getEnv();
const app: Application = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

if (env.NODE_ENV !== 'test') app.use(morgan('dev'));

app.get('/health', (_request, response) => {
    response.status(200).json({
        success: true,
        data: { status: 'ok', service: 'BloomCraft Backend' },
    });
});

app.use('/api/v1/identity', identityRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import { errorHandler } from './middlewares/error.middleware';
// import { identityRoutes } from './modules/identity/identity.routes';

const app: Application = express();

// 1. Global Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// if (process.env.NODE_ENV !== 'production') {
//     app.use(morgan('dev'));
// }

// // 2. Health check route
// app.get('/health', (_req: Request, res: Response) => {
//     res.status(200).json({
//         status: 'ok',
//         service: 'BloomCraft Backend',
//         timestamp: new Date().toISOString(),
//     });
// });

// // 3. API Routes
// app.use('/api/v1/identity', identityRoutes);
// // Các module sau sẽ gắn tiếp tại đây:
// // app.use('/api/v1/catalog', catalogRoutes);
// // app.use('/api/v1/inventory', inventoryRoutes);
// // app.use('/api/v1/commerce', commerceRoutes);

// // 4. 404 Handler cho các route không tồn tại
// app.use((_req: Request, res: Response) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route không tồn tại',
//     });
// });

// 5. Global Error Handler (bắt buộc đặt cuối cùng)
// app.use(errorHandler);

export default app;
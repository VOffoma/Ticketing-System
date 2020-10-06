import { Router, Request, Response } from 'express';
import authRouter from './auth/authRouter';
import userRouter from './users/userRouter';
import ticketRouter from './tickets/ticketRouter';

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/users', userRouter);
routes.use('/tickets', ticketRouter);

routes.get('/', (request: Request, response: Response) => {
	response.json({ message: 'V1' });
});

export default routes;

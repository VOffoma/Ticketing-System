import { Router } from 'express';
import ticketRouter from './tickets/ticketRouter';

const routes = Router();

routes.use('/tickets', ticketRouter);

routes.get('/', (req, res) => {
	res.json({ message: 'V1' });
});

export default routes;

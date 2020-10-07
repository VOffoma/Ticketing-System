import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import routes from './components/routes';
import errorMessages from '../utils/errorMessages';
import logger from '../utils/logger';

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1', routes);

/// catch 404 and forward to error handler
app.use((request: Request, response: Response, next: NextFunction) => {
	const error = new createError.NotFound(errorMessages.MESSAGE_RESOURCE_NOT_FOUND);
	next(error);
});

app.use((error, request: Request, response: Response, next: NextFunction) => {
	response.status(error.status || error.statusCode || 500);
	response.json({
		message: error.message
		//stack: error.stack
	});
});

process.on('uncaughtException', (error) => {
	logger.error(error);
	process.exit(1);
});

process.on('unhandledRejection', (error) => {
	logger.error(error);
	process.exit(1);
});

export default app;

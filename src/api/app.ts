import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import createError from 'http-errors';
import { ValidationError } from 'express-validation';
import routes from './components/routes';

const app: express.Application = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1', routes);

/// catch 404 and forward to error handler
app.use((request: Request, response: Response, next: NextFunction) => {
	const error = createError(404, 'The path you seek does not exist');
	next(error);
});

app.use((error, request: Request, response: Response, next: NextFunction) => {
	let validationErrorMessage;
	if (error instanceof ValidationError) {
		const validationErrorDetails = error.details[0];
		const validationErrorKey = Object.keys(validationErrorDetails)[0];
		validationErrorMessage = validationErrorDetails[validationErrorKey];
	}
	response.status(error.status || error.statusCode || 500);
	response.json({
		message: validationErrorMessage || error.message,
		stack: error.stack
	});
});

export default app;

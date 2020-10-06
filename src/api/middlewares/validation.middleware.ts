import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import express, { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
	return (request: Request, response: Response, next: NextFunction) => {
		validate(plainToClass(type, request.body), { skipMissingProperties }).then(
			(errors: ValidationError[]) => {
				if (errors.length > 0) {
					const message = errors
						.map((error: ValidationError) => Object.values(error.constraints!))
						.join(', ');

					next(new createError.UnprocessableEntity(message));
				} else {
					next();
				}
			}
		);
	};
}

export default validationMiddleware;

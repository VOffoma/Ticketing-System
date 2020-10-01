import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import roles from './roles';

const grantAccess = function (action: string, resource: string) {
	return async (request: Request, response: Response, next: NextFunction) => {
		try {
			const permission = roles.can(request.currentUser.role)[action](resource);
			if (!permission.granted) {
				next(createError(403, "You don't have enough permission to perform this action"));
			}
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default grantAccess;
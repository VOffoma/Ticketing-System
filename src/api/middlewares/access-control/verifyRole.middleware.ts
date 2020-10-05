import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

function checkRole(roles: Array<string>) {
	return async (request: Request, response: Response, next: NextFunction) => {
		const currentUser = request.currentUser;

		if (!currentUser || roles.length === 0) {
			return next(
				createError(403, "You don't have enough permission to perform this action")
			);
		}

		//Check if array of authorized roles includes the user's role
		if (roles.indexOf(currentUser.role) > -1) {
			return next();
		}
		return next(createError(403, "You don't have enough permission to perform this action"));
	};
}

export default checkRole;

import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import errorMessages from '../../../utils/errorMessages';

function checkRole(roles: Array<string>) {
	return async (request: Request, response: Response, next: NextFunction) => {
		const currentUser = request.currentUser;

		if (!currentUser || roles.length === 0) {
			return next(
				new createError.Forbidden(errorMessages.MESSAGE_YOU_DONT_HAVE_REQUIRED_PERMISSIONS)
			);
		}

		//Check if array of authorized roles includes the user's role
		if (roles.indexOf(currentUser.role) > -1) {
			return next();
		}
		return next(
			new createError.Forbidden(errorMessages.MESSAGE_YOU_DONT_HAVE_REQUIRED_PERMISSIONS)
		);
	};
}

export default checkRole;

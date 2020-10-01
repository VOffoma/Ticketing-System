import JWT from 'jsonwebtoken';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import config from '../../config';
import { User } from '../components/users/user.model';

/**
 *
 * @param token
 * @returns user
 */
async function verifyTokenAndReturnUser(token) {
	const payload = await JWT.verify(token, config.JWTSecret);
	const user = await User.findOne({ _id: payload.sub });
	return user;
}

/**
 *
 * @param request
 * @param response
 * @param next
 * @description this middleware ensure that the a user is authenticated before access to certain routes is granted
 */
async function verifyAuthentication(request: Request, response: Response, next: NextFunction) {
	try {
		const token = request.headers['x-access-token'];
		if (!token) {
			next(createError(401, 'Please login to access this route'));
		}

		const authenticatedUser = await verifyTokenAndReturnUser(token);
		if (!authenticatedUser) {
			next(createError(401, 'Please login to access this route'));
		}
		request.currentUser = authenticatedUser;
		next();
	} catch (error) {
		next(createError(401, 'Please login to access this route'));
	}
}

export default verifyAuthentication;

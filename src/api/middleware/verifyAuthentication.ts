import JWT from 'jsonwebtoken';
import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import config from '../../config';
import { User } from '../components/users/user.model';

const verifyTokenAndReturnUser = async (token) => {
	const payload = await JWT.verify(token, config.JWTSecret);
	const user = await User.findOne({ _id: payload.sub });
	return user;
};

const verifyAuthentication = async (request: Request, response: Response, next: NextFunction) => {
	try {
		const token = request.headers['x-access-token'];
		if (!token) {
			next(createError(401, 'Please login to access this route'));
		}
		request.currentUser = await verifyTokenAndReturnUser(token);
		next();
	} catch (error) {
		next(createError(401, 'Please login to access this route'));
	}
};

export default verifyAuthentication;

import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import authService from './auth.service';
import validationMiddleware from '../../middlewares/validation.middleware';
import { CreateUserDto, UserCredentialsDto } from '../users/user.dto';

const authRouter = Router();

/**
 * Endpoint: http://localhost:{{port}}/api/v1/auth/signup
 * @description This endpoint exposes the functionality for registering a user
 */
authRouter.post(
	'/signup',
	validationMiddleware(CreateUserDto),
	asyncHandler(async (request: Request, response: Response) => {
		const signUpInfo: CreateUserDto = request.body;
		const registeredUser = await authService.registerUser(signUpInfo);
		response.status(201).send(registeredUser);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/auth/signin
 * @description This endpoint exposes the functionality for authenticating a user
 */
authRouter.post(
	'/signin',
	validationMiddleware(UserCredentialsDto),
	asyncHandler(async (request: Request, response: Response) => {
		const loginCredentials: UserCredentialsDto = request.body;
		const authInfo = await authService.authenticateUser(loginCredentials);
		response.status(200).send(authInfo);
	})
);

export default authRouter;

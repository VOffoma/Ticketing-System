import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import authService from './auth.service';
import { UserInputDTO, UserCredentialsDTO } from '../users/user.interface';

const authRouter = Router();

/**
 * Endpoint: http://localhost:{{port}}/api/v1/auth/signup
 * @description This endpoint exposes the functionality for registering a user
 */
authRouter.post(
	'/signup',
	asyncHandler(async (request: Request, response: Response) => {
		const signUpInfo: UserInputDTO = request.body;
		const newUser = await authService.registerUser(signUpInfo);
		response.status(201).send(newUser);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/auth/signin
 * @description This endpoint exposes the functionality for authenticating a user
 */
authRouter.post(
	'/signin',
	asyncHandler(async (request: Request, response: Response) => {
		const loginCredentials: UserCredentialsDTO = request.body;
		const authInfo = await authService.authenticateUser(loginCredentials);
		response.status(200).send(authInfo);
	})
);

export default authRouter;

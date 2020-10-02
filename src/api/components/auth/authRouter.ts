import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import authService from './auth.service';
import { UserInputDTO, UserCredentialsDTO } from '../users/user.interface';
import validationRules from '../users/user.validationRules';

const authRouter = Router();

/**
 * Endpoint: http://localhost:{{port}}/api/v1/auth/signup
 * @description This endpoint exposes the functionality for registering a user
 */
authRouter.post(
	'/signup',
	validate(validationRules.userRegistrationInfo, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const signUpInfo: UserInputDTO = request.body;
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
	validate(validationRules.userCredentials, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const loginCredentials: UserCredentialsDTO = request.body;
		const authInfo = await authService.authenticateUser(loginCredentials);
		response.status(200).send(authInfo);
	})
);

export default authRouter;

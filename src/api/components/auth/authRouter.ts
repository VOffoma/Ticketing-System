import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import authService from './auth.service';
import { UserInputDTO, UserCredentialsDTO } from '../users/user.interface';

const authRouter = Router();

authRouter.post(
	'/signup',
	asyncHandler(async (request: Request, response: Response) => {
		const signUpInfo: UserInputDTO = request.body;
		const newUser = await authService.registerUser(signUpInfo);
		response.status(201).send(newUser);
	})
);

authRouter.post(
	'/signin',
	asyncHandler(async (request: Request, response: Response) => {
		const loginCredentials: UserCredentialsDTO = request.body;
		const authInfo = await authService.authenticateUser(loginCredentials);
		response.status(200).send(authInfo);
	})
);

export default authRouter;

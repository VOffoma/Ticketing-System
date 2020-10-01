import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import userService from './user.service';
import verifyAuthentication from '../../middleware/verifyAuthentication';

const userRouter = Router();

userRouter.patch(
	'/updateUserRole',
	verifyAuthentication,
	asyncHandler(async (request: Request, response: Response) => {
		const result = await userService.updateUserRole(request.body);
		response.status(200).send(result);
	})
);

userRouter.patch(
	'/assignTicket',
	verifyAuthentication,
	asyncHandler(async (request: Request, response: Response) => {
		const result = await userService.assignTicketToSupport(request.body);
		response.status(200).send(result);
	})
);

export default userRouter;

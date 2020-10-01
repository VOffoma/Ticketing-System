import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import grantAccess from '../../middleware/RBAC/grantAccess';
import userService from './user.service';
import verifyAuthentication from '../../middleware/verifyAuthentication';

const userRouter = Router();

/**
 * Endpoint: http://localhost:{{port}}/api/v1/users/updateUserRole
 * @description This endpoint exposes the functionality for updating the role of a user
 */
userRouter.patch(
	'/updateUserRole',
	verifyAuthentication,
	grantAccess('updateAny', 'user'),
	asyncHandler(async (request: Request, response: Response) => {
		const result = await userService.updateUserRole(request.body);
		response.status(200).send(result);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/users/assignTicket
 * @description This endpoint exposes the functionality for assigning a ticket to a support person
 */
userRouter.patch(
	'/assignTicket',
	verifyAuthentication,
	grantAccess('updateAny', 'ticket'),
	asyncHandler(async (request: Request, response: Response) => {
		const result = await userService.assignTicketToSupport(request.body);
		response.status(200).send(result);
	})
);

export default userRouter;

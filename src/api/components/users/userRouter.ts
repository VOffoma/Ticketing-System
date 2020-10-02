import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import grantAccess from '../../middleware/RBAC/grantAccess';
import verifyAuthentication from '../../middleware/verifyAuthentication';
import userService from './user.service';
import validationRules from './user.validationRules';

const userRouter = Router();

/**
 * Endpoint: http://localhost:{{port}}/api/v1/users/updateUserRole
 * @description This endpoint exposes the functionality for updating the role of a user
 */
userRouter.patch(
	'/updateUserRole',
	verifyAuthentication,
	grantAccess('updateAny', 'user'),
	validate(validationRules.roleUpdate, { statusCode: 422, keyByField: true }, {}),
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
	validate(validationRules.ticketAssignment, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const result = await userService.assignTicketToSupport(request.body);
		response.status(200).send(result);
	})
);

export default userRouter;

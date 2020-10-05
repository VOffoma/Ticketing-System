import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import verifyAuthentication from '../../middlewares/verifyAuthentication.middleware';
import verifyRole from '../../middlewares/access-control/verifyRole.middleware';
import userService from './user.service';
import validationRules from './user.validationRules';

const userRouter = Router();

userRouter.use(verifyAuthentication);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/users/updateUserRole
 * @description This endpoint exposes the functionality for updating the role of a user
 */
userRouter.patch(
	'/updateUserRole',
	verifyRole(['ADMIN']),
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
	verifyRole(['ADMIN', 'SUPPORT']),
	validate(validationRules.ticketAssignment, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const result = await userService.assignTicketToSupport(request.body);
		response.status(200).send(result);
	})
);

export default userRouter;

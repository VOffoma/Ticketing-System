import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import validationMiddleware from '../../middlewares/validation.middleware';
import verifyAuthentication from '../../middlewares/verifyAuthentication.middleware';
import verifyRole from '../../middlewares/access-control/verifyRole.middleware';
import { RoleUpdateDto } from './user.dto';
import userService from './user.service';

const userRouter = Router();

userRouter.use(verifyAuthentication);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/users/updateUserRole
 * @description This endpoint exposes the functionality for updating the role of a user
 */
userRouter.patch(
	'/:userId(/^[a-fd]{24}$/i)',
	verifyRole(['ADMIN']),
	validationMiddleware(RoleUpdateDto),
	asyncHandler(async (request: Request, response: Response) => {
		const updatedUser = await userService.updateUserRole({
			newRole: request.body.newRole,
			userId: request.params.userId
		});
		response.status(200).send(updatedUser);
	})
);

export default userRouter;

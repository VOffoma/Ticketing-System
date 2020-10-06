import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import verifyAuthentication from '../../middlewares/verifyAuthentication.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import CreateCommentDto from './comment.dto';
import commentService from './comment.service';

const commentRouter = Router({ mergeParams: true });

commentRouter.use(verifyAuthentication);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketId/comments
 * @description This endpoint exposes the functionality for getting all comments made on a ticket
 */
commentRouter.get(
	'/',
	asyncHandler(async (request: Request, response: Response) => {
		const { _id, role } = request.currentUser;

		const comments = await commentService.getAllCommentsOnATicket(request.params.ticketId, {
			_id,
			role
		});
		response.status(200).send(comments);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketId/comments
 * @description This endpoint exposes the functionality for adding a comment to a ticket
 */

commentRouter.post(
	'/',
	validationMiddleware(CreateCommentDto),
	asyncHandler(async (request: Request, response: Response) => {
		const { _id, role } = request.currentUser;
		const savedComment = await commentService.addCommentToTicket(
			{
				commentAuthor: request.currentUser._id,
				content: request.body.content,
				ticketId: request.params.ticketId
			},
			{ _id, role }
		);
		response.status(201).send(savedComment);
	})
);

export default commentRouter;

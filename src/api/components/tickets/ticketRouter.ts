import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import grantAccess from '../../middleware/RBAC/grantAccess';
import verifyAuthentication from '../../middleware/verifyAuthentication';
import validationRules from './ticket.validationRules';
import { TicketInputDTO } from './ticket.interface';
import ticketService from './ticket.service';

const ticketRoutes = Router();

ticketRoutes.get(
	'/:ticketId/comments',
	verifyAuthentication,
	grantAccess('readAny', 'comment'),
	asyncHandler(async (request: Request, response: Response) => {
		const comments = await ticketService.getAllCommentsOnATicket(request.params.ticketId);
		response.status(200).send(comments);
	})
);

ticketRoutes.post(
	'/:ticketId/comments',
	verifyAuthentication,
	grantAccess('createOwn', 'comment'),
	asyncHandler(async (request: Request, response: Response) => {
		const savedComment = await ticketService.addCommentToTicket({
			commentAuthor: request.currentUser._id,
			content: request.body.content,
			ticketId: request.params.ticketId
		});
		response.status(201).send(savedComment);
	})
);
ticketRoutes.get(
	'/',
	verifyAuthentication,
	grantAccess('readAny', 'ticket'),
	asyncHandler(async (request: Request, response: Response) => {
		const tickets = await ticketService.getAllTickets();
		response.status(200).send(tickets);
	})
);

ticketRoutes.post(
	'/',
	verifyAuthentication,
	grantAccess('createOwn', 'ticket'),
	validate(validationRules.ticketCreation, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const ticketDetails: TicketInputDTO = { ...request.body, author: request.currentUser._id };
		const newTicket = await ticketService.createTicket(ticketDetails);
		return response.status(201).send(newTicket);
	})
);

ticketRoutes.get(
	'/:ticketId',
	verifyAuthentication,
	grantAccess('readOwn', 'ticket'),
	validate(validationRules.ticketId, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const ticket = await ticketService.getTicketById(request.params.ticketId);
		return response.status(200).send(ticket);
	})
);

ticketRoutes.patch(
	'/:ticketId',
	verifyAuthentication,
	grantAccess('updateAny', 'ticket'),
	validate(validationRules.ticketUpdate, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const update = { Id: request.params.ticketId, updatedStatus: request.body.status };
		const ticket = await ticketService.updateTicketStatus(update);
		return response.status(200).send(ticket);
	})
);

export default ticketRoutes;

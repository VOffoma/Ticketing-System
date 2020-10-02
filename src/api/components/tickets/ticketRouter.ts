import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import grantAccess from '../../middleware/RBAC/grantAccess';
import verifyAuthentication from '../../middleware/verifyAuthentication';
import validationRules from './ticket.validationRules';
import { TicketInputDTO } from './ticket.interface';
import ticketService from './ticket.service';

const ticketRoutes = Router();

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/report
 * @description This endpoint exposes the functionality for getting a report of tickets closed in the last 30 days
 */
ticketRoutes.get('/report', verifyAuthentication, async (request: Request, response: Response) => {
	const report = await ticketService.generateTicketReport();
	response.header('Content-Type', 'text/csv');
	return response.attachment(report.fileName).send(report.csvData);
});

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketId/comments
 * @description This endpoint exposes the functionality for getting all comments made on a ticket
 */
ticketRoutes.get(
	'/:ticketId/comments',
	verifyAuthentication,
	grantAccess('readAny', 'comment'),
	asyncHandler(async (request: Request, response: Response) => {
		const comments = await ticketService.getAllCommentsOnATicket(request.params.ticketId);
		response.status(200).send(comments);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketId/comments
 * @description This endpoint exposes the functionality for adding a comment to a ticket
 */

ticketRoutes.post(
	'/:ticketId/comments',
	verifyAuthentication,
	grantAccess('createOwn', 'comment'),
	asyncHandler(async (request: Request, response: Response) => {
		const savedComment = await ticketService.addCommentToTicket(
			{
				commentAuthor: request.currentUser._id,
				content: request.body.content,
				ticketId: request.params.ticketId
			},
			request.currentUser.role
		);
		response.status(201).send(savedComment);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/
 * @description This endpoint exposes the functionality for fetching tickets
 * A user would only see tickets he or she created over time
 * A supportperson would only see all tickets assigned to him or her
 * The admin will see all tickets
 */
ticketRoutes.get(
	'/',
	verifyAuthentication,
	asyncHandler(async (request: Request, response: Response) => {
		const { _id, role } = request.currentUser;
		const tickets = await ticketService.getAllTickets(_id, role);
		response.status(200).send(tickets);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/
 * @description This endpoint exposes the functionality for creating a new ticket
 */
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

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketid
 * @description This endpoint exposes the functionality for getting a single ticket
 */
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

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketid
 * @description This endpoint exposes the functionality for updating the status of a ticket
 */

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

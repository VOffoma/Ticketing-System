import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import verifyAuthentication from '../../middlewares/verifyAuthentication.middleware';
import verifyRole from '../../middlewares/access-control/verifyRole.middleware';
import validationRules from './ticket.validationRules';
import { TicketInputDTO } from './ticket.interface';
import ticketService from './ticket.service';

const ticketRouter = Router();

ticketRouter.use(verifyAuthentication);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/report
 * @description This endpoint exposes the functionality for getting a report of tickets closed in the last 30 days
 */
ticketRouter.get(
	'/report',
	verifyRole(['ADMIN', 'SUPPORT']),
	async (request: Request, response: Response) => {
		const report = await ticketService.generateTicketReport();
		response.header('Content-Type', 'text/csv');
		return response.attachment(report.fileName).send(report.csvData);
	}
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketId/comments
 * @description This endpoint exposes the functionality for getting all comments made on a ticket
 */
ticketRouter.get(
	'/:ticketId/comments',
	asyncHandler(async (request: Request, response: Response) => {
		const comments = await ticketService.getAllCommentsOnATicket(request.params.ticketId);
		response.status(200).send(comments);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketId/comments
 * @description This endpoint exposes the functionality for adding a comment to a ticket
 */

ticketRouter.post(
	'/:ticketId/comments',
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
ticketRouter.get(
	'/',
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
ticketRouter.post(
	'/',
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
ticketRouter.get(
	'/:ticketId',
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

ticketRouter.patch(
	'/:ticketId',
	verifyRole(['ADMIN', 'SUPPORT']),
	validate(validationRules.ticketUpdate, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const update = { Id: request.params.ticketId, updatedStatus: request.body.status };
		const ticket = await ticketService.updateTicketStatus(update);
		return response.status(200).send(ticket);
	})
);

export default ticketRouter;

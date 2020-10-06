import { Router, Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import verifyAuthentication from '../../middlewares/verifyAuthentication.middleware';
import verifyRole from '../../middlewares/access-control/verifyRole.middleware';
import validationMiddleware from '../../middlewares/validation.middleware';
import { CreateTicketDto, UpdateTicketDto } from './ticket.dto';
import ticketService from './ticket.service';
import commentRouter from '../comments/commentRouter';

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
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/
 * @description This endpoint exposes the functionality for fetching tickets
 * A user would only see tickets he or she created over time
 * A supportperson would only see all tickets that are open and in progress
 * The admin will see all tickets
 */
ticketRouter.get(
	'/',
	asyncHandler(async (request: Request, response: Response) => {
		const { _id, role } = request.currentUser;
		const tickets = await ticketService.getAllTickets({ _id, role });
		response.status(200).send(tickets);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/
 * @description This endpoint exposes the functionality for creating a new ticket
 */
ticketRouter.post(
	'/',
	//validate(validationRules.ticketCreation, { statusCode: 422, keyByField: true }, {}),
	validationMiddleware(CreateTicketDto),
	asyncHandler(async (request: Request, response: Response) => {
		const ticketDetails: CreateTicketDto = { ...request.body, author: request.currentUser._id };
		const newTicket = await ticketService.createTicket(ticketDetails);
		return response.status(201).send(newTicket);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketid
 * @description This endpoint exposes the functionality for getting a single ticket
 */
ticketRouter.get(
	'/:ticketId([a-f0-9]{24})',
	asyncHandler(async (request: Request, response: Response) => {
		const { _id, role } = request.currentUser;
		const ticket = await ticketService.getTicketById(request.params.ticketId, { _id, role });
		return response.status(200).send(ticket);
	})
);

/**
 * Endpoint: http://localhost:{{port}}/api/v1/tickets/:ticketid
 * @description This endpoint exposes the functionality for updating the status of a ticket
 */

// ticketRouter.patch(
// 	'/:ticketId',
// 	verifyRole(['ADMIN', 'SUPPORT']),
// 	validationMiddleware(UpdateTicketDto),
// 	asyncHandler(async (request: Request, response: Response) => {
// 		const update = { _id: request.params.ticketId, status: request.body.status };
// 		const updatedTicket = await ticketService.updateTicketStatus(update);
// 		return response.status(200).send(updatedTicket);
// 	})
// );

ticketRouter.use('/:ticketId/comments', commentRouter);

export default ticketRouter;

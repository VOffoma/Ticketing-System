import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { validate } from 'express-validation';
import verifyAuthentication from '../../middleware/verifyAuthentication';
import validationRules from './ticket.validationRules';
import { TicketInfo } from './ticket.interface';
import ticketService from './ticket.service';

const ticketRoutes = Router();

ticketRoutes.get(
	'/',
	verifyAuthentication,
	asyncHandler(async (request: Request, response: Response) => {
		const tickets = await ticketService.getAllTickets();
		response.status(200).send(tickets);
	})
);

ticketRoutes.post(
	'/',
	verifyAuthentication,
	validate(validationRules.ticketCreation, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const ticketDetails: TicketInfo = { ...request.body, author: request.currentUser._id };
		const newTicket = await ticketService.createTicket(ticketDetails);
		return response.status(201).send(newTicket);
	})
);

ticketRoutes.get(
	'/:ticketId',
	verifyAuthentication,
	validate(validationRules.ticketId, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const ticket = await ticketService.getTicketById(request.params.ticketId);
		return response.status(200).send(ticket);
	})
);

ticketRoutes.patch(
	'/:ticketId',
	verifyAuthentication,
	validate(validationRules.ticketUpdate, { statusCode: 422, keyByField: true }, {}),
	asyncHandler(async (request: Request, response: Response) => {
		const update = { Id: request.params.ticketId, updatedStatus: request.body.status };
		const ticket = await ticketService.updateTicketStatus(update);
		return response.status(200).send(ticket);
	})
);

export default ticketRoutes;

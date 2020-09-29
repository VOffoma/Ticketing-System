import createError from 'http-errors';
import TicketModel from './ticket.model';
import { TicketInfo, Ticket, TicketStatus } from './ticket.interface';

async function createTicket(ticketDetails: TicketInfo): Promise<Ticket> {
	const createdTicket = new TicketModel(ticketDetails);
	const savedTicket = createdTicket.save();
	return savedTicket;
}

async function getAllTickets(): Promise<Array<Ticket>> {
	const tickets = await TicketModel.find();
	return tickets;
}

async function getTicketById(ticketId: string): Promise<Ticket | null> {
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}
	return ticket;
}

async function updateTicketStatus(ticketUpdate: {
	Id: string;
	updatedStatus: string;
}): Promise<Ticket | null> {
	const updatedStatus = ticketUpdate.updatedStatus as TicketStatus;
	const ticket = await TicketModel.findOneAndUpdate(
		{ _id: ticketUpdate.Id },
		{ $set: { status: updatedStatus } },
		{ new: true, runValidators: true }
	);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketUpdate.Id} does not exist`);
	}
	return ticket;
}

export default {
	createTicket,
	getAllTickets,
	getTicketById,
	updateTicketStatus
};

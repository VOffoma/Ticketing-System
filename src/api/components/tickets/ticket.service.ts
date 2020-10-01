import createError from 'http-errors';
import TicketModel from './ticket.model';
import CommentModel from '../comments/comment.model';
import { TicketInputDTO, Ticket, TicketStatus } from './ticket.interface';

async function createTicket(ticketDetails: TicketInputDTO): Promise<Ticket> {
	const createdTicket = new TicketModel(ticketDetails);
	const savedTicket = await createdTicket.save();
	await savedTicket.populate('author').execPopulate();
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

async function getAllCommentsOnATicket(ticketId) {
	const comments = await CommentModel.find({ ticketId: ticketId });
	return comments;
}

async function addCommentToTicket(commentDetails) {
	const { ticketId, commentAuthor } = commentDetails;
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}
	// if ( && commentAuthor === ticket.author) {
	// 	throw createError(
	// 		403,
	// 		`You can not place a comment untill a support person has responded to your ticket`
	// 	);
	// }
	const createdComment = new CommentModel(commentDetails);
	const savedComment = await createdComment.save();
	await savedComment.populate('commentAuthor').execPopulate();
	return savedComment;
}

export default {
	createTicket,
	getAllTickets,
	getTicketById,
	updateTicketStatus,
	addCommentToTicket,
	getAllCommentsOnATicket
};

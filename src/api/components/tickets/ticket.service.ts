import createError from 'http-errors';
import TicketModel from './ticket.model';
import { Comment } from '../comments/comment.model';
import { TicketInputDTO, Ticket, TicketStatus } from './ticket.interface';
import generateCSVReport from '../../../utils/generateCSVReport';

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
	const comments = await Comment.find({ ticketId: ticketId });
	return comments;
}

async function addCommentToTicket(commentDetails) {
	const { ticketId } = commentDetails;
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}

	const savedComment = Comment.saveComment(ticket.author, commentDetails);
	return savedComment;
}

async function generateTicketReport(): Promise<Record<string, string>> {
	const today = new Date();
	const startDate = today.getDate() - 30;

	const tickets = await TicketModel.find({
		status: 'SOLVED' as TicketStatus,
		createdAt: { $gte: startDate }
	});

	const csvData: string = await generateCSVReport(
		['author', 'content', 'title', 'status', 'createdAt'],
		tickets
	);

	const fileName = `Report-${new Date().toISOString()}.csv`;
	return { fileName, csvData };
}

export default {
	createTicket,
	getAllTickets,
	getTicketById,
	updateTicketStatus,
	addCommentToTicket,
	getAllCommentsOnATicket,
	generateTicketReport
};

import createError from 'http-errors';
import { Comment, CommentDocument } from '../comments/comment.model';
import { UserRole } from '../users/user.interface';
import { CreateTicketDto, UpdateTicketDto } from './ticket.dto';
import TicketModel from './ticket.model';
import { Ticket, TicketStatus } from './ticket.interface';
import generateCSVReport from '../../../utils/generateCSVReport';

/**
 *
 * @param ticketDetails
 * @returns a object containing the newly created ticket
 */
async function createTicket(ticketDetails: CreateTicketDto): Promise<Ticket> {
	const createdTicket = new TicketModel(ticketDetails);
	const savedTicket = await createdTicket.save();
	await savedTicket.populate('author').execPopulate();
	return savedTicket;
}

/**
 * @returns array of an array of tickets depending on the role of the requesting user
 */
async function getAllTickets(currentUser: { _id: string; role: string }): Promise<Array<Ticket>> {
	const userRole = currentUser.role as UserRole;
	const userId = currentUser._id;
	let tickets;

	if (userRole === UserRole.USER) {
		tickets = await TicketModel.find({ author: userId }).sort({ createdAt: -1 });
	} else if (userRole == UserRole.SUPPORT) {
		tickets = await TicketModel.find({
			$or: [{ status: TicketStatus.OPEN }, { status: TicketStatus.INPROGRESS }]
		}).sort({ createdAt: -1 });
	} else {
		tickets = await TicketModel.find().sort({ createdAt: -1 });
	}
	return tickets;
}

/**
 *
 * @param ticketId
 * @returns a single ticket object
 */
async function getTicketById(
	ticketId: string,
	currentUser: { _id: string; role: string }
): Promise<Ticket | null> {
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}

	// This check below prevent a user who is not the ticket author or a support person or admin
	// from accessing this information
	if (currentUser.role === UserRole.USER && !ticket.author.equals(currentUser._id)) {
		throw createError(403, "You don't have enough permission to perform this action");
	}

	return ticket;
}

/**
 *
 * @param ticketUpdate object containing ticketId and future status
 * @returns an object containing the updated ticket information
 */
async function updateTicket(ticketId: string, ticketUpdate: Ticket): Promise<Ticket | null> {
	const ticket = await TicketModel.findOneAndUpdate(
		{ _id: ticketId },
		{ $set: ticketUpdate },
		{ new: true, runValidators: true }
	);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketUpdate._id} does not exist`);
	}
	return ticket;
}

/**
 * @returns csv containing a report of tickets closed in the last 30 days
 */
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
	updateTicket,
	generateTicketReport
};

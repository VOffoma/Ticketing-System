import createError from 'http-errors';
import TicketModel from './ticket.model';
import { Comment } from '../comments/comment.model';
import { UserRole } from '../users/user.interface';
import { TicketInputDTO, Ticket, TicketStatus } from './ticket.interface';
import generateCSVReport from '../../../utils/generateCSVReport';

/**
 *
 * @param ticketDetails
 * @returns a object containing the newly created ticket
 */
async function createTicket(ticketDetails: TicketInputDTO): Promise<Ticket> {
	const createdTicket = new TicketModel(ticketDetails);
	const savedTicket = await createdTicket.save();
	await savedTicket.populate('author').execPopulate();
	return savedTicket;
}

/**
 * @returns array of an array of tickets depending on the role of the requesting user
 */
async function getAllTickets(userId, role): Promise<Array<Ticket>> {
	const userRole = role as UserRole;
	let tickets;
	if (userRole === UserRole.USER) {
		tickets = await getAllTicketsForUser(userId);
	} else if (userRole == UserRole.SUPPORT) {
		tickets = await getAllTicketsForSupportPerson(userId);
	} else {
		tickets = await TicketModel.find();
	}
	return tickets;
}

/**
 *
 * @param userId
 * @returns an array of tickets by a specific user
 */
async function getAllTicketsForUser(userId) {
	const tickets = await TicketModel.find({ author: userId });
	return tickets;
}

/**
 *
 * @param userId
 * @returns an array of tickets assigned to a suppport person
 */
async function getAllTicketsForSupportPerson(userId) {
	const tickets = await TicketModel.find({ supportPerson: userId });
	return tickets;
}

/**
 *
 * @param ticketId
 * @returns a single ticket object
 */
async function getTicketById(ticketId: string): Promise<Ticket | null> {
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}
	return ticket;
}

/**
 *
 * @param ticketUpdate object containing ticketId and future status
 * @returns an object containing the updated ticket information
 */
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

/**
 *
 * @param ticketId
 * @returns an array of comments with the passed ticketId
 */
async function getAllCommentsOnATicket(ticketId) {
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}
	const comments = await Comment.find({ ticketId: ticketId });
	return comments;
}

/**
 *
 * @param commentDetails which contains content, ticketId and comentAuthor's id
 * @param currentUserRole
 * @returns an object containing the new comment
 */
async function addCommentToTicket(commentDetails, currentUserRole) {
	const { ticketId } = commentDetails;
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}
	if (!ticket.author.equals(commentDetails.commentAuthor) && currentUserRole === UserRole.USER) {
		throw createError(
			403,
			`You need to be the owner of the ticket or a support person to be able to comment`
		);
	}

	const savedComment = Comment.saveComment(ticket.author, commentDetails);
	return savedComment;
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
	updateTicketStatus,
	addCommentToTicket,
	getAllCommentsOnATicket,
	generateTicketReport
};

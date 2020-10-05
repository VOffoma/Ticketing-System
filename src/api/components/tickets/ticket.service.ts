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
		tickets = await getAllTicketsForSupportPerson();
	} else {
		tickets = await TicketModel.find().sort({ createdAt: -1 });
	}
	return tickets;
}

/**
 *
 * @param userId
 * @returns an array of tickets by a specific user
 */
async function getAllTicketsForUser(userId) {
	const tickets = await TicketModel.find({ author: userId }).sort({ createdAt: -1 });
	return tickets;
}

/**
 *
 * @param userId
 * @returns an array of tickets assigned to a suppport person
 */
async function getAllTicketsForSupportPerson() {
	const tickets = await TicketModel.find({
		$or: [{ status: TicketStatus.OPEN }, { status: TicketStatus.INPROGRESS }]
	}).sort({ createdAt: -1 });

	return tickets;
}

/**
 *
 * @param ticketId
 * @returns a single ticket object
 */
async function getTicketById(ticketId: string, currentUser): Promise<Ticket | null> {
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}
	if (currentUser.role === UserRole.USER && currentUser._id !== ticket.author) {
		throw createError(403, "You don't have enough permission to perform this action");
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
async function getAllCommentsOnATicket(ticketId, currentUser) {
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}

	if (currentUser.role === UserRole.USER && currentUser._id !== ticket.author) {
		throw createError(403, "You don't have enough permission to perform this action");
	}
	const comments = await Comment.find({ ticketId: ticketId }).sort({ createdAt: -1 });
	return comments;
}

/**
 *
 * @param commentDetails which contains content, ticketId and comentAuthor's id
 * @param currentUserRole
 * @returns an object containing the new comment
 */
async function addCommentToTicket(commentDetails, currentUser) {
	const { ticketId } = commentDetails;
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}

	if (currentUser.role === UserRole.USER && currentUser._id !== ticket.author) {
		throw createError(403, "You don't have enough permission to perform this action");
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

import createError from 'http-errors';
import { Types } from 'mongoose';
import { UserRole, CurrentUser } from '../users/user.interface';
import { User } from '../users/user.model';
import { CreateTicketDto } from './ticket.dto';
import TicketModel from './ticket.model';
import { Ticket, TicketStatus } from './ticket.interface';
import generateCSVReport from '../../../utils/generateCSVReport';
import errorMessages from '../../../utils/errorMessages';

/**
 *
 * @param ticketDetails
 * @returns a object containing the newly created ticket
 */
async function createTicket(ticketDetails: CreateTicketDto): Promise<Ticket> {
	const createdTicket = new TicketModel(ticketDetails);
	const savedTicket = await createdTicket.save();
	return savedTicket;
}

/**
 * @param currentUser
 * @returns array of an array of tickets depending on the role of the requesting user
 */

async function getAllTickets(currentUser: CurrentUser): Promise<Array<Ticket>> {
	const userRole = currentUser.role as UserRole;
	const userId = currentUser._id;
	let tickets;

	if (userRole === UserRole.USER) {
		tickets = getAllTicketsForUser(userId);
	} else if (userRole == UserRole.SUPPORT) {
		tickets = await getAllTicketsForSupport();
	} else {
		tickets = await getAllTicketsForAdmin();
	}
	return tickets;
}

async function getAllTicketsForUser(userId): Promise<Array<Ticket>> {
	const tickets = await TicketModel.find({ author: userId }).sort({ createdAt: -1 });

	return tickets;
}

async function getAllTicketsForSupport(): Promise<Array<Ticket>> {
	const tickets = await TicketModel.find({
		$or: [{ status: TicketStatus.OPEN }, { status: TicketStatus.INPROGRESS }]
	}).sort({ createdAt: -1 });

	return tickets;
}

async function getAllTicketsForAdmin(): Promise<Array<Ticket>> {
	const tickets = await TicketModel.find().sort({ createdAt: -1 });
	return tickets;
}

/**
 *
 * @param ticketId
 * @param currentUser
 * @returns a single ticket object
 */
async function getTicketById(ticketId: string, currentUser: CurrentUser): Promise<Ticket | null> {
	const ticket = await TicketModel.findOne({ _id: ticketId });

	if (!ticket) {
		throw new createError.NotFound(errorMessages.MESSAGE_RESOURCE_NOT_FOUND);
	}

	// This check below prevent a user who is not the ticket author or a support person or admin
	// from accessing this information
	if (currentUser.role === UserRole.USER && !ticket.author.equals(currentUser._id)) {
		throw new createError.Forbidden(errorMessages.MESSAGE_YOU_DONT_HAVE_REQUIRED_PERMISSIONS);
	}

	return ticket;
}

/**
 *
 * @param status
 * @returns an object containing the updated ticket information
 */
async function updateTicketStatus(ticketId: string, status: string): Promise<Ticket | null> {
	const ticket = await TicketModel.findOneAndUpdate(
		{ _id: ticketId },
		{
			$set: {
				status: status as TicketStatus
			}
		},
		{ new: true, runValidators: true }
	);

	if (!ticket) {
		throw new createError.NotFound(errorMessages.MESSAGE_RESOURCE_NOT_FOUND);
	}
	return ticket;
}

/**
 *
 * @param supportPersonId
 * @returns an object containing the updated ticket information
 */
async function assignSupport(ticketId: string, supportPersonId: string): Promise<Ticket | null> {
	const supportPerson = await User.findOne({
		_id: supportPersonId,
		$or: [{ role: UserRole.SUPPORT }, { role: UserRole.ADMIN }]
	});

	if (!supportPerson) {
		throw new createError.NotFound(errorMessages.MESSAGE_RESOURCE_NOT_FOUND);
	}

	const ticket = await TicketModel.findOneAndUpdate(
		{ _id: ticketId },
		{
			$set: {
				supportPerson: Types.ObjectId(supportPersonId),
				status: TicketStatus.INPROGRESS
			}
		},
		{ new: true, runValidators: true }
	);

	if (!ticket) {
		throw new createError.NotFound(errorMessages.MESSAGE_RESOURCE_NOT_FOUND);
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
	updateTicketStatus,
	generateTicketReport,
	assignSupport
};

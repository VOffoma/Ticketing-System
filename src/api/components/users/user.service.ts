import createError from 'http-errors';
import { User } from './user.model';
import { UserRole } from './user.interface';
import TicketModel from '../tickets/ticket.model';

/**
 *
 * @param roleUpdate which contains userId and the future role
 * @returns an object containing the updated user information
 */
async function updateUserRole(roleUpdate) {
	const { userId, newRole } = roleUpdate;

	const user = await User.findById(userId);
	if (!user) {
		throw createError(404, `User with Id ${userId} does not exist`);
	}

	const role = newRole as UserRole;

	const updatedUser = await User.findByIdAndUpdate(
		{ _id: userId },
		{ role },
		{ new: true, runValidators: true }
	);

	return updatedUser;
}

/**
 *
 * @param ticketAssignment whichs the ticketId and id of the support person who is to handle the ticket
 * @returns an object containing the updated ticket information
 */
async function assignTicketToSupport(ticketAssignment) {
	const { ticketId, supportPersonId } = ticketAssignment;

	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}

	const supportPerson = User.findOne({ _id: supportPersonId, role: UserRole.SUPPORT });

	if (!supportPerson) {
		throw createError(
			400,
			`user with id ${supportPersonId} is not a support person or does not exist`
		);
	}

	const updatedTicket = await TicketModel.findByIdAndUpdate(
		{ _id: ticketId },
		{ supportPerson: supportPersonId },
		{ new: true, runValidators: true }
	);

	return updatedTicket;
}

export default {
	updateUserRole,
	assignTicketToSupport
};

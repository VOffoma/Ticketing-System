import createError from 'http-errors';
import { Comment, CommentDocument } from './comment.model';
import { UserRole } from '../users/user.interface';
import TicketModel from '../tickets/ticket.model';

/**
 *
 * @param ticketId
 * @returns an array of comments with the passed ticketId
 */
async function getAllCommentsOnATicket(
	ticketId,
	currentUser: { _id: string; role: string }
): Promise<Array<CommentDocument>> {
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}

	// This check below prevent a user who is not the ticket author or a support person or admin
	// from accessing this information
	if (currentUser.role === UserRole.USER && !ticket.author.equals(currentUser._id)) {
		throw createError(403, "You don't have enough permission to perform this action");
	}
	const comments = await Comment.find({ ticketId: ticketId })
		.populate('commentAuthor', 'firstName lastName -_id')
		.sort({ createdAt: -1 });
	return comments;
}

/**
 *
 * @param commentDetails which contains content, ticketId and comentAuthor's id
 * @param currentUserRole
 * @returns an object containing the new comment
 */
async function addCommentToTicket(
	commentDetails,
	currentUser: { _id: string; role: string }
): Promise<CommentDocument> {
	const { ticketId } = commentDetails;
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw createError(404, `Ticket with Id ${ticketId} does not exist`);
	}

	// This check below prevent a user who is not the ticket author or a support person or admin
	// from accessing this information
	if (currentUser.role === UserRole.USER && !ticket.author.equals(currentUser._id)) {
		throw createError(403, "You don't have enough permission to perform this action");
	}

	const savedComment = Comment.saveComment(ticket.author, commentDetails);
	return savedComment;
}

export default {
	addCommentToTicket,
	getAllCommentsOnATicket
};

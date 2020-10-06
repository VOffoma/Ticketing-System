import createError from 'http-errors';
import { Comment, CommentDocument } from './comment.model';
import { UserRole, CurrentUser } from '../users/user.interface';
import TicketModel from '../tickets/ticket.model';
import errorMessages from '../../../utils/errorMessages';

/**
 *
 * @param ticketId
 * @returns an array of comments with the passed ticketId
 */
async function getAllCommentsOnATicket(
	ticketId: string,
	currentUser: CurrentUser
): Promise<Array<CommentDocument>> {
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw new createError.NotFound(errorMessages.MESSAGE_RESOURCE_NOT_FOUND);
	}

	// This check below prevent a user who is not the ticket author or a support person or admin
	// from accessing this information
	if (currentUser.role === UserRole.USER && !ticket.author.equals(currentUser._id)) {
		throw new createError.Forbidden(errorMessages.MESSAGE_YOU_DONT_HAVE_REQUIRED_PERMISSIONS);
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
	currentUser: CurrentUser
): Promise<CommentDocument> {
	const { ticketId } = commentDetails;
	const ticket = await TicketModel.findById(ticketId);
	if (!ticket) {
		throw new createError.NotFound(errorMessages.MESSAGE_RESOURCE_NOT_FOUND);
	}

	// This check below prevent a user who is not the ticket author or a support person or admin
	// from accessing this information
	if (currentUser.role === UserRole.USER && !ticket.author.equals(currentUser._id)) {
		throw new createError.Forbidden(errorMessages.MESSAGE_YOU_DONT_HAVE_REQUIRED_PERMISSIONS);
	}

	const savedComment = Comment.saveComment(ticket.author, commentDetails);
	return savedComment;
}

export default {
	addCommentToTicket,
	getAllCommentsOnATicket
};
